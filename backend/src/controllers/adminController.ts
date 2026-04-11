import { Request, Response } from 'express';
import User from '../models/User.ts';
import Student from '../models/Student.ts';
import Job from '../models/Job.ts';
import Application from '../models/Application.ts';

export const getSystemStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [userCount, studentCount, jobCount, appCount] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments()
    ]);
    return res.status(200).json({ users: userCount, students: studentCount, jobs: jobCount, applications: appCount });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

export const verifyUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    return res.status(200).json({ message: 'User verified', user });
  } catch (error) {
    return res.status(500).json({ message: 'Verification failed' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'student') await Student.findOneAndDelete({ user: user._id });
    await User.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: 'User and associated data deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Deletion failed' });
  }
};