// Create new file: professor-portfolio/src/app/api/files/[id]/route.ts
import { NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Make sure params are awaited properly
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.id) {
      return new Response('File ID is required', { status: 400 });
    }
    
    const id = resolvedParams.id;
    
    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download') === 'true';
    
    await dbConnect();
    const client = await clientPromise;
    const db = client.db();
    
    const bucket = new GridFSBucket(db);
    
    // Get file info first
    const file = await db.collection('fs.files').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!file) {
      return new Response('File not found', { status: 404 });
    }
    
    // Set content-type based on file metadata
    const contentType = 
      file.metadata?.contentType?.includes('pdf') 
        ? 'application/pdf' 
        : file.metadata?.contentType || 'application/octet-stream';
    
    // Set content disposition based on download parameter
    const contentDisposition = download 
      ? `attachment; filename="${file.metadata?.originalName || file.filename}"` 
      : `inline; filename="${file.metadata?.originalName || file.filename}"`;
    
    // Create response headers
    const headers = {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
      'X-Content-Type-Options': 'nosniff'
    };
    
    // Create download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    
    // Create readable stream for response
    const readableStream = new ReadableStream({
      start(controller) {
        downloadStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        downloadStream.on('end', () => {
          controller.close();
        });
        downloadStream.on('error', (error) => {
          console.error('Stream error:', error);
          controller.error(error);
        });
      },
      cancel() {
        downloadStream.destroy();
      },
    });
    
    return new Response(readableStream, { headers });
  } catch (error) {
    console.error('Error retrieving file:', error);
    return new Response('Error retrieving file', { status: 500 });
  }
}

// Add DELETE method here too:
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }
    
    const id = resolvedParams.id;
    
    await dbConnect();
    const client = await clientPromise;
    const db = client.db();
    
    const bucket = new GridFSBucket(db);
    
    // First check if file exists
    const file = await db.collection('fs.files').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Delete the file using GridFS
    await bucket.delete(new ObjectId(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}