import { asyncHandler } from '../utils/asyncHandler.js';
import { reviewService } from '../services/review.service.js';

export const reviewController = {
  create: asyncHandler(async (req, res) => {
    const result = await reviewService.create(req.user, req.body);
    res.status(201).json(result);
  }),

  listForVA: asyncHandler(async (req, res) => {
    const result = await reviewService.listForVA(req.params.vaId, req.query);
    res.json(result);
  }),

  listMine: asyncHandler(async (req, res) => {
    const result = await reviewService.listMine(req.user, req.query);
    res.json(result);
  }),

  listAll: asyncHandler(async (req, res) => {
    const result = await reviewService.listAll(req.query);
    res.json(result);
  }),

  moderate: asyncHandler(async (req, res) => {
    const result = await reviewService.moderate(req.user, req.params.id, req.body);
    res.json(result);
  }),

  flag: asyncHandler(async (req, res) => {
    const result = await reviewService.flag(req.user, req.params.id, req.body.reason);
    res.json(result);
  })
};