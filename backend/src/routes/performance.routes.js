import { Router } from 'express';
import { performanceController } from '../controllers/performance.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireVA } from '../middleware/rbac.js';

const router = Router();

router.get('/me', requireAuth, requireVA, performanceController.myPerformance);
router.get('/va/:vaId', requireAuth, performanceController.forVA);
router.get('/engagement/:engagementId', requireAuth, performanceController.forEngagement);

export default router;