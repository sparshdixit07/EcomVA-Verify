import { asyncHandler } from '../utils/asyncHandler.js';
import { performanceService } from '../services/performance.service.js';

export const performanceController = {
  myPerformance: asyncHandler(async (req, res) => {
    const result = await performanceService.mine(req.user);
    res.json(result);
  }),

  forVA: asyncHandler(async (req, res) => {
    const result = await performanceService.forVA(req.params.vaId);
    res.json(result);
  }),

  forEngagement: asyncHandler(async (req, res) => {
    const result = await performanceService.forEngagement(req.params.engagementId);
    res.json(result);
  })
};