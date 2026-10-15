import { VAProfile } from '../models/VAProfile.js';
import { ClientRequirement } from '../models/ClientRequirement.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Centralised, deterministic matching weights.
 * Adjust here, not scattered across the codebase.
 */
export const MATCH_WEIGHTS = {
  platform: 0.15,
  skills: 0.25,
  experience: 0.10,
  english: 0.10,
  availability: 0.05,
  timezone: 0.05,
  budget: 0.10,
  assessment: 0.10,
  practical: 0.10
};

const ENGLISH_RANK = {
  basic: 1,
  conversational: 2,
  professional: 3,
  fluent: 4,
  native: 5
};

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function platformScore(required, vaSkills, vaPlatformFallback) {
  if (!required) return 100;
  if (required === 'both') {
    const hasAmazon = vaSkills.some((s) => s.platform === 'amazon' || s.platform === 'both');
    const hasShopify = vaSkills.some((s) => s.platform === 'shopify' || s.platform === 'both');
    return hasAmazon && hasShopify ? 100 : hasAmazon || hasShopify ? 60 : 30;
  }
  const match = vaSkills.some((s) => s.platform === required || s.platform === 'both');
  if (match) return 100;
  if (vaPlatformFallback === required) return 90;
  return 30;
}

function skillScore(requiredSkillIds, vaSkills) {
  if (!requiredSkillIds.length) return 100;
  const vaIds = new Set(vaSkills.map((s) => String(s.skill?._id || s.skill)));
  const matched = requiredSkillIds.filter((id) => vaIds.has(String(id))).length;
  return clamp((matched / requiredSkillIds.length) * 100);
}

function experienceScore(yearsRequired, vaYears) {
  if (!yearsRequired) return 100;
  if (!vaYears) return 40;
  if (vaYears >= yearsRequired) return 100;
  return clamp((vaYears / yearsRequired) * 100);
}

function englishScore(required, vaLevel) {
  if (!required) return 100;
  const req = ENGLISH_RANK[required] || 3;
  const va = ENGLISH_RANK[vaLevel] || 3;
  if (va >= req) return 100;
  const diff = req - va;
  return clamp(100 - diff * 25);
}

function availabilityScore(required, vaAvail) {
  if (!required) return 100;
  if (required === vaAvail) return 100;
  if (required === 'part_time' && vaAvail === 'full_time') return 90;
  if (required === 'full_time' && vaAvail === 'part_time') return 60;
  if (required === 'hourly') return 80;
  return 70;
}

function timezoneScore(required, vaTz) {
  if (!required) return 100;
  if (!vaTz) return 70;
  if (required === vaTz) return 100;
  const strip = (s) => s.replace('Asia/', '');
  if (strip(required) === strip(vaTz)) return 100;
  return 75;
}

function budgetScore(min, max, vaRate) {
  if (min == null && max == null) return 100;
  if (vaRate == null) return 70;
  if (max != null && vaRate <= max && (min == null || vaRate >= min)) return 100;
  if (max != null && vaRate > max) {
    const overshoot = (vaRate - max) / (max || 1);
    return clamp(100 - overshoot * 100);
  }
  if (min != null && vaRate < min) return 90;
  return 80;
}

export const matchingService = {
  score(requirement, va) {
    const requiredSkillIds = (requirement.requiredSkills || []).map((s) => String(s._id || s));
    const vaSkills = va.skills || [];

    const factors = {
      platform: platformScore(requirement.platform, vaSkills, va.platform),
      skills: skillScore(requiredSkillIds, vaSkills),
      experience: experienceScore(requirement.yearsExperience || 0, va.yearsExperience || 0),
      english: englishScore(requirement.englishLevel, va.englishLevel),
      availability: availabilityScore(requirement.availability, va.availability),
      timezone: timezoneScore(requirement.timezone, va.timezone),
      budget: budgetScore(requirement.budgetMin, requirement.budgetMax, va.hourlyRate),
      assessment: clamp(va.assessmentAverage ?? 60),
      practical: clamp(va.practicalAverage ?? 60)
    };

    let total = 0;
    for (const [key, weight] of Object.entries(MATCH_WEIGHTS)) {
      total += (factors[key] || 0) * weight;
    }
    const score = Math.round(clamp(total));

    const reasons = [];
    if (factors.platform >= 90) reasons.push('Platform match');
    else if (factors.platform >= 60) reasons.push('Partial platform fit');
    if (factors.skills >= 80) reasons.push('Strong skill overlap');
    else if (factors.skills >= 50) reasons.push('Some relevant skills');
    if (factors.experience >= 90) reasons.push('Meets experience level');
    if (factors.english >= 90) reasons.push('English level meets requirement');
    if (factors.budget >= 90) reasons.push('Within budget');
    if (factors.assessment >= 80) reasons.push('High assessment score');
    if (factors.practical >= 80) reasons.push('Strong practical work');
    if (va.verificationStatus === 'verified') reasons.push('Verified VA');
    if (!reasons.length) reasons.push('Low overall match');

    return { score, factors, reasons };
  },

  async matchForRequirement(requirementId, user, query = {}) {
    const requirement = await ClientRequirement.findById(requirementId).populate(
      'requiredSkills',
      'name category platform'
    );
    if (!requirement) throw ApiError.notFound('Requirement not found');
    if (user && user.role === 'client' && String(requirement.user) !== String(user._id)) {
      throw ApiError.forbidden();
    }

    const limit = Math.min(parseInt(query.limit, 10) || 20, 50);
    const candidates = await VAProfile.find({})
      .populate('user', 'firstName lastName avatarUrl')
      .populate('skills.skill', 'name category')
      .limit(200);

    const scored = candidates
      .map((va) => {
        const { score, factors, reasons } = this.score(requirement, va);
        return { va, score, factors, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return { requirement, items: scored };
  },

  async preview(payload) {
    const candidates = await VAProfile.find({})
      .populate('user', 'firstName lastName avatarUrl')
      .populate('skills.skill', 'name category')
      .limit(100);

    const scored = candidates
      .map((va) => {
        const { score, factors, reasons } = this.score(payload, va);
        return { va, score, factors, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return { items: scored };
  }
};