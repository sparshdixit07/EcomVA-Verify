import { Router } from 'express';
import { engagementController } from '../controllers/engagement.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateEngagementSchema } from '../validators/engagement.validator.js';

const router = Router();

router.get('/mine', requireAuth, engagementController.listMine);
router.get('/:id', requireAuth, engagementController.getById);
router.patch('/:id', requireAuth, validate(updateEngagementSchema), engagementController.update);
router.post('/:id/complete', requireAuth, engagementController.complete);
router.post('/:id/cancel', requireAuth, engagementController.cancel);

export default router;