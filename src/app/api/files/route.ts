// src/app/api/files/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

async function getGridFSFiles() {
  const { db } = await dbConnect();
  
  // Get files from GridFS
  const filesCollection = db.collection('fs.files');
  const files = await filesCollection.find({}).sort({ uploadDate: -1 }).toArray();
  
  return files;
}

export async function GET() {
  try {
    const files = await getGridFSFiles();
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}