import { asyncHandler } from '../utils/asyncHandler.js';
import { reportService } from '../services/report.service.js';

export const reportController = {
  create: asyncHandler(async (req, res) => {
    const result = await reportService.create(req.user, req.body);
    res.status(201).json(result);
  }),

  listMine: asyncHandler(async (req, res) => {
    const result = await reportService.listMine(req.user, req.query);
    res.json(result);
  }),

  list: asyncHandler(async (req, res) => {
    const result = await reportService.list(req.query);
    res.json(result);
  }),

  resolve: asyncHandler(async (req, res) => {
    const result = await reportService.resolve(req.user, req.params.id, req.body);
    res.json(result);
  })
};