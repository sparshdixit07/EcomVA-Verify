import { asyncHandler } from '../utils/asyncHandler.js';
import { taskService } from '../services/task.service.js';

export const taskController = {
  create: asyncHandler(async (req, res) => {
    const result = await taskService.create(req.user, req.body);
    res.status(201).json(result);
  }),

  listByEngagement: asyncHandler(async (req, res) => {
    const result = await taskService.listByEngagement(
      req.user,
      req.params.engagementId,
      req.query
    );
    res.json(result);
  }),

  listMine: asyncHandler(async (req, res) => {
    const result = await taskService.listMine(req.user, req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await taskService.getById(req.user, req.params.id);
    res.json(result);
  }),

  update: asyncHandler(async (req, res) => {
    const result = await taskService.update(req.user, req.params.id, req.body);
    res.json(result);
  }),

  start: asyncHandler(async (req, res) => {
    const result = await taskService.start(req.user, req.params.id);
    res.json(result);
  }),

  submit: asyncHandler(async (req, res) => {
    const result = await taskService.submit(req.user, req.params.id, req.body);
    res.json(result);
  }),

  approve: asyncHandler(async (req, res) => {
    const result = await taskService.approve(req.user, req.params.id);
    res.json(result);
  }),

  requestRevision: asyncHandler(async (req, res) => {
    const result = await taskService.requestRevision(req.user, req.params.id, req.body);
    res.json(result);
  }),

  cancel: asyncHandler(async (req, res) => {
    const result = await taskService.cancel(req.user, req.params.id);
    res.json(result);
  })
};