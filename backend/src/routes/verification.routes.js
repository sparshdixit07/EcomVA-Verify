import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin, requireVA } from '../middleware/rbac.js';

const router = Router();

router.get('/me', requireAuth, requireVA, verificationController.myStatus);
router.get('/', requireAuth, requireAdmin, verificationController.list);
router.post('/:id/decide', requireAuth, requireAdmin, verificationController.decide);

export default router;