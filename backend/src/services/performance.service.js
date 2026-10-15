import { Performance } from '../models/Performance.js';
import { VAProfile } from '../models/VAProfile.js';
import { ApiError } from '../utils/ApiError.js';

export const performanceService = {
  async mine(user) {
    const va = await VAProfile.findOne({ user: user._id });
    if (!va) throw ApiError.forbidden();
    const agg = va.performance || {};
    return { performance: { ...agg, updatedAt: va.updatedAt } };
  },

  async forVA(vaId) {
    const va = await VAProfile.findById(vaId);
    if (!va) throw ApiError.notFound('VA not found');
    const perEngagement = await Performance.find({ va: vaId });
    return { performance: va.performance || {}, perEngagement };
  },

  async forEngagement(engagementId) {
    const p = await Performance.findOne({ engagement: engagementId });
    return { performance: p };
  }
};