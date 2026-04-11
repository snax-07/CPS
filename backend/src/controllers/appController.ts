import { Request, Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';

interface AuthRequest extends Request { user?: any }
export const applyToJob = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { jobId } = req.params;
    console.log(jobId, req.file)
    const { applyMethod } = req.body;

    // 1. Prevent duplicate applications
    const alreadyApplied = await Application.findOne({ job: jobId, student: (req.user as any).id });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // 2. Create the Application
    const applicationData: any = {
      job: jobId,
      student: (req?.user as any).id,
      applyMethod,
      status: 'pending'
    };

    if (applyMethod === 'resume') {
      if (req.file) {
        applicationData.resumeUrl = req.file.path; 
      } else if (req.body.resumeUrl) {
        applicationData.resumeUrl = req.body.resumeUrl;
      } else {
        return res.status(400).json({ message: 'Resume file is required' });
      }
    }

    const application = new Application(applicationData);
    await application.save();

    // 3. Update Job Applicant Count ($inc is atomic and safe)
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    return res.status(201).json({ 
      message: `Applied successfully using ${applyMethod}`, 
      application 
    });

  } catch (error: any) {
    console.log(error.message)
    return res.status(500).json({ message: 'Application failed', error: error.message });
  }
};
export const getStudentApplications = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const app = await Application.findOne({ job : req.params.id , student : req.user.id });
    return res.status(200).json({ applied: !!app, application: app });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching application status' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    console.log("Fetching applications for student:", req.user.id);
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location description salary deadline'
      })
      .sort({ createdAt: -1 });
    
    return res.status(200).json(applications);
  } catch (error) {
    console.error('Error in getMyApplications:', error);
    return res.status(500).json({ message: 'Error fetching your applications' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { status } = req.body; // 'accepted', 'rejected', 'interview'
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    return res.status(200).json({ message: 'Status updated', application });
  } catch (error) {
    return res.status(500).json({ message: 'Update failed' });
  }
};

export const getJobApplicants = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const applicants = await Application.find({ job: req.params.jobId }).populate('student');
    return res.status(200).json(applicants);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching applicants' });
  }
};