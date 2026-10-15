import { Task } from '../models/Task.js';
import { Engagement } from '../models/Engagement.js';
import { Performance } from '../models/Performance.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';
import { notify } from '../utils/notify.js';

async function recomputePerformance(engagementId) {
  const engagement = await Engagement.findById(engagementId);
  if (!engagement) return;
  const tasks = await Task.find({ engagement: engagementId });
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'approved').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const onTimeTotal = tasks.filter((t) => t.status === 'approved').length;
  const onTime = tasks.filter(
    (t) => t.status === 'approved' && t.approvedAt && t.deadline && t.approvedAt <= t.deadline
  ).length;
  const onTimeRate = onTimeTotal > 0 ? Math.round((onTime / onTimeTotal) * 100) : 0;

  const revisionCount = tasks.filter((t) => t.status === 'revision').length;
  const accuracy = total > 0 ? Math.round(((total - revisionCount) / total) * 100) : 0;

  const overallScore = Math.round(completionRate * 0.4 + onTimeRate * 0.35 + accuracy * 0.25);

  await Performance.findOneAndUpdate(
    { va: engagement.va, engagement: engagementId },
    {
      $set: {
        va: engagement.va,
        engagement: engagementId,
        tasksCompleted: completed,
        taskCompletionRate: completionRate,
        onTimeRate,
        accuracy,
        overallScore,
        lastCalculatedAt: new Date()
      }
    },
    { upsert: true, new: true }
  );

  // Update VA profile rollup
  const all = await Performance.find({ va: engagement.va });
  if (all.length) {
    const agg = {
      overallScore: Math.round(all.reduce((s, p) => s + (p.overallScore || 0), 0) / all.length),
      tasksCompleted: all.reduce((s, p) => s + (p.tasksCompleted || 0), 0),
      taskCompletionRate: Math.round(
        all.reduce((s, p) => s + (p.taskCompletionRate || 0), 0) / all.length
      ),
      onTimeRate: Math.round(all.reduce((s, p) => s + (p.onTimeRate || 0), 0) / all.length),
      accuracy: Math.round(all.reduce((s, p) => s + (p.accuracy || 0), 0) / all.length)
    };
    await VAProfile.findByIdAndUpdate(engagement.va, { performance: agg });
  }
}

async function loadEngagementForUser(user, engagementId) {
  const engagement = await Engagement.findById(engagementId);
  if (!engagement) throw ApiError.notFound('Engagement not found');
  if (
    user.role !== 'admin' &&
    String(engagement.clientUser) !== String(user._id) &&
    String(engagement.vaUser) !== String(user._id)
  ) {
    throw ApiError.forbidden();
  }
  return engagement;
}

export const taskService = {
  async create(user, payload) {
    if (user.role !== 'client') throw ApiError.forbidden('Only clients can create tasks');
    const engagement = await loadEngagementForUser(user, payload.engagementId);
    if (engagement.status !== 'active') throw ApiError.badRequest('Engagement is not active');

    const deadline = new Date(payload.deadline);
    if (Number.isNaN(deadline.getTime())) throw ApiError.badRequest('Invalid deadline');

    const task = await Task.create({
      engagement: engagement._id,
      client: engagement.client,
      va: engagement.va,
      createdBy: user._id,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      deadline,
      status: 'pending'
    });

    await notify({
      user: engagement.vaUser,
      type: 'task_assigned',
      title: 'New task assigned',
      message: task.title,
      link: `/va/tasks`,
      relatedType: 'Task',
      relatedId: task._id
    });
    return { task };
  },

  async listByEngagement(user, engagementId, query) {
    await loadEngagementForUser(user, engagementId);
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 100, maxLimit: 200 });
    const filter = { engagement: engagementId };
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      Task.find(filter).sort('-createdAt').skip(skip).limit(limit),
      Task.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async listMine(user, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = {};
    if (user.role === 'va') filter.va = (await VAProfile.findOne({ user: user._id }))?._id;
    else if (user.role === 'client') filter.client = (await import('../models/ClientProfile.js')).ClientProfile ? null : null;
    if (query.status) filter.status = query.status;

    if (user.role === 'client') {
      const { ClientProfile } = await import('../models/ClientProfile.js');
      const profile = await ClientProfile.findOne({ user: user._id });
      filter.client = profile?._id;
    }

    const [items, total] = await Promise.all([
      Task.find(filter)
        .populate({ path: 'engagement', select: 'title status' })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(user, id) {
    const task = await Task.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    const engagement = await loadEngagementForUser(user, task.engagement);
    return { task, engagement };
  },

  async update(user, id, payload) {
    const task = await Task.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    if (user.role !== 'client' && String(task.createdBy) !== String(user._id)) throw ApiError.forbidden();
    if (task.status === 'approved') throw ApiError.badRequest('Cannot edit approved task');
    const fields = ['title', 'description', 'priority'];
    for (const f of fields) if (payload[f] !== undefined) task[f] = payload[f];
    if (payload.deadline) {
      const d = new Date(payload.deadline);
      if (Number.isNaN(d.getTime())) throw ApiError.badRequest('Invalid deadline');
      task.deadline = d;
    }
    await task.save();
    return { task };
  },

  async start(user, id) {
    const task = await Task.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    if (user.role !== 'va' || String(task.va) !== String((await VAProfile.findOne({ user: user._id }))?._id)) {
      throw ApiError.forbidden();
    }
    if (task.status !== 'pending' && task.status !== 'revision') {
      throw ApiError.badRequest('Invalid state');
    }
    task.status = 'in_progress';
    await task.save();
    return { task };
  },

  async submit(user, id, { content }) {
    const task = await Task.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    const va = await VAProfile.findOne({ user: user._id });
    if (!va || String(task.va) !== String(va._id)) throw ApiError.forbidden();
    if (!['in_progress', 'revision'].includes(task.status)) throw ApiError.badRequest('Invalid state');
    task.submission = {
      content,
      attachments: task.submission?.attachments || [],
      submittedAt: new Date()
    };
    task.status = 'submitted';
    await task.save();
    return { task };
  },

  async approve(user, id) {
    const task = await Task.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    if (user.role !== 'client' || String(task.client) !== String((await (await import('../models/ClientProfile.js')).ClientProfile.findOne({ user: user._id }))?._id)) {
      // also allow admin
      if (user.role !== 'admin') throw ApiError.forbidden();
    }
    if (task.status !== 'submitted') throw ApiError.badRequest('Invalid state');
    task.status = 'approved';
    task.approvedAt = new Date();
    task.completedAt = task.approvedAt;
    await task.save();
    await recomputePerformance(task.engagement);
    const engagement = await Engagement.findById(task.engagement);
    await notify({
      user: engagement.vaUser,
      type: 'task_approved',
      title: 'Task approved',
      message: task.title,
      link: `/va/tasks`,
      relatedType: 'Task',
      relatedId: task._id
    });
    return { task };
  },

  async requestRevision(user, id, { feedback }) {
    const task = await Task.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    const { ClientProfile } = await import('../models/ClientProfile.js');
    const profile = await ClientProfile.findOne({ user: user._id });
    if (user.role !== 'client' || !profile || String(task.client) !== String(profile._id)) {
      if (user.role !== 'admin') throw ApiError.forbidden();
    }
    if (task.status !== 'submitted') throw ApiError.badRequest('Invalid state');
    task.status = 'revision';
    task.revisionFeedback = feedback;
    await task.save();

    const engagement = await Engagement.findById(task.engagement);
    await notify({
      user: engagement.vaUser,
      type: 'task_revision',
      title: 'Revision requested',
      message: task.title,
      link: `/va/tasks`,
      relatedType: 'Task',
      relatedId: task._id
    });
    return { task };
  },

  async cancel(user, id) {
    const task = await Task.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    if (user.role !== 'client' && user.role !== 'admin') throw ApiError.forbidden();
    if (task.status === 'approved') throw ApiError.badRequest('Cannot cancel approved task');
    task.status = 'cancelled';
    await task.save();
    return { task };
  }
};