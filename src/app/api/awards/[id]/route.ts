import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Award from '@/models/Award';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await dbConnect();
    
    const award = await Award.findById(id);
    
    if (!award) {
      return NextResponse.json(
        { error: 'Award not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(award);
  } catch (error) {
    console.error('Error fetching award:', error);
    return NextResponse.json(
      { error: 'Failed to fetch award' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    await dbConnect();
    
    const award = await Award.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!award) {
      return NextResponse.json(
        { error: 'Award not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(award);
  } catch (error) {
    console.error('Error updating award:', error);
    return NextResponse.json(
      { error: 'Failed to update award' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await dbConnect();
    const award = await Award.findByIdAndDelete(id);
    
    if (!award) {
      return NextResponse.json(
        { error: 'Award not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting award:', error);
    return NextResponse.json(
      { error: 'Failed to delete award' },
      { status: 500 }
    );
  }
} 