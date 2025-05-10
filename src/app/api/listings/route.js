import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET all listings with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    // Build filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (city) filter.city = city;
    
    // Add price range filter if provided
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.gte = parseFloat(minPrice);
      if (maxPrice) filter.price.lte = parseFloat(maxPrice);
    }
    
    const listings = await prisma.listing.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST to create a new listing
export async function POST(request) {
  try {
    const data = await request.json();
    
    const listing = await prisma.listing.create({
      data,
    });
    
    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Failed to create listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
} 