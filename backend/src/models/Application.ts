import { Schema, model, Document, Types } from 'mongoose';

export interface IApplication extends Document {
  job: Types.ObjectId;
  student: Types.ObjectId;
  status: 'pending' | 'interview' | 'accepted' | 'rejected' | 'shortlisted';
  applyMethod: 'profile' | 'resume'; // New field
  resumeUrl?: string; // New field for Cloudinary/S3 link
  appliedAt: Date;
}

const appSchema = new Schema<IApplication>({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  applyMethod: { 
    type: String, 
    enum: ['profile', 'resume'], 
    required: true,
    default: 'profile' 
  },
  resumeUrl: { type: String }, // Stores URL if they upload a file
  status: { 
    type: String, 
    enum: ['pending', 'interview', 'accepted', 'rejected', 'shortlisted'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default model<IApplication>('Application', appSchema);