// src/app/api/professor/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Professor from '@/models/Professor';

export async function GET() {
  try {
    await dbConnect();
    const professor = await Professor.findOne({}).lean();
    
    return NextResponse.json(professor || {});
  } catch (error) {
    console.error('Error fetching professor:', error);
    return NextResponse.json({ error: 'Failed to fetch professor data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    console.log('Received professor update:', data);
    
    // Make sure to include the profileImage field when updating
    const updateData = {
      name: data.name,
      title: data.title,
      email: data.email,
      phone: data.phone || '',
      office: data.office || '',
      department: data.department || '',
      institution: data.institution || data.university || '',
      bio: data.bio || '',
      education: data.education || [],
      socialLinks: data.socialLinks || [],
      researchInterests: data.researchInterests || [],
      profileImage: data.profileImage || '', // Make sure this exists!
    };
    
    // Update the professor document
    const result = await Professor.findOneAndUpdate(
      {}, // Find the first document (assuming only one professor)
      updateData,
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating professor:', error);
    return NextResponse.json({ error: 'Failed to update professor' }, { status: 500 });
  }
}