import { asyncHandler } from '../utils/asyncHandler.js';
import { matchingService } from '../services/matching.service.js';

export const matchingController = {
  matchForRequirement: asyncHandler(async (req, res) => {
    const result = await matchingService.matchForRequirement(
      req.params.requirementId,
      req.user,
      req.query
    );
    res.json(result);
  }),

  preview: asyncHandler(async (req, res) => {
    const result = await matchingService.preview(req.body);
    res.json(result);
  })
};