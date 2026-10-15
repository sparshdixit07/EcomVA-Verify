import { asyncHandler } from '../utils/asyncHandler.js';
import { clientService } from '../services/client.service.js';

export const clientController = {
  getMine: asyncHandler(async (req, res) => {
    const result = await clientService.getMine(req.user);
    res.json(result);
  }),

  updateMine: asyncHandler(async (req, res) => {
    const result = await clientService.updateMine(req.user, req.body);
    res.json(result);
  }),

  dashboard: asyncHandler(async (req, res) => {
    const result = await clientService.dashboard(req.user);
    res.json(result);
  }),

  list: asyncHandler(async (req, res) => {
    const result = await clientService.list(req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await clientService.getById(req.params.id);
    res.json(result);
  })
};