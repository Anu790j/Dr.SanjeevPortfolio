import mongoose, { Schema, Document } from 'mongoose';

export interface Award extends Document {
  title: string;
  year: number;
  organization: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AwardSchema = new Schema<Award>(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    organization: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    link: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Award || mongoose.model<Award>('Award', AwardSchema); 