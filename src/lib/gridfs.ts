// src/lib/gridfs.ts
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import dbConnect from './dbConnect';

// Cache the GridFS bucket
let cachedBucket: GridFSBucket | null = null;

async function getGridFSBucket() {
  if (cachedBucket) {
    return cachedBucket;
  }
  
  const { db } = await dbConnect();
  cachedBucket = new GridFSBucket(db);
  
  return cachedBucket;
}

export async function uploadFile(file: Buffer, filename: string, metadata: object = {}) {
  const bucket = await getGridFSBucket();
  
  return new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata
    });
    
    const readableStream = new Readable();
    readableStream.push(file);
    readableStream.push(null);
    
    readableStream
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', function() {
        resolve(uploadStream.id);
      });
  });
}

export async function getFile(id: string) {
  const bucket = await getGridFSBucket();
  
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    
    bucket.openDownloadStream(new ObjectId(id))
      .on('data', chunk => chunks.push(chunk))
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function deleteFile(id: string) {
  const bucket = await getGridFSBucket();
  await bucket.delete(new ObjectId(id));
}