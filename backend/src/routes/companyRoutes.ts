import {type  NextFunction, Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { 
  updateCompanyProfile, 
  getCompanyProfile, 
  postJob, 
  getMyJobPostings, 
  viewJobApplicants, 
  updateApplicantStatus, 
  getAllCompanyApplications,
  stats
} from '../controllers/companyController.js';

const router = Router();

// Protect all company routes
router.use((authenticate as unknown) as (req: any, res: any, next: NextFunction) => void);
router.use((authorize('company') as unknown) as (req: any, res: any, next: NextFunction) => void);

router.get('/stats' , stats);
router.get('/profile/:userId', getCompanyProfile);
router.patch('/profile', updateCompanyProfile); // Updates logged-in company
router.post('/jobs', postJob);
router.get('/my-jobs', getMyJobPostings);
router.get('/jobs/:jobId/applicants', viewJobApplicants);
router.get('/all-applications', getAllCompanyApplications);
router.patch('/applications/:applicationId/status', updateApplicantStatus);


export default router;