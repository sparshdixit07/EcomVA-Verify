import { asyncHandler } from '../utils/asyncHandler.js';
import { shortlistService } from '../services/shortlist.service.js';

export const shortlistController = {
  list: asyncHandler(async (req, res) => {
    const result = await shortlistService.list(req.user);
    res.json(result);
  }),

  add: asyncHandler(async (req, res) => {
    const result = await shortlistService.add(req.user, req.body);
    res.status(201).json(result);
  }),

  remove: asyncHandler(async (req, res) => {
    const result = await shortlistService.remove(req.user, req.params.id);
    res.json(result);
  }),

  compare: asyncHandler(async (req, res) => {
    const result = await shortlistService.compare(req.user, req.body);
    res.json(result);
  })
};