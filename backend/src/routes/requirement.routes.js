import { Router } from 'express';
import { requirementController } from '../controllers/requirement.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireClient } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  createRequirementSchema,
  updateRequirementSchema
} from '../validators/requirement.validator.js';

const router = Router();

router.get('/', requireAuth, requirementController.list);
router.get('/mine', requireAuth, requireClient, requirementController.listMine);
router.post('/', requireAuth, requireClient, validate(createRequirementSchema), requirementController.create);
router.get('/:id', requireAuth, requirementController.getById);
router.put('/:id', requireAuth, requireClient, validate(updateRequirementSchema), requirementController.update);
router.delete('/:id', requireAuth, requireClient, requirementController.remove);

export default router;