import { Review } from '../models/Review.js';
import { Engagement } from '../models/Engagement.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';
import { notify } from '../utils/notify.js';

export const reviewService = {
  async create(user, { engagementId, rating, comment }) {
    const engagement = await Engagement.findById(engagementId);
    if (!engagement) throw ApiError.notFound('Engagement not found');
    if (String(engagement.clientUser) !== String(user._id)) throw ApiError.forbidden();
    if (!['active', 'completed'].includes(engagement.status)) {
      throw ApiError.badRequest('Engagement must be active or completed');
    }
    const existing = await Review.findOne({ engagement: engagement._id });
    if (existing) throw ApiError.conflict('Review already submitted for this engagement');

    const client = await ClientProfile.findOne({ user: user._id });
    if (!client) throw ApiError.badRequest('Client profile missing');

    const review = await Review.create({
      client: client._id,
      clientUser: user._id,
      va: engagement.va,
      engagement: engagement._id,
      rating,
      comment,
      status: 'published'
    });

    // Update VA's client rating
    const all = await Review.find({ va: engagement.va, status: 'published' });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    const va = await VAProfile.findById(engagement.va);
    if (va) {
      if (!va.performance) va.performance = {};
      va.performance.clientRating = Math.round(avg * 100) / 100;
      await va.save();
    }

    await notify({
      user: engagement.vaUser,
      type: 'review',
      title: 'New review received',
      message: `${rating}★ — ${comment.slice(0, 100)}`,
      link: `/va/reviews`,
      relatedType: 'Review',
      relatedId: review._id
    });

    return { review };
  },

  async listForVA(vaId, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 10, maxLimit: 50 });
    const filter = { va: vaId, status: 'published' };
    const [items, total] = await Promise.all([
      Review.find(filter)
        .populate('client', 'companyName')
        .populate('clientUser', 'firstName lastName avatarUrl')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter)
    ]);
    const all = await Review.find({ va: vaId, status: 'published' });
    const averageRating = all.length
      ? Math.round((all.reduce((s, r) => s + r.rating, 0) / all.length) * 100) / 100
      : null;
    return { ...paginated(items, total, page, limit), averageRating };
  },

  async listMine(user, query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 10, maxLimit: 100 });
    const filter = { clientUser: user._id };
    const [items, total] = await Promise.all([
      Review.find(filter)
        .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async listAll(query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = {};
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      Review.find(filter)
        .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName' } })
        .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName email' } })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async moderate(admin, id, { status, reason }) {
    const review = await Review.findById(id);
    if (!review) throw ApiError.notFound('Review not found');
    review.status = status;
    review.flagReason = reason || '';
    review.moderatedBy = admin._id;
    review.moderatedAt = new Date();
    await review.save();
    return { review };
  },

  async flag(user, id, reason) {
    const review = await Review.findById(id);
    if (!review) throw ApiError.notFound('Review not found');
    review.status = 'flagged';
    review.flagReason = reason;
    await review.save();
    return { review };
  }
};