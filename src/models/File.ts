// src/models/File.ts
import mongoose, { Schema } from 'mongoose';

const FileSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: String,
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

export default mongoose.models.File || mongoose.model('File', FileSchema);