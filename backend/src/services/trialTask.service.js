import { TrialTask } from '../models/TrialTask.js';
import { TrialSubmission } from '../models/TrialSubmission.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';
import { notify } from '../utils/notify.js';

async function ensureClient(user) {
  let p = await ClientProfile.findOne({ user: user._id });
  if (!p) p = await ClientProfile.create({ user: user._id });
  return p;
}

export const trialTaskService = {
  async create(user, payload) {
    const client = await ensureClient(user);
    const va = await VAProfile.findById(payload.vaId);
    if (!va) throw ApiError.notFound('VA not found');
    const deadline = new Date(payload.deadline);
    if (Number.isNaN(deadline.getTime())) throw ApiError.badRequest('Invalid deadline');

    const task = await TrialTask.create({
      client: client._id,
      clientUser: user._id,
      va: va._id,
      vaUser: va.user,
      requirement: payload.requirementId || null,
      title: payload.title,
      brief: payload.brief,
      deadline,
      compensation: payload.compensation || 0,
      status: 'assigned'
    });

    await notify({
      user: va.user,
      type: 'trial_task',
      title: 'New trial task assigned',
      message: task.title,
      link: `/va/trial-tasks/${task._id}`,
      relatedType: 'TrialTask',
      relatedId: task._id
    });

    return { trialTask: task };
  },

  async listMine(user, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    let filter = {};
    if (user.role === 'client') {
      const client = await ensureClient(user);
      filter.client = client._id;
    } else if (user.role === 'va') {
      const va = await VAProfile.findOne({ user: user._id });
      if (!va) return paginated([], 0, page, limit);
      filter.va = va._id;
    }
    if (query.status) filter.status = query.status;

    const [items, total] = await Promise.all([
      TrialTask.find(filter)
        .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
        .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      TrialTask.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(id, user) {
    const task = await TrialTask.findById(id)
      .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl email' } })
      .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName avatarUrl email' } });
    if (!task) throw ApiError.notFound('Trial task not found');

    if (user.role === 'client' && String(task.clientUser) !== String(user._id)) {
      throw ApiError.forbidden();
    }
    if (user.role === 'va' && String(task.vaUser) !== String(user._id)) {
      throw ApiError.forbidden();
    }

    const submission = await TrialSubmission.findOne({ trialTask: task._id }).sort('-createdAt');
    const obj = task.toObject();
    obj.submission = submission;
    return { trialTask: obj };
  },

  async accept(user, id) {
    const task = await TrialTask.findById(id);
    if (!task) throw ApiError.notFound('Trial task not found');
    if (String(task.vaUser) !== String(user._id)) throw ApiError.forbidden();
    if (task.status !== 'assigned') throw ApiError.badRequest('Invalid state');
    task.status = 'accepted';
    await task.save();

    await notify({
      user: task.clientUser,
      type: 'trial_task',
      title: 'Trial task accepted',
      message: task.title,
      link: `/client/trial-tasks/${task._id}`,
      relatedType: 'TrialTask',
      relatedId: task._id
    });
    return { trialTask: task };
  },

  async submit(user, id, { content }) {
    const task = await TrialTask.findById(id);
    if (!task) throw ApiError.notFound('Trial task not found');
    if (String(task.vaUser) !== String(user._id)) throw ApiError.forbidden();
    if (!['accepted', 'assigned'].includes(task.status)) {
      throw ApiError.badRequest('Cannot submit in current state');
    }
    const va = await VAProfile.findOne({ user: user._id });
    const submission = await TrialSubmission.create({
      trialTask: task._id,
      va: va._id,
      user: user._id,
      content,
      submittedAt: new Date()
    });
    task.status = 'submitted';
    await task.save();

    await notify({
      user: task.clientUser,
      type: 'trial_submission',
      title: 'Trial submission received',
      message: task.title,
      link: `/client/trial-tasks/${task._id}`,
      relatedType: 'TrialTask',
      relatedId: task._id
    });
    return { submission };
  },

  async review(user, id, { score, feedback, passed }) {
    const task = await TrialTask.findById(id);
    if (!task) throw ApiError.notFound('Trial task not found');
    if (String(task.clientUser) !== String(user._id)) throw ApiError.forbidden();
    if (task.status !== 'submitted') throw ApiError.badRequest('Nothing to review');

    task.review = {
      score,
      feedback,
      passed,
      reviewedAt: new Date(),
      reviewedBy: user._id
    };
    task.status = passed ? 'passed' : 'rejected';
    await task.save();

    // Update VA practical average
    const va = await VAProfile.findById(task.va);
    if (va) {
      const { TrialTask: TT } = await import('../models/TrialTask.js');
      const allReviewed = await TT.find({
        va: va._id,
        'review.score': { $ne: null }
      });
      if (allReviewed.length) {
        const avg = Math.round(
          allReviewed.reduce((sum, t) => sum + (t.review?.score || 0), 0) / allReviewed.length
        );
        va.practicalAverage = avg;
        await va.save();
      }
    }

    await notify({
      user: task.vaUser,
      type: 'trial_task',
      title: passed ? 'Trial task passed' : 'Trial task not passed',
      message: task.title,
      link: `/va/trial-tasks/${task._id}`,
      relatedType: 'TrialTask',
      relatedId: task._id
    });
    return { trialTask: task };
  },

  async cancel(user, id) {
    const task = await TrialTask.findById(id);
    if (!task) throw ApiError.notFound('Trial task not found');
    if (String(task.clientUser) !== String(user._id) && user.role !== 'admin') throw ApiError.forbidden();
    if (!['assigned', 'accepted', 'submitted'].includes(task.status)) {
      throw ApiError.badRequest('Cannot cancel in current state');
    }
    task.status = 'cancelled';
    await task.save();
    return { trialTask: task };
  }
};