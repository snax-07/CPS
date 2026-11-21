import { Router } from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import jobRoutes from './jobRoutes.js';
import companyRoutes from './companyRoutes.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', authenticate as any, studentRoutes);
router.use('/jobs', authenticate as any, jobRoutes);
router.use('/companies', authenticate as any, companyRoutes);

export default router;