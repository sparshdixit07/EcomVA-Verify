import { asyncHandler } from '../utils/asyncHandler.js';
import { hiringService } from '../services/hiring.service.js';

export const hiringController = {
  create: asyncHandler(async (req, res) => {
    const result = await hiringService.create(req.user, req.body);
    res.status(201).json(result);
  }),

  listMine: asyncHandler(async (req, res) => {
    const result = await hiringService.listMine(req.user, req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await hiringService.getById(req.params.id, req.user);
    res.json(result);
  }),

  accept: asyncHandler(async (req, res) => {
    const result = await hiringService.accept(req.user, req.params.id);
    res.json(result);
  }),

  reject: asyncHandler(async (req, res) => {
    const result = await hiringService.reject(req.user, req.params.id, req.body.reason);
    res.json(result);
  }),

  cancel: asyncHandler(async (req, res) => {
    const result = await hiringService.cancel(req.user, req.params.id);
    res.json(result);
  }),

  complete: asyncHandler(async (req, res) => {
    const result = await hiringService.complete(req.user, req.params.id);
    res.json(result);
  })
};