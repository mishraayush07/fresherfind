import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Get count for each service type
    const hostelsCount = await prisma.listing.count({ where: { type: 'hostel' } });
    const pgsCount = await prisma.listing.count({ where: { type: 'pg' } });
    const messCount = await prisma.listing.count({ where: { type: 'mess' } });
    
    // Define other services (these will need to be implemented in the future)
    const services = [
      { id: "hostels", name: "Hostels", count: hostelsCount },
      { id: "pgs", name: "PGs", count: pgsCount },
      { id: "mess", name: "Mess", count: messCount },
      { id: "flats", name: "Flats", count: 15 },
      { id: "stationary", name: "Stationary", count: 8 },
      { id: "mentors", name: "Find Mentor", count: 12 },
      { id: "laundry", name: "Laundry", count: 10 },
      { id: "transport", name: "Transport", count: 7 },
      { id: "gym", name: "Gym", count: 9 },
      { id: "library", name: "Library", count: 6 },
      { id: "events", name: "Events", count: 14 },
      { id: "more", name: "More", count: 20 }
    ];
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 