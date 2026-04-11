import { Schema, model, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  user: Types.ObjectId;
  department: string;
  cgpa: number;
  skills: string[];
  resumeUrl?: string;
  bio?: string;
  batch ?: string;
}

const studentSchema = new Schema<IStudent>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  department: { type: String, required: false },
  cgpa: { type: Number, required: false },
  skills: [{ type: String }],
  resumeUrl: { type: String },
  bio: { type: String },
  batch : {type : String}
}, { timestamps: true });

export default model<IStudent>('Student', studentSchema);