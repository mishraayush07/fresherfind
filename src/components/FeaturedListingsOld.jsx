'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListingCard from './ListingCard';

// Mock data for demo purposes
const mockListings = [
  {
    id: '1',
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
    contactPhone: '9876543210'
  },
  {
    id: '2',
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
    contactPhone: '9876543211'
  },
  {
    id: '3',
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
    contactPhone: '9876543212'
  },
  {
    id: '4',
    title: 'Affordable Mess Service with Home-cooked Food',
    description: 'Healthy and hygienic home-cooked food served fresh. Monthly and daily packages available.',
    price: 3500,
    location: 'Indiranagar, Bangalore',
    address: '321 Food St, Indiranagar',
    city: 'Bangalore',
    type: 'Mess',
    amenities: ['Veg & Non-veg', 'Meal Delivery', 'Monthly Plans'],
    images: ['/images/hero.png'],
    contactName: 'Sarah Williams',
    contactPhone: '9876543213'
  }
];

export default function FeaturedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch from API
    // Simulating API call with setTimeout
    const fetchListings = async () => {
      try {
        // Fake API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setListings(mockListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Listings
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover some of the top rated accommodations and services in your area.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            
            <div className="text-center">
              <Link 
                href="/listing" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Listings
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 