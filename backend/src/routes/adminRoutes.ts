import { NextFunction, Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.ts';
import { getAllUsers, deleteUser, getSystemStats, verifyUser } from '../controllers/adminController.ts';

const router = Router();

// 1. Authenticate all admin routes
router.use((authenticate as unknown) as (req: any, res: any, next: NextFunction) => void);
router.use((authorize('company') as unknown) as (req: any, res: any, next: NextFunction) => void);

// 2. Admin operations
router.get('/users', getAllUsers);
router.get('/stats', getSystemStats);
router.patch('/verify/:id', verifyUser);
router.delete('/user/:id', deleteUser);

export default router;