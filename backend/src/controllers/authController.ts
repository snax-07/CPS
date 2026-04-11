import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';
import Student from '../models/Student.ts';
import Company from '../models/Company.ts';

// In-memory blacklist (Use Redis in production for persistence)
export const tokenBlacklist = new Set<string>();

import generateToken from '../utils/generateToken.ts';
import { hashPassword, comparePassword } from '../utils/passwordEncryption.ts';

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password, role, ...profileData } = req.body;


  console.log(req.body)
  try {
    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 2. Create Base User
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role // 'student', 'company', or 'admin'
    });

    // 3. Branching Logic: Create the specific profile
    if (role === 'student') {
      await Student.create({
        user: user._id,
        department: profileData.department,
        batch: profileData.batch
      });
    } else if (role === 'company') {
      await Company.create({
        user: user._id,
        companyName: profileData.companyName || name,
        website: profileData.website || "Not Provided",
        industry: profileData.industry || "Not Provided",
        contactEmail : email,
        location : "Not Provided",
        description : "Not Provided"
      });
    }

    // 4. Finalize
    generateToken(res, user._id.toString());
    res.cookie("user_role" , user.role , {
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Registration successful",
      ok: true
    });

  } catch (error : any) {
    console.log(error.message)
    return res.status(500).json({ message: 'Server Error during registration', error });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {

  console.log("demo login")
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (user && (await comparePassword(password, user.password!))) {
    generateToken(res, user._id.toString());
    res.cookie("user_role", user.role , {
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role , ok : true});
  }
  return res.status(401).json({ message: 'Invalid email or password' });
};

export const logout = (req: Request, res: Response) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};