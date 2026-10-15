import { ClientProfile } from '../models/ClientProfile.js';
import { ClientRequirement } from '../models/ClientRequirement.js';
import { Shortlist } from '../models/Shortlist.js';
import { Engagement } from '../models/Engagement.js';
import { TrialTask } from '../models/TrialTask.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';

async function ensureProfile(user) {
  let profile = await ClientProfile.findOne({ user: user._id });
  if (!profile) {
    profile = await ClientProfile.create({ user: user._id });
  }
  return profile;
}

export const clientService = {
  async getMine(user) {
    const profile = await ensureProfile(user);
    return { profile };
  },

  async updateMine(user, payload) {
    const profile = await ensureProfile(user);
    const fields = [
      'companyName',
      'website',
      'platform',
      'country',
      'timezone',
      'contactEmail',
      'about',
      'categories'
    ];
    for (const f of fields) {
      if (payload[f] !== undefined) profile[f] = payload[f];
    }
    await profile.save();
    return { profile };
  },

  async dashboard(user) {
    const profile = await ensureProfile(user);

    const [openRequirements, shortlisted, activeEngagements, pendingTrials, recentRequirements, activeEngagementList] =
      await Promise.all([
        ClientRequirement.countDocuments({ client: profile._id, status: 'open' }),
        Shortlist.countDocuments({ client: profile._id }),
        Engagement.countDocuments({ client: profile._id, status: 'active' }),
        TrialTask.countDocuments({ client: profile._id, status: { $in: ['assigned', 'accepted', 'submitted'] } }),
        ClientRequirement.find({ client: profile._id }).sort('-createdAt').limit(5),
        Engagement.find({ client: profile._id, status: 'active' })
          .populate({ path: 'va', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
          .sort('-createdAt')
          .limit(5)
      ]);

    return {
      stats: {
        openRequirements,
        shortlisted,
        activeEngagements,
        pendingTrials
      },
      recentRequirements,
      activeEngagements: activeEngagementList,
      pendingActions: []
    };
  },

  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const [items, total] = await Promise.all([
      ClientProfile.find({})
        .populate('user', 'firstName lastName email avatarUrl status createdAt')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      ClientProfile.countDocuments({})
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(id) {
    const profile = await ClientProfile.findById(id).populate(
      'user',
      'firstName lastName email avatarUrl createdAt'
    );
    if (!profile) throw ApiError.notFound('Client not found');
    return { profile };
  }
};