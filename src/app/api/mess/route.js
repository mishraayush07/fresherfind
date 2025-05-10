import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const city = searchParams.get('city');
  
  try {
    // If ID is provided, return specific mess
    if (id) {
      const messService = await prisma.listing.findUnique({
        where: {
          id: id,
          type: 'mess'
        }
      });
      
      if (!messService) {
        return NextResponse.json(
          { error: 'Mess service not found' },
          { status: 404 }
        );
      }
      
      // Transform database object to match the expected format
      return NextResponse.json(transformMessData(messService));
    }
    
    // If city is provided, filter by city
    if (city) {
      const filteredMess = await prisma.listing.findMany({
        where: {
          type: 'mess',
          city: {
            equals: city,
            mode: 'insensitive'
          }
        }
      });
      
      return NextResponse.json(filteredMess.map(transformMessData));
    }
    
    // Return all mess services
    const allMess = await prisma.listing.findMany({
      where: {
        type: 'mess'
      }
    });
    
    return NextResponse.json(allMess.map(transformMessData));
  } catch (error) {
    console.error('Error fetching mess services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Transform database object to match the expected format in the frontend
function transformMessData(mess) {
  const metadata = mess.metadata || {};
  
  return {
    id: mess.id,
    name: mess.title,
    type: mess.type,
    location: mess.location,
    city: mess.city,
    rating: metadata.rating || 0,
    price: mess.price,
    priceUnit: metadata.priceUnit || 'month',
    mealType: metadata.mealType || '',
    timing: metadata.timing || '',
    speciality: metadata.speciality || '',
    images: mess.images || [],
    description: mess.description,
    contact: mess.contactPhone,
    reviews: metadata.reviews || []
  };
} 