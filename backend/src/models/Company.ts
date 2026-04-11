import { Schema, model, Document, Types } from 'mongoose';

export interface ICompany extends Document {
  user: Types.ObjectId;
  website: string;
  industry: string;
  description: string;
  location: string;
  contactEmail: string;
  companyName : string
}

const companySchema = new Schema<ICompany>({
  companyName : {type : String , required : true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  website: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  contactEmail: { type: String, required: true }
}, { timestamps: true });

export default model<ICompany>('Company', companySchema);