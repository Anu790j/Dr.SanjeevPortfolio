import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Award from '@/models/Award';

export async function GET() {
  try {
    await dbConnect();
    const awards = await Award.find({}).sort({ year: -1 }).lean();
    
    return NextResponse.json(awards);
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const award = await Award.create(data);
    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    console.error('Error creating award:', error);
    return NextResponse.json({ error: 'Failed to create award' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { error: 'Award ID is required' },
        { status: 400 }
      );
    }
    
    const award = await Award.findByIdAndUpdate(
      data._id,
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Award ID is required' },
        { status: 400 }
      );
    }
    
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