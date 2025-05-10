import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const city = searchParams.get('city');
  
  try {
    // If ID is provided, return specific PG
    if (id) {
      const pg = await prisma.listing.findUnique({
        where: {
          id: id,
          type: 'pg'
        }
      });
      
      if (!pg) {
        return NextResponse.json(
          { error: 'PG not found' },
          { status: 404 }
        );
      }
      
      // Transform database object to match the expected format
      return NextResponse.json(transformPGData(pg));
    }
    
    // If city is provided, filter by city
    if (city) {
      const filteredPGs = await prisma.listing.findMany({
        where: {
          type: 'pg',
          city: {
            equals: city,
            mode: 'insensitive'
          }
        }
      });
      
      return NextResponse.json(filteredPGs.map(transformPGData));
    }
    
    // Return all PGs
    const allPGs = await prisma.listing.findMany({
      where: {
        type: 'pg'
      }
    });
    
    return NextResponse.json(allPGs.map(transformPGData));
  } catch (error) {
    console.error('Error fetching PGs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Transform database object to match the expected format in the frontend
function transformPGData(pg) {
  const metadata = pg.metadata || {};
  
  return {
    id: pg.id,
    name: pg.title,
    type: pg.type,
    location: pg.location,
    city: pg.city,
    rating: metadata.rating || 0,
    price: pg.price,
    priceUnit: metadata.priceUnit || 'month',
    capacity: metadata.capacity || '',
    gender: metadata.gender || 'mixed',
    amenities: pg.amenities || [],
    images: pg.images || [],
    description: pg.description,
    contact: pg.contactPhone,
    reviews: metadata.reviews || []
  };
} 