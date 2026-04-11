import { NextFunction, Router } from 'express';
import { createJob, getAllJobs, getJobById, deleteJob, createApplication, updateJob } from '../controllers/jobController.ts';
import { authorize } from '../middleware/authMiddleware.ts';
import { applyToJob, getStudentApplications, getMyApplications } from '../controllers/appController.ts';

const router = Router();

router.get('/', getAllJobs);
router.get('/my-applications', authorize('student') as NextFunction, getMyApplications);
router.get('/:id', getJobById);
router.post('/update' , authorize("company" , 'admin') as NextFunction , updateJob)
router.post('/', authorize('admin', 'company') as NextFunction, createJob);
router.delete('/:id', authorize('admin') as NextFunction, deleteJob);
router.post('/:jobId/apply' , authorize('student') as NextFunction , applyToJob)


router.get('/:id/application-status' , authorize('student') as NextFunction , getStudentApplications)
export default router;