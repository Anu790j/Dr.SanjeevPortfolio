// src/models/Publication.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Publication extends Document {
  title: string;
  authors: string;
  category: 'journal' | 'conference' | 'patent';
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  abstract?: string;
  pdfFileId?: mongoose.Types.ObjectId;
  link?: string;
  citation?: string;
  tags?: string[];
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
}

const PublicationSchema = new Schema<Publication>({
  title: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['journal', 'conference', 'patent']
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
  link: String,
  citation: String,
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  imageUrl: String
}, { timestamps: true });

export default mongoose.models.Publication || mongoose.model<Publication>('Publication', PublicationSchema);