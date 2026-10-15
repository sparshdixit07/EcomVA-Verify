import { Router } from 'express';
import { assessmentController } from '../controllers/assessment.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin, requireVA } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  createAssessmentSchema,
  updateAssessmentSchema,
  createQuestionSchema,
  updateQuestionSchema,
  submitAssessmentSchema
} from '../validators/assessment.validator.js';

const router = Router();

router.get('/', requireAuth, assessmentController.list);
router.get('/me/results', requireAuth, requireVA, assessmentController.myResults);
router.post('/', requireAuth, requireAdmin, validate(createAssessmentSchema), assessmentController.create);

router.get('/:assessmentId/questions', requireAuth, requireAdmin, assessmentController.listQuestions);
router.post(
  '/:assessmentId/questions',
  requireAuth,
  requireAdmin,
  validate(createQuestionSchema),
  assessmentController.createQuestion
);
router.put(
  '/:assessmentId/questions/:questionId',
  requireAuth,
  requireAdmin,
  validate(updateQuestionSchema),
  assessmentController.updateQuestion
);
router.delete(
  '/:assessmentId/questions/:questionId',
  requireAuth,
  requireAdmin,
  assessmentController.deleteQuestion
);

router.get('/:id', requireAuth, assessmentController.getById);
router.put('/:id', requireAuth, requireAdmin, validate(updateAssessmentSchema), assessmentController.update);
router.delete('/:id', requireAuth, requireAdmin, assessmentController.remove);
router.post('/:id/submit', requireAuth, requireVA, validate(submitAssessmentSchema), assessmentController.submit);

export default router;