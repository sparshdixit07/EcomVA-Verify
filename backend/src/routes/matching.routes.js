import { Router } from 'express';
import { matchingController } from '../controllers/matching.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireClient } from '../middleware/rbac.js';

const router = Router();

router.get('/requirements/:requirementId', requireAuth, requireClient, matchingController.matchForRequirement);
router.post('/preview', requireAuth, requireClient, matchingController.preview);

export default router;