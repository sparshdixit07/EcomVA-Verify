import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireClient, requireVA } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  submitTaskSchema,
  revisionSchema
} from '../validators/task.validator.js';

const router = Router();

router.get('/mine', requireAuth, taskController.listMine);
router.get('/engagement/:engagementId', requireAuth, taskController.listByEngagement);
router.post('/', requireAuth, requireClient, validate(createTaskSchema), taskController.create);
router.get('/:id', requireAuth, taskController.getById);
router.patch('/:id', requireAuth, requireClient, validate(updateTaskSchema), taskController.update);
router.post('/:id/start', requireAuth, requireVA, taskController.start);
router.post('/:id/submit', requireAuth, requireVA, validate(submitTaskSchema), taskController.submit);
router.post('/:id/approve', requireAuth, requireClient, taskController.approve);
router.post('/:id/revision', requireAuth, requireClient, validate(revisionSchema), taskController.requestRevision);
router.post('/:id/cancel', requireAuth, taskController.cancel);

export default router;