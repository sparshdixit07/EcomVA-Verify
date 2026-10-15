import { asyncHandler } from '../utils/asyncHandler.js';
import { vaService } from '../services/va.service.js';

export const vaController = {
  getMine: asyncHandler(async (req, res) => {
    const result = await vaService.getMine(req.user);
    res.json(result);
  }),

  updateMine: asyncHandler(async (req, res) => {
    const result = await vaService.updateMine(req.user, req.body);
    res.json(result);
  }),

  dashboard: asyncHandler(async (req, res) => {
    const result = await vaService.dashboard(req.user);
    res.json(result);
  }),

  search: asyncHandler(async (req, res) => {
    const result = await vaService.search(req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await vaService.getById(req.params.id);
    res.json(result);
  }),

  addSkill: asyncHandler(async (req, res) => {
    const result = await vaService.addSkill(req.user, req.body);
    res.json(result);
  }),

  updateSkill: asyncHandler(async (req, res) => {
    const result = await vaService.updateSkill(req.user, req.params.skillId, req.body);
    res.json(result);
  }),

  removeSkill: asyncHandler(async (req, res) => {
    const result = await vaService.removeSkill(req.user, req.params.skillId);
    res.json(result);
  }),

  requestVerification: asyncHandler(async (req, res) => {
    const { verificationService } = await import('../services/verification.service.js');
    const result = await verificationService.request(req.user);
    res.json(result);
  })
};