// src/app/api/publications/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Publication from '@/models/Publication';

export async function GET() {
  try {
    await dbConnect();
    const publications = await Publication.find({}).sort({ year: -1 }).lean();
    
    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await dbConnect();
    
    await Publication.create(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}