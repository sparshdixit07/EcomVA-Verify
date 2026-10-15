import { Verification } from '../models/Verification.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { audit } from '../utils/audit.js';
import { notify } from '../utils/notify.js';
import { paginated, parsePagination } from '../utils/pagination.js';

export const verificationService = {
  async myStatus(user) {
    const va = await VAProfile.findOne({ user: user._id });
    if (!va) throw ApiError.forbidden();
    const latest = await Verification.findOne({ va: va._id }).sort('-createdAt');
    return { verification: latest, status: va.verificationStatus };
  },

  async request(user) {
    const va = await VAProfile.findOne({ user: user._id });
    if (!va) throw ApiError.forbidden();
    if (va.verificationStatus === 'pending') throw ApiError.badRequest('Already pending');
    if (va.verificationStatus === 'verified') throw ApiError.badRequest('Already verified');

    va.verificationStatus = 'pending';
    await va.save();
    const verification = await Verification.create({
      va: va._id,
      user: user._id,
      status: 'pending'
    });
    return { verification };
  },

  async list(query) {
    const { page, limit, skip } = parsePagination(query, { page: 1, limit: 20, maxLimit: 100 });
    const filter = {};
    if (query.status && query.status !== 'all') filter.status = query.status;
    const [items, total] = await Promise.all([
      Verification.find(filter)
        .populate({ path: 'va', populate: [{ path: 'user', select: 'firstName lastName avatarUrl email' }] })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Verification.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async decide(admin, id, { status, reason }) {
    if (!['verified', 'rejected'].includes(status)) {
      throw ApiError.badRequest('Invalid decision');
    }
    const verification = await Verification.findById(id).populate('va');
    if (!verification) throw ApiError.notFound('Verification not found');
    if (verification.status === status) throw ApiError.badRequest('Already in this state');

    verification.status = status;
    verification.reason = reason || '';
    verification.decidedBy = admin._id;
    verification.decidedAt = new Date();
    await verification.save();

    const va = await VAProfile.findById(verification.va._id);
    if (va) {
      va.verificationStatus = status === 'verified' ? 'verified' : 'rejected';
      va.verifiedAt = status === 'verified' ? new Date() : null;
      await va.save();
    }

    await audit({
      actor: admin,
      action: `verification.${status}`,
      targetType: 'Verification',
      targetId: verification._id,
      description: `VA verification ${status}`,
      severity: 'info'
    });

    await notify({
      user: va.user,
      type: 'verification',
      title: status === 'verified' ? 'Your VA profile is verified' : 'Verification rejected',
      message:
        status === 'verified'
          ? 'You are now verified and will appear higher in searches.'
          : reason || 'Please review the requirements and try again.',
      link: '/va/verification',
      relatedType: 'Verification',
      relatedId: verification._id
    });

    return { verification };
  }
};