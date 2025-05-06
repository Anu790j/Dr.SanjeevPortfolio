// src/models/Professor.ts
import mongoose, { Schema } from 'mongoose';

const ProfessorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  office: String,
  department: String,
  university: String,
  bio: String,
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  researchInterests: [String],
  photoUrl: String,
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    googleScholar: String
  },
  profileImage: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.models.Professor || mongoose.model('Professor', ProfessorSchema);