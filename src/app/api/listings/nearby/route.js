import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // For MVP, return dummy data
    // In production, this would query the database with geospatial queries
    const dummyListings = [
      {
        id: 1,
        title: 'Student Hostel - Near University',
        location: 'University Road, City Center',
        price: 8000,
        distance: 0.5,
        image: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab',
        type: 'hostel',
      },
      {
        id: 2,
        title: 'Cozy PG for Girls',
        location: 'Gandhi Nagar, West Side',
        price: 12000,
        distance: 1.2,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        type: 'pg',
      },
      {
        id: 3,
        title: 'Student Mess - Home Style Food',
        location: 'College Road, East Side',
        price: 3000,
        distance: 0.8,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        type: 'mess',
      },
    ];

    return NextResponse.json(dummyListings);
  } catch (error) {
    console.error('Error fetching nearby listings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 