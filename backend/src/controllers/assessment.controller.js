import { asyncHandler } from '../utils/asyncHandler.js';
import { assessmentService } from '../services/assessment.service.js';

export const assessmentController = {
  list: asyncHandler(async (req, res) => {
    const result = await assessmentService.list(req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await assessmentService.getById(req.params.id);
    res.json(result);
  }),

  create: asyncHandler(async (req, res) => {
    const result = await assessmentService.create(req.user, req.body);
    res.status(201).json(result);
  }),

  update: asyncHandler(async (req, res) => {
    const result = await assessmentService.update(req.params.id, req.body);
    res.json(result);
  }),

  remove: asyncHandler(async (req, res) => {
    const result = await assessmentService.remove(req.params.id);
    res.json(result);
  }),

  listQuestions: asyncHandler(async (req, res) => {
    const result = await assessmentService.listQuestions(req.params.assessmentId);
    res.json(result);
  }),

  createQuestion: asyncHandler(async (req, res) => {
    const result = await assessmentService.createQuestion(req.params.assessmentId, req.body);
    res.status(201).json(result);
  }),

  updateQuestion: asyncHandler(async (req, res) => {
    const result = await assessmentService.updateQuestion(
      req.params.assessmentId,
      req.params.questionId,
      req.body
    );
    res.json(result);
  }),

  deleteQuestion: asyncHandler(async (req, res) => {
    const result = await assessmentService.deleteQuestion(
      req.params.assessmentId,
      req.params.questionId
    );
    res.json(result);
  }),

  submit: asyncHandler(async (req, res) => {
    const result = await assessmentService.submit(req.user, req.params.id, req.body);
    res.json(result);
  }),

  myResults: asyncHandler(async (req, res) => {
    const result = await assessmentService.myResults(req.user);
    res.json(result);
  })
};