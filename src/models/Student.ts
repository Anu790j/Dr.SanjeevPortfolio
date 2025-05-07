import mongoose, { Schema, Document } from 'mongoose';

export interface Student extends Document {
  name: string;
  category: 'current' | 'alumni' | 'opportunity';
  email?: string;
  photoUrl?: string;
  degree?: string;
  researchArea?: string;
  startYear?: number;
  endYear?: number;
  linkedin?: string;
  description?: string;
  position?: string;
  achievements?: string[];
  publications?: mongoose.Types.ObjectId[];
  projects?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<Student>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['current', 'alumni', 'opportunity'] },
    email: { type: String },
    photoUrl: { type: String },
    degree: { type: String },
    researchArea: { type: String },
    startYear: { type: Number },
    endYear: { type: Number },
    linkedin: { type: String },
    description: { type: String },
    position: { type: String },
    achievements: [{ type: String }],
    publications: [{ type: Schema.Types.ObjectId, ref: 'Publication' }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model<Student>('Student', StudentSchema); 