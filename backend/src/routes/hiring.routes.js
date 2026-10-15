import { Router } from 'express';
import { hiringController } from '../controllers/hiring.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireClient, requireVA } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { createHiringSchema, rejectHiringSchema } from '../validators/hiring.validator.js';

const router = Router();

router.get('/mine', requireAuth, hiringController.listMine);
router.post('/', requireAuth, requireClient, validate(createHiringSchema), hiringController.create);
router.get('/:id', requireAuth, hiringController.getById);
router.post('/:id/accept', requireAuth, requireVA, hiringController.accept);
router.post('/:id/reject', requireAuth, requireVA, validate(rejectHiringSchema), hiringController.reject);
router.post('/:id/cancel', requireAuth, requireClient, hiringController.cancel);
router.post('/:id/complete', requireAuth, hiringController.complete);

export default router;