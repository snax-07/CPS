import { Request, Response } from 'express';
import Company from '../models/Company.ts';
import Job from '../models/Job.ts';
import Application from '../models/Application.ts';
import mongoose from 'mongoose';

interface AuthRequest extends Request { user?: any; }

export const updateCompanyProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const profile = await Company.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body, user: req.user.id },
      { new: true, upsate: true }
    );
    return res.status(200).json({ message: 'Company profile updated', profile });
  } catch (error) {
    return res.status(500).json({ message: 'Profile update failed' });
  }
};

// GET /api/v1/companies/:userId
export const getCompanyProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const profile = await Company.findOne({ user: req.params.userId }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Company not found' });
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching profile' });
  }
};

// POST /api/v1/jobs
export const postJob = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const newJob = await Job.create({
      ...req.body,
      postedBy: req.user.id // Linked to the authenticated user
    });
    return res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error : any) {
    console.log(error.message)
    return res.status(500).json({ message: 'Error posting job' });
  }
};

// PATCH /api/v1/applications/:applicationId/status
export const updateApplicantStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { status } = req.body; // e.g., 'shortlisted', 'accepted', 'rejected'
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status },
      { new: true }
    ).populate('student job');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Optional: Send email notification automatically
    // await sendEmail({ 
    //   email: application.student.email, 
    //   subject: `Application Update: ${application.job.title}`,
    //   message: `Your application status has been updated to: ${status}`
    // });

    return res.status(200).json({ message: `Status updated to ${status}`, application });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status' });
  }
};

export const getMyJobPostings = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching your jobs' });
  }
};

export const viewJobApplicants = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { jobId } = req.params;
    // 1. Ensure the job belongs to this company
    const job = await Job.findOne({ _id: jobId, postedBy: req.user.id });
    if (!job) return res.status(403).json({ message: 'Unauthorized access to this job' });

    // 2. Aggregate Applications with User and Student data
    const applicants = await Application.aggregate([
      { $match: { job: new mongoose.Types.ObjectId(jobId as string) } },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: 'user',
          as: 'studentProfile'
        }
      },
      { $unwind: { path: '$studentProfile', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          status: 1,
          appliedAt: 1,
          createdAt: 1,
          name: '$userDetails.name',
          email: '$userDetails.email',
          department: { $ifNull: ['$studentProfile.department', 'Not Specified'] },
          cgpa: { $ifNull: ['$studentProfile.cgpa', 0] },
          skills: { $ifNull: ['$studentProfile.skills', []] },
          resumeUrl: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({ message: 'Error fetching applicants' });
  }
};

export const getAllCompanyApplications = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    // 1. Get all jobs posted by this company
    const jobs = await Job.find({ postedBy: req.user.id }).select('_id');
    const jobIds = jobs.map(j => j._id);

    // 2. Get all applications for those jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('student', 'name email')
      .populate('job', 'title location company')
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching applications' });
  }
};

export const stats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // 1. Get all jobs to get their IDs (for application counting)
    const allJobs = await Job.find({ postedBy: userId });
    const jobIds = allJobs.map(j => j._id);

    // 2. Count only active jobs for the metric
    const activeJobsCount = await Job.countDocuments({ postedBy: userId, status: 'active' });

    // 3. Count applications for these jobs
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    
    // 4. Count shortlisted applications
    const shortlistedCount = await Application.countDocuments({ 
      job: { $in: jobIds },
      status: 'shortlisted'
    });

    return res.status(200).json({
      activeJobs: activeJobsCount,
      totalApplicants: totalApplications,
      shortlisted: shortlistedCount,
      profileViews: 0 
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || error
    });
  }
};