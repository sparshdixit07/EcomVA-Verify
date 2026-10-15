import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import clientRoutes from './client.routes.js';
import vaRoutes from './va.routes.js';
import skillRoutes from './skill.routes.js';
import requirementRoutes from './requirement.routes.js';
import matchingRoutes from './matching.routes.js';
import assessmentRoutes from './assessment.routes.js';
import verificationRoutes from './verification.routes.js';
import trialTaskRoutes from './trialTask.routes.js';
import shortlistRoutes from './shortlist.routes.js';
import hiringRoutes from './hiring.routes.js';
import engagementRoutes from './engagement.routes.js';
import taskRoutes from './task.routes.js';
import performanceRoutes from './performance.routes.js';
import reviewRoutes from './review.routes.js';
import notificationRoutes from './notification.routes.js';
import messageRoutes from './message.routes.js';
import reportRoutes from './report.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/vas', vaRoutes);
router.use('/skills', skillRoutes);
router.use('/requirements', requirementRoutes);
router.use('/matching', matchingRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/verification', verificationRoutes);
router.use('/trial-tasks', trialTaskRoutes);
router.use('/shortlists', shortlistRoutes);
router.use('/hiring', hiringRoutes);
router.use('/engagements', engagementRoutes);
router.use('/tasks', taskRoutes);
router.use('/performance', performanceRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;