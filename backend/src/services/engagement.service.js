import { Engagement } from '../models/Engagement.js';
import { Task } from '../models/Task.js';
import { Performance } from '../models/Performance.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';

async function loadEngagement(user, id) {
  const engagement = await Engagement.findById(id)
    .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl email' } })
    .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName avatarUrl email' } });
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

export const engagementService = {
  async listMine(user, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = {};
    if (user.role === 'client') filter.clientUser = user._id;
    else if (user.role === 'va') filter.vaUser = user._id;
    if (query.status) filter.status = query.status;

    const [items, total] = await Promise.all([
      Engagement.find(filter)
        .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
        .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Engagement.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(user, id) {
    const engagement = await loadEngagement(user, id);
    const tasks = await Task.find({ engagement: engagement._id }).sort('-createdAt');
    return { engagement, tasks };
  },

  async update(user, id, payload) {
    const engagement = await loadEngagement(user, id);
    if (user.role !== 'client' && user.role !== 'admin') throw ApiError.forbidden();
    if (payload.title !== undefined) engagement.title = payload.title;
    if (payload.rate !== undefined) engagement.rate = payload.rate;
    if (payload.hoursPerWeek !== undefined) engagement.hoursPerWeek = payload.hoursPerWeek;
    await engagement.save();
    return { engagement };
  },

  async complete(user, id) {
    const engagement = await loadEngagement(user, id);
    if (user.role !== 'client' && user.role !== 'admin') throw ApiError.forbidden();
    if (engagement.status === 'completed') return { engagement };
    engagement.status = 'completed';
    engagement.endDate = new Date();
    await engagement.save();

    await Performance.findOneAndUpdate(
      { va: engagement.va, engagement: engagement._id },
      { $setOnInsert: { va: engagement.va, engagement: engagement._id } },
      { upsert: true }
    );
    return { engagement };
  },

  async cancel(user, id) {
    const engagement = await loadEngagement(user, id);
    if (user.role !== 'client' && user.role !== 'admin') throw ApiError.forbidden();
    engagement.status = 'cancelled';
    engagement.endDate = new Date();
    await engagement.save();
    return { engagement };
  }
};