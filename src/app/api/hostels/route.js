import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const city = searchParams.get('city');
  
  try {
    // If ID is provided, return specific hostel
    if (id) {
      const hostel = await prisma.listing.findUnique({
        where: {
          id: id,
          type: 'hostel'
        }
      });
      
      if (!hostel) {
        return NextResponse.json(
          { error: 'Hostel not found' },
          { status: 404 }
        );
      }
      
      // Transform database object to match the expected format
      return NextResponse.json(transformHostelData(hostel));
    }
    
    // If city is provided, filter by city
    if (city) {
      const filteredHostels = await prisma.listing.findMany({
        where: {
          type: 'hostel',
          city: {
            equals: city,
            mode: 'insensitive'
          }
        }
      });
      
      return NextResponse.json(filteredHostels.map(transformHostelData));
    }
    
    // Return all hostels
    const allHostels = await prisma.listing.findMany({
      where: {
        type: 'hostel'
      }
    });
    
    return NextResponse.json(allHostels.map(transformHostelData));
  } catch (error) {
    console.error('Error fetching hostels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Transform database object to match the expected format in the frontend
function transformHostelData(hostel) {
  const metadata = hostel.metadata || {};
  
  return {
    id: hostel.id,
    name: hostel.title,
    type: hostel.type,
    location: hostel.location,
    city: hostel.city,
    rating: metadata.rating || 0,
    price: hostel.price,
    priceUnit: metadata.priceUnit || 'month',
    capacity: metadata.capacity || '',
    gender: metadata.gender || 'mixed',
    amenities: hostel.amenities || [],
    images: hostel.images || [],
    description: hostel.description,
    contact: hostel.contactPhone,
    reviews: metadata.reviews || []
  };
} 