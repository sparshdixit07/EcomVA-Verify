import { VAProfile } from '../models/VAProfile.js';
import { Skill } from '../models/Skill.js';
import { AssessmentResult } from '../models/AssessmentResult.js';
import { TrialTask } from '../models/TrialTask.js';
import { Engagement } from '../models/Engagement.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination, parseSort } from '../utils/pagination.js';

async function ensureProfile(user) {
  let profile = await VAProfile.findOne({ user: user._id });
  if (!profile) {
    profile = await VAProfile.create({ user: user._id });
  }
  return profile;
}

const ENGLISH_RANK = {
  basic: 1,
  conversational: 2,
  professional: 3,
  fluent: 4,
  native: 5
};

export const vaService = {
  async getMine(user) {
    const profile = await ensureProfile(user);
    await profile.populate('skills.skill');
    return { profile };
  },

  async updateMine(user, payload) {
    const profile = await ensureProfile(user);
    const fields = [
      'headline',
      'bio',
      'country',
      'timezone',
      'languages',
      'hourlyRate',
      'yearsExperience',
      'englishLevel',
      'availability',
      'portfolioUrl'
    ];
    for (const f of fields) {
      if (payload[f] !== undefined) profile[f] = payload[f];
    }
    await profile.save();
    return { profile };
  },

  async addSkill(user, payload) {
    const profile = await ensureProfile(user);
    const skill = await Skill.findById(payload.skillId);
    if (!skill) throw ApiError.notFound('Skill not found');
    const exists = profile.skills.some((s) => String(s.skill) === String(skill._id));
    if (exists) throw ApiError.conflict('Skill already added');
    profile.skills.push({
      skill: skill._id,
      name: skill.name,
      platform: payload.platform,
      yearsExperience: payload.yearsExperience,
      level: payload.level
    });
    await profile.save();
    return { profile };
  },

  async updateSkill(user, skillRowId, payload) {
    const profile = await ensureProfile(user);
    const row = profile.skills.id(skillRowId);
    if (!row) throw ApiError.notFound('Skill row not found');
    if (payload.platform !== undefined) row.platform = payload.platform;
    if (payload.yearsExperience !== undefined) row.yearsExperience = payload.yearsExperience;
    if (payload.level !== undefined) row.level = payload.level;
    await profile.save();
    return { profile };
  },

  async removeSkill(user, skillRowId) {
    const profile = await ensureProfile(user);
    const row = profile.skills.id(skillRowId);
    if (!row) throw ApiError.notFound('Skill row not found');
    profile.skills.pull(skillRowId);
    await profile.save();
    return { profile };
  },

  async requestVerification(user) {
    const profile = await ensureProfile(user);
    if (profile.verificationStatus === 'verified') throw ApiError.badRequest('Already verified');
    if (profile.verificationStatus === 'pending') throw ApiError.badRequest('Verification pending');
    profile.verificationStatus = 'pending';
    await profile.save();
    return { profile };
  },

  async dashboard(user) {
    const profile = await ensureProfile(user);

    const [assessmentsPassed, pendingTrials, activeEngagements, recentNotifications, pendingTrialList, activeEngagementList] =
      await Promise.all([
        AssessmentResult.countDocuments({ va: profile._id, passed: true }),
        TrialTask.countDocuments({ va: profile._id, status: { $in: ['assigned', 'accepted'] } }),
        Engagement.countDocuments({ va: profile._id, status: 'active' }),
        user._id
          ? (await import('../models/Notification.js')).Notification.find({ user: user._id })
              .sort('-createdAt')
              .limit(5)
          : [],
        TrialTask.find({ va: profile._id, status: { $in: ['assigned', 'accepted'] } })
          .sort('deadline')
          .limit(5),
        Engagement.find({ va: profile._id, status: 'active' })
          .populate({ path: 'client', populate: { path: 'user', select: 'firstName lastName avatarUrl' } })
          .sort('-createdAt')
          .limit(5)
      ]);

    await profile.populate('skills.skill');

    return {
      profile,
      stats: { assessmentsPassed, pendingTrials, activeEngagements },
      pendingTrials: pendingTrialList,
      activeEngagements: activeEngagementList,
      recentNotifications
    };
  },

  async search(query) {
    const { page, limit, skip } = parsePagination(query);
    const sort = parseSort(
      query.sort,
      ['createdAt', 'hourlyRate', 'performance.overallScore'],
      '-performance.overallScore'
    );

    const filter = {};

    if (query.verified === 'true') filter.verificationStatus = 'verified';
    if (query.verified === 'false') filter.verificationStatus = { $ne: 'verified' };
    if (query.platform) filter['skills.platform'] = query.platform;
    if (query.english) filter.englishLevel = query.english;

    if (query.skill) {
      const skill = await Skill.findOne({
        $or: [
          { slug: query.skill.toLowerCase() },
          { name: new RegExp(`^${query.skill}$`, 'i') }
        ]
      });
      if (skill) filter['skills.skill'] = skill._id;
      else filter['skills.skill'] = { $exists: false };
    }

    if (query.q) {
      const re = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ headline: re }, { bio: re }, { country: re }, { 'skills.name': re }];
    }

    const [items, total] = await Promise.all([
      VAProfile.find(filter)
        .populate('user', 'firstName lastName avatarUrl createdAt')
        .populate('skills.skill', 'name category')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      VAProfile.countDocuments(filter)
    ]);

    return paginated(items, total, page, limit);
  },

  async getById(id) {
    const va = await VAProfile.findById(id)
      .populate('user', 'firstName lastName avatarUrl createdAt')
      .populate('skills.skill', 'name category');
    if (!va) throw ApiError.notFound('VA not found');
    return { va };
  },

  ENGLISH_RANK
};