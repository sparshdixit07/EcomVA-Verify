import { asyncHandler } from '../utils/asyncHandler.js';
import { engagementService } from '../services/engagement.service.js';

export const engagementController = {
  listMine: asyncHandler(async (req, res) => {
    const result = await engagementService.listMine(req.user, req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await engagementService.getById(req.user, req.params.id);
    res.json(result);
  }),

  update: asyncHandler(async (req, res) => {
    const result = await engagementService.update(req.user, req.params.id, req.body);
    res.json(result);
  }),

  complete: asyncHandler(async (req, res) => {
    const result = await engagementService.complete(req.user, req.params.id);
    res.json(result);
  }),

  cancel: asyncHandler(async (req, res) => {
    const result = await engagementService.cancel(req.user, req.params.id);
    res.json(result);
  })
};