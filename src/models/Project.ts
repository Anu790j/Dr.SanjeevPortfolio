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
  imageFileId: Schema.Types.ObjectId,
  highlights: [String],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);