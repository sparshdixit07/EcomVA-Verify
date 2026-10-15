import { ClientRequirement } from '../models/ClientRequirement.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { Skill } from '../models/Skill.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination } from '../utils/pagination.js';

async function ensureProfile(user) {
  let profile = await ClientProfile.findOne({ user: user._id });
  if (!profile) profile = await ClientProfile.create({ user: user._id });
  return profile;
}

async function validateSkills(requiredSkills) {
  const skills = await Skill.find({ _id: { $in: requiredSkills } });
  if (skills.length !== requiredSkills.length) {
    throw ApiError.badRequest('One or more skills do not exist');
  }
}

export const requirementService = {
  async create(user, payload) {
    const profile = await ensureProfile(user);
    await validateSkills(payload.requiredSkills);
    const requirement = await ClientRequirement.create({
      ...payload,
      client: profile._id,
      user: user._id,
      status: 'open'
    });
    return { requirement };
  },

  async listMine(user, query) {
    const profile = await ensureProfile(user);
    const { page, limit, skip } = parsePagination(query);
    const filter = { client: profile._id };
    if (query.status) filter.status = query.status;
    const [items, total] = await Promise.all([
      ClientRequirement.find(filter).sort('-createdAt').skip(skip).limit(limit),
      ClientRequirement.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  },

  async getById(id, user) {
    const requirement = await ClientRequirement.findById(id)
      .populate('requiredSkills', 'name category platform')
      .populate('client');
    if (!requirement) throw ApiError.notFound('Requirement not found');
    if (user && user.role === 'client' && String(requirement.user) !== String(user._id)) {
      throw ApiError.forbidden('Not your requirement');
    }
    return { requirement };
  },

  async update(user, id, payload) {
    const requirement = await ClientRequirement.findById(id);
    if (!requirement) throw ApiError.notFound('Requirement not found');
    if (String(requirement.user) !== String(user._id)) throw ApiError.forbidden();
    if (payload.requiredSkills) await validateSkills(payload.requiredSkills);
    const fields = [
      'title',
      'description',
      'platform',
      'requiredSkills',
      'englishLevel',
      'timezone',
      'availability',
      'budgetMin',
      'budgetMax',
      'budgetCurrency',
      'hoursPerWeek',
      'status'
    ];
    for (const f of fields) {
      if (payload[f] !== undefined) requirement[f] = payload[f];
    }
    await requirement.save();
    return { requirement };
  },

  async remove(user, id) {
    const requirement = await ClientRequirement.findById(id);
    if (!requirement) throw ApiError.notFound('Requirement not found');
    if (String(requirement.user) !== String(user._id)) throw ApiError.forbidden();
    await requirement.deleteOne();
    return { ok: true };
  },

  async list(query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { status: 'open' };
    if (query.platform) filter.platform = query.platform;
    const [items, total] = await Promise.all([
      ClientRequirement.find(filter).sort('-createdAt').skip(skip).limit(limit),
      ClientRequirement.countDocuments(filter)
    ]);
    return paginated(items, total, page, limit);
  }
};