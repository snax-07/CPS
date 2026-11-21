import type { Request, Response } from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

interface AuthRequest extends Request { user?: any; }

export const createJob = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { title, description, location, salary, requirements, deadline } = req.body;
    console.log(req.body)
    const newJob = new Job({
      title, description,location, salary,
      company : req.user.name, 
      requirements, 
      deadline, 
      postedBy: req.user.id 
    });
    await newJob.save();
    return res.status(201).json({ message: 'Job Drive created', job: newJob });
  } catch (error : any) {
    console.log(error.message)
    return res.status(500).json({ message: 'Error creating job', error: (error as Error).message });
  }
};

export const getAllJobs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching jobs' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching job details' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {

    console.log(req.body)
    const updatedJob = await Job.findByIdAndUpdate(req.body.id, { status : req.body.meta.status}, { new: true });
    return res.status(200).json({ message: 'Job updated', job: updatedJob });
  } catch (error) {
    return res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ job: req.params.id }); // Cascading delete applications
    return res.status(200).json({ message: 'Job and related applications deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Deletion failed' });
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId, applyMethod } = req.body;
    
    // Check if already applied
    const existing = await Application.findOne({ job: jobId, student: req.user.id });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const applicationData: any = {
      job: jobId,
      student: req.user.id,
      applyMethod
    };

    // If resume method, get URL from your upload middleware (e.g., Multer + Cloudinary)
    if (applyMethod === 'resume' && req.file) {
      applicationData.resumeUrl = req.file.path; 
    }

    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({ message: "Application submitted", application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};