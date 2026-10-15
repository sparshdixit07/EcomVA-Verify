import { Router } from 'express';
import { trialTaskController } from '../controllers/trialTask.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireClient, requireVA } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  createTrialTaskSchema,
  submitTrialTaskSchema,
  reviewTrialTaskSchema
} from '../validators/trialTask.validator.js';

const router = Router();

router.get('/mine', requireAuth, trialTaskController.listMine);
router.post('/', requireAuth, requireClient, validate(createTrialTaskSchema), trialTaskController.create);
router.get('/:id', requireAuth, trialTaskController.getById);
router.post('/:id/accept', requireAuth, requireVA, trialTaskController.accept);
router.post('/:id/submit', requireAuth, requireVA, validate(submitTrialTaskSchema), trialTaskController.submit);
router.post('/:id/review', requireAuth, requireClient, validate(reviewTrialTaskSchema), trialTaskController.review);
router.post('/:id/cancel', requireAuth, trialTaskController.cancel);

export default router;