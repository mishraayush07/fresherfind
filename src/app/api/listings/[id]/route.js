import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET a specific listing by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }
    
    const listing = await prisma.listing.findUnique({
      where: { id }
    });
    
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(listing);
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE a listing
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const updatedListing = await prisma.listing.update({
      where: { id },
      data
    });
    
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error('Failed to update listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE a listing
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.listing.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Listing deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing', details: error.message },
      { status: 500 }
    );
  }
} 