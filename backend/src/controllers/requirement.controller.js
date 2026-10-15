import { asyncHandler } from '../utils/asyncHandler.js';
import { requirementService } from '../services/requirement.service.js';

export const requirementController = {
  create: asyncHandler(async (req, res) => {
    const result = await requirementService.create(req.user, req.body);
    res.status(201).json(result);
  }),

  listMine: asyncHandler(async (req, res) => {
    const result = await requirementService.listMine(req.user, req.query);
    res.json(result);
  }),

  list: asyncHandler(async (req, res) => {
    const result = await requirementService.list(req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await requirementService.getById(req.params.id, req.user);
    res.json(result);
  }),

  update: asyncHandler(async (req, res) => {
    const result = await requirementService.update(req.user, req.params.id, req.body);
    res.json(result);
  }),

  remove: asyncHandler(async (req, res) => {
    const result = await requirementService.remove(req.user, req.params.id);
    res.json(result);
  })
};