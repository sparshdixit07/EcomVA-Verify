import { Router } from 'express';
import { vaController } from '../controllers/va.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { requireVA } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  updateVAProfileSchema,
  vaSkillSchema,
  vaSearchSchema
} from '../validators/va.validator.js';

const router = Router();

router.get('/', optionalAuth, validate(vaSearchSchema, 'query'), vaController.search);
router.get('/me', requireAuth, requireVA, vaController.getMine);
router.put('/me', requireAuth, requireVA, validate(updateVAProfileSchema), vaController.updateMine);
router.get('/me/dashboard', requireAuth, requireVA, vaController.dashboard);
router.post('/me/skills', requireAuth, requireVA, validate(vaSkillSchema), vaController.addSkill);
router.put('/me/skills/:skillId', requireAuth, requireVA, vaController.updateSkill);
router.delete('/me/skills/:skillId', requireAuth, requireVA, vaController.removeSkill);
router.post('/me/verification', requireAuth, requireVA, vaController.requestVerification);
router.get('/:id', vaController.getById);

export default router;