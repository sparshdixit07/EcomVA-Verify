import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin, requireClient } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  createReviewSchema,
  moderateReviewSchema,
  flagReviewSchema
} from '../validators/review.validator.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, reviewController.listAll);
router.get('/mine', requireAuth, requireClient, reviewController.listMine);
router.post('/', requireAuth, requireClient, validate(createReviewSchema), reviewController.create);
router.get('/va/:vaId', reviewController.listForVA);
router.post('/:id/moderate', requireAuth, requireAdmin, validate(moderateReviewSchema), reviewController.moderate);
router.post('/:id/flag', requireAuth, validate(flagReviewSchema), reviewController.flag);

export default router;