// src/models/Publication.ts
import mongoose, { Schema } from 'mongoose';

const PublicationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  journal: String,
  conference: String,
  year: {
    type: Number,
    required: true
  },
  doi: String,
  abstract: String,
  pdfFileId: Schema.Types.ObjectId,
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.models.Publication || mongoose.model('Publication', PublicationSchema);