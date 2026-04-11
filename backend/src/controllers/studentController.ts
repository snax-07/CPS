import { Request, Response } from 'express';
import Student from '../models/Student';
import User from '../models/User.ts';

interface AuthRequest extends Request { user?: any; }

export const getStudentProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!student) return res.status(404).json({ message: 'Profile not found' });
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const createOrUpdateProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { department, cgpa, skills, bio, batch } = req.body;
    
    // Handle skills: can be array or comma-separated string
    const formattedSkills = Array.isArray(skills) 
      ? skills 
      : skills?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    const profileFields = { 
      user: req.user.id, 
      department, 
      cgpa, 
      skills: formattedSkills, 
      bio, 
      batch 
    };
    
    let student = await Student.findOne({ user: req.user.id });
    if (student) {
      student = await Student.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
      return res.status(200).json({ message: 'Profile updated', student });
    }
    
    student = new Student(profileFields);
    await student.save();
    return res.status(201).json({ message: 'Profile created', student });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving profile' });
  }
};

export const uploadResume = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const student = await Student.findOneAndUpdate({ user: req.user.id }, { resumeUrl: req.file.path }, { new: true });
    return res.status(200).json({ message: 'Resume uploaded successfully', resumeUrl: student?.resumeUrl });
  } catch (error) {
    return res.status(500).json({ message: 'Upload failed' });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    await Student.findOneAndDelete({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Deletion failed' });
  }
};

// GET /students/profile/:userId - View a student's profile by user ID (for company use)
export const getStudentProfileById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const student = await Student.findOne({ user: req.params.userId }).populate('user', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching student profile' });
  }
};