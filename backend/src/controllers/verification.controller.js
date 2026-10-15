import { asyncHandler } from '../utils/asyncHandler.js';
import { verificationService } from '../services/verification.service.js';

export const verificationController = {
  myStatus: asyncHandler(async (req, res) => {
    const result = await verificationService.myStatus(req.user);
    res.json(result);
  }),

  list: asyncHandler(async (req, res) => {
    const result = await verificationService.list(req.query);
    res.json(result);
  }),

  decide: asyncHandler(async (req, res) => {
    const result = await verificationService.decide(req.user, req.params.id, req.body);
    res.json(result);
  })
};