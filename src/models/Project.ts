// src/models/Project.ts
import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['lab', 'research'],
    required: true
  },
  imageUrl: String,
  highlights: [String],
  order: {
    type: Number,
    default: 0
  },
  startDate: String,
  endDate: String,
  fundingAgency: String,
  fundingAmount: String,
  url: String,
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'upcoming'],
    default: 'ongoing'
  },
  tags: [String]
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);