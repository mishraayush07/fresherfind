import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// This is a simple API route to seed the database with dummy data
// In a production environment, you should restrict access to this endpoint

const dummyListings = [
  {
    title: 'Cozy Studio Apartment near City Center',
    description: 'A beautiful studio apartment with all modern amenities, located just 5 minutes from the city center. Perfect for students.',
    price: 12000,
    location: 'City Center, Bangalore',
    address: '123 Main St, City Center',
    city: 'Bangalore',
    type: 'Flat',
    amenities: ['WiFi', 'AC', 'Fully Furnished', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    contactName: 'John Doe',
    contactPhone: '9876543210',
    coordinates: {
      latitude: 12.9716,
      longitude: 77.5946
    }
  },
  {
    title: 'Spacious PG Accommodation for Girls',
    description: 'Safe and secure PG accommodation for girls with homely food and all necessary amenities. Located near major colleges.',
    price: 8500,
    location: 'Koramangala, Bangalore',
    address: '456 Park Ave, Koramangala',
    city: 'Bangalore',
    type: 'PG',
    amenities: ['Food Included', 'Laundry', 'WiFi', 'Security'],
    images: ['https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    contactName: 'Mary Smith',
    contactPhone: '9876543211',
    coordinates: {
      latitude: 12.9352,
      longitude: 77.6245
    }
  },
  {
    title: 'Boys Hostel with Modern Facilities',
    description: 'Modern hostel for boys with gym, study area, and recreation facilities. Close to major tech parks.',
    price: 7000,
    location: 'Electronic City, Bangalore',
    address: '789 Tech Park Rd, Electronic City',
    city: 'Bangalore',
    type: 'Hostel',
    amenities: ['Gym', 'Study Area', 'Recreation Room', 'Mess'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'],
    contactName: 'Robert Johnson',
    contactPhone: '9876543212',
    coordinates: {
      latitude: 12.8399,
      longitude: 77.6770
    }
  },
  {
    title: 'Affordable Mess Service with Home-cooked Food',
    description: 'Healthy and hygienic home-cooked food served fresh. Monthly and daily packages available.',
    price: 3500,
    location: 'Indiranagar, Bangalore',
    address: '321 Food St, Indiranagar',
    city: 'Bangalore',
    type: 'Mess',
    amenities: ['Veg & Non-veg', 'Meal Delivery', 'Monthly Plans'],
    images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'],
    contactName: 'Sarah Williams',
    contactPhone: '9876543213',
    coordinates: {
      latitude: 12.9784,
      longitude: 77.6408
    }
  },
  {
    title: 'Premium 2BHK Flat for Students',
    description: 'Fully furnished 2BHK flat ideal for a group of students or working professionals. All amenities included.',
    price: 18000,
    location: 'HSR Layout, Bangalore',
    address: '567 College Rd, HSR Layout',
    city: 'Bangalore',
    type: 'Flat',
    amenities: ['WiFi', 'AC', '24/7 Water Supply', 'Security', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    contactName: 'David Miller',
    contactPhone: '9876543214',
    coordinates: {
      latitude: 12.9116,
      longitude: 77.6741
    }
  },
  {
    title: 'Working Women\'s Hostel Near Tech Park',
    description: 'Safe and convenient hostel for working women with all necessary facilities. Located just 10 minutes from major tech parks.',
    price: 9000,
    location: 'Whitefield, Bangalore',
    address: '890 Tech Ave, Whitefield',
    city: 'Bangalore',
    type: 'Hostel',
    amenities: ['WiFi', 'AC', 'Laundry', 'Security', 'Breakfast Included'],
    images: ['https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    contactName: 'Jennifer Brown',
    contactPhone: '9876543215',
    coordinates: {
      latitude: 12.9698,
      longitude: 77.7500
    }
  },
  {
    title: 'Budget Friendly PG near College Campus',
    description: 'Affordable PG accommodation for students with basic amenities and good food. Walking distance to major colleges.',
    price: 6500,
    location: 'Jayanagar, Bangalore',
    address: '432 College St, Jayanagar',
    city: 'Bangalore',
    type: 'PG',
    amenities: ['Food Included', 'WiFi', 'Study Tables', 'Common Area'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    contactName: 'Michael Wilson',
    contactPhone: '9876543216',
    coordinates: {
      latitude: 12.9299,
      longitude: 77.5823
    }
  },
  {
    title: 'Luxury 3BHK Apartment for Sharing',
    description: 'High-end 3BHK apartment perfect for a group of professionals. Fully furnished with premium amenities.',
    price: 30000,
    location: 'Richmond Road, Bangalore',
    address: '111 Premium Ave, Richmond Road',
    city: 'Bangalore',
    type: 'Flat',
    amenities: ['AC', 'Swimming Pool', 'Gym', 'Power Backup', 'Parking', 'Security'],
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    contactName: 'Elizabeth Davis',
    contactPhone: '9876543217',
    coordinates: {
      latitude: 12.9719,
      longitude: 77.6186
    }
  }
];

export async function GET() {
  try {
    // Check if database already has listings
    const existingCount = await prisma.listing.count();
    
    if (existingCount > 0) {
      return NextResponse.json({
        message: `Database already contains ${existingCount} listings. To reseed, delete existing data first.`
      });
    }
    
    // Insert all listings
    const result = await prisma.listing.createMany({
      data: dummyListings,
    });
    
    return NextResponse.json({
      message: `Successfully seeded database with ${result.count} listings`,
      count: result.count
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
} 