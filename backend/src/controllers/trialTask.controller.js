import { asyncHandler } from '../utils/asyncHandler.js';
import { trialTaskService } from '../services/trialTask.service.js';

export const trialTaskController = {
  create: asyncHandler(async (req, res) => {
    const result = await trialTaskService.create(req.user, req.body);
    res.status(201).json(result);
  }),

  listMine: asyncHandler(async (req, res) => {
    const result = await trialTaskService.listMine(req.user, req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await trialTaskService.getById(req.params.id, req.user);
    res.json(result);
  }),

  accept: asyncHandler(async (req, res) => {
    const result = await trialTaskService.accept(req.user, req.params.id);
    res.json(result);
  }),

  submit: asyncHandler(async (req, res) => {
    const result = await trialTaskService.submit(req.user, req.params.id, req.body);
    res.json(result);
  }),

  review: asyncHandler(async (req, res) => {
    const result = await trialTaskService.review(req.user, req.params.id, req.body);
    res.json(result);
  }),

  cancel: asyncHandler(async (req, res) => {
    const result = await trialTaskService.cancel(req.user, req.params.id);
    res.json(result);
  })
};