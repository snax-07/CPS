import { Router } from 'express';
import authRoutes from './authRoutes.ts';
import studentRoutes from './studentRoutes.ts';
import jobRoutes from './jobRoutes.ts';
import companyRoutes from './companyRoutes.ts';
import { authenticate } from '../middleware/authMiddleware.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', authenticate as any, studentRoutes);
router.use('/jobs', authenticate as any, jobRoutes);
router.use('/companies', authenticate as any, companyRoutes);

export default router;