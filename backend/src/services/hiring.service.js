import { HiringRequest } from '../models/HiringRequest.js';
import { Engagement } from '../models/Engagement.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { VAProfile } from '../models/VAProfile.js';
import { TrialTask } from '../models/TrialTask.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';
import { notify } from '../utils/notify.js';

async function ensureClient(user) {
  let p = await ClientProfile.findOne({ user: user._id });
  if (!p) p = await ClientProfile.create({ user: user._id });
  return p;
}

export const hiringService = {
  async create(user, payload) {
    const client = await ensureClient(user);
    const va = await VAProfile.findById(payload.vaId);
    if (!va) throw ApiError.notFound('VA not found');
    if (String(va.user) === String(user._id)) throw ApiError.badRequest('Cannot hire yourself');

    const existing = await HiringRequest.findOne({
      client: client._id,
      va: va._id,
      status: { $in: ['pending', 'accepted', 'active'] }
    });
    if (existing) throw ApiError.conflict('Hiring request already exists');

    let trialTaskId = null;
    if (payload.trialTaskId) {
      const t = await TrialTask.findOne({
        _id: payload.trialTaskId,
        client: client._id,
        va: va._id
      });
      if (!t) throw ApiError.badRequest('Trial task not found or not yours');
      trialTaskId = t._id;
    }

    const hiring = await HiringRequest.create({
      client: client._id,
      clientUser: user._id,
      va: va._id,
      vaUser: va.user,
      requirement: payload.requirementId || null,
      trialTask: trialTaskId,
      message: payload.message || '',
      proposedRate: payload.proposedRate ?? null,
      hoursPerWeek: payload.hoursPerWeek ?? null,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      status: 'pending'
    });

    await notify({
      user: va.user,
      type: 'hiring_request',
      title: 'New hiring request',
      message: payload.message || 'You have received a hiring request.',
      link: `/va/hiring`,
      relatedType: 'HiringRequest',
      relatedId: hiring._id
    });

    return { hiring };
  },

  async listMine(user, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = {};
    if (user.role === 'client') filter.clientUser = user._id;
    else if (user.role === 'va') filter.vaUser = user._id;
    if (query.status) filter.status = query.status;

    const [items, total] = await Promise.all([
      HiringRequest.find(filter)
        .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
        .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      HiringRequest.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(id, user) {
    const hiring = await HiringRequest.findById(id)
      .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl email' } })
      .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName avatarUrl email' } });
    if (!hiring) throw ApiError.notFound('Hiring request not found');
    if (
      user.role !== 'admin' &&
      String(hiring.clientUser) !== String(user._id) &&
      String(hiring.vaUser) !== String(user._id)
    ) {
      throw ApiError.forbidden();
    }
    return { hiring };
  },

  async accept(user, id) {
    const hiring = await HiringRequest.findById(id);
    if (!hiring) throw ApiError.notFound('Hiring request not found');
    if (String(hiring.vaUser) !== String(user._id)) throw ApiError.forbidden();
    if (hiring.status !== 'pending') throw ApiError.badRequest('Invalid state');

    hiring.status = 'accepted';
    hiring.respondedAt = new Date();
    await hiring.save();

    const engagement = await Engagement.create({
      hiringRequest: hiring._id,
      client: hiring.client,
      clientUser: hiring.clientUser,
      va: hiring.va,
      vaUser: hiring.vaUser,
      title: '',
      rate: hiring.proposedRate ?? null,
      hoursPerWeek: hiring.hoursPerWeek ?? null,
      startDate: hiring.startDate || new Date(),
      status: 'active'
    });

    hiring.status = 'active';
    hiring.engagement = engagement._id;
    await hiring.save();

    await notify({
      user: hiring.clientUser,
      type: 'hiring_status',
      title: 'Hiring request accepted',
      message: 'Your hiring request was accepted.',
      link: `/client/hiring`,
      relatedType: 'HiringRequest',
      relatedId: hiring._id
    });

    return { hiring, engagement };
  },

  async reject(user, id, reason) {
    const hiring = await HiringRequest.findById(id);
    if (!hiring) throw ApiError.notFound('Hiring request not found');
    if (String(hiring.vaUser) !== String(user._id)) throw ApiError.forbidden();
    if (hiring.status !== 'pending') throw ApiError.badRequest('Invalid state');
    hiring.status = 'rejected';
    hiring.rejectionReason = reason || '';
    hiring.respondedAt = new Date();
    await hiring.save();
    await notify({
      user: hiring.clientUser,
      type: 'hiring_status',
      title: 'Hiring request rejected',
      message: reason || 'Your hiring request was rejected.',
      link: `/client/hiring`,
      relatedType: 'HiringRequest',
      relatedId: hiring._id
    });
    return { hiring };
  },

  async cancel(user, id) {
    const hiring = await HiringRequest.findById(id);
    if (!hiring) throw ApiError.notFound('Hiring request not found');
    if (String(hiring.clientUser) !== String(user._id) && user.role !== 'admin') {
      throw ApiError.forbidden();
    }
    if (!['pending', 'accepted'].includes(hiring.status)) {
      throw ApiError.badRequest('Cannot cancel');
    }
    hiring.status = 'cancelled';
    await hiring.save();
    return { hiring };
  },

  async complete(user, id) {
    const hiring = await HiringRequest.findById(id);
    if (!hiring) throw ApiError.notFound('Hiring request not found');
    if (String(hiring.clientUser) !== String(user._id) && user.role !== 'admin') {
      throw ApiError.forbidden();
    }
    if (hiring.status !== 'active') throw ApiError.badRequest('Invalid state');
    hiring.status = 'completed';
    await hiring.save();
    if (hiring.engagement) {
      await Engagement.findByIdAndUpdate(hiring.engagement, {
        status: 'completed',
        endDate: new Date()
      });
    }
    return { hiring };
  }
};