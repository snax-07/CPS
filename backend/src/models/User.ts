import { Schema, model, Document } from 'mongoose';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  COMPANY = 'company'
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default model<IUser>('User', userSchema);