import { Schema, model, Document, Types } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  deadline: Date;
  postedBy: Types.ObjectId;
  status : string;
  applicants : number;
  views : number;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  requirements: [{ type: String }],
  deadline: { type: Date, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  applicants: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

export default model<IJob>('Job', jobSchema);