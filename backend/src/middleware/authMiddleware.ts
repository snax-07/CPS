import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.ts';

interface AuthRequest extends Request {
  user?: IUser;
}




export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string || "CPS" as string);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user?.role} is not authorized to access this route` });
    }
    next();
  };
};