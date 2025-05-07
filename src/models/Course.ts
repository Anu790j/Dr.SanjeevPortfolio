// src/models/Course.ts
import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  level: {
    type: String,
    enum: ['Undergraduate', 'Graduate'],
    required: true
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer', 'Winter'],
    required: true
  },
  year: Number,
  credits: {
    type: Number,
    default: 3
  },
  syllabus: String,
  imageUrl: {
    type: String,
    default: ''
  },
  highlights: [String],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);