import { Router } from 'express';
import { skillController } from '../controllers/skill.controller.js';

const router = Router();

router.get('/', skillController.list);
router.get('/:id', skillController.getById);

export default router;