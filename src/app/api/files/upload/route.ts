// src/app/api/files/upload/route.ts
import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/gridfs';
// import { File } from '@/models/File';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as globalThis.File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileMetadata = {
      contentType: file.type,
      size: buffer.length,
      originalName: file.name
    };
    
    const fileId = await uploadFile(buffer, file.name, fileMetadata);
    
    return NextResponse.json({ 
      fileId: fileId.toString(),
      filename: file.name 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}