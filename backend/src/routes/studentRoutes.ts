import { type NextFunction, Router } from 'express';
import { getStudentProfile, createOrUpdateProfile, uploadResume, getStudentProfileById } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// Public-ish route: any authenticated user can view a student profile by userId
router.get('/profile/:userId', (authenticate as unknown) as (req: any, res: any, next: NextFunction) => void, getStudentProfileById);

// Student-only routes
router.get('/profile', authorize('student') as NextFunction, getStudentProfile);
router.post('/profile', authorize('student') as NextFunction, createOrUpdateProfile);
router.post('/resume', authorize('student') as NextFunction, upload.single('resume'), uploadResume);

export default router;