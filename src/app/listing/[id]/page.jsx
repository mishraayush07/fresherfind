'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ListingDetailPage() {
  const params = useParams();
  const { id } = params;
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      try {
        const response = await fetch(`/api/listings/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        
        const data = await response.json();
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchListing();
    }
  }, [id]);

  // Type badge config
  const getTypeConfig = (type) => {
    const typeConfig = {
      hostel: {
        icon: "🏠",
        color: "bg-green-100 text-green-800",
        badge: "bg-green-500"
      },
      pg: {
        icon: "🏘️",
        color: "bg-blue-100 text-blue-800",
        badge: "bg-blue-500"
      },
      flat: {
        icon: "🏢",
        color: "bg-purple-100 text-purple-800",
        badge: "bg-purple-500"
      },
      mess: {
        icon: "🍽️",
        color: "bg-orange-100 text-orange-800",
        badge: "bg-orange-500"
      }
    };

    // Default if type not found or undefined
    return typeConfig[type?.toLowerCase()] || {
      icon: "🏠",
      color: "bg-gray-100 text-gray-800",
      badge: "bg-gray-500"
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/listing" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Listings
          </Link>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[500px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
              <Link 
                href="/listing" 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Back to Listings
              </Link>
            </div>
          ) : listing ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Listing Header */}
              <div className="p-6 border-b">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeConfig(listing.type).color}`}>
                        {getTypeConfig(listing.type).icon} {listing.type}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.title}</h1>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.location}, {listing.city}
                    </p>
                  </div>
                  <div className="bg-blue-50 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-3xl font-bold text-blue-600">₹{listing.price.toLocaleString()}</p>
                    <p className="text-gray-600 text-sm">per month</p>
                  </div>
                </div>
              </div>
              
              {/* Image Gallery */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Image */}
                  <div className="md:col-span-2">
                    <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-lg">
                      {listing.images && listing.images.length > 0 ? (
                        <Image
                          src={listing.images[activeImage]}
                          alt={`${listing.title} - Image ${activeImage + 1}`}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-lg">No Images Available</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnails */}
                    {listing.images && listing.images.length > 1 && (
                      <div className="flex mt-4 space-x-2 overflow-x-auto py-1">
                        {listing.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
                          >
                            <Image
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Listing Details */}
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type</span>
                          <span className="font-medium">{listing.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location</span>
                          <span className="font-medium">{listing.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">City</span>
                          <span className="font-medium">{listing.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price</span>
                          <span className="font-medium">₹{listing.price.toLocaleString()}/month</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {listing.amenities.map((amenity, index) => (
                            <span 
                              key={index}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">Contact Information</h3>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <p className="font-medium">{listing.contactName}</p>
                          <p className="text-blue-600 mt-1">{listing.contactPhone}</p>
                          {listing.contactEmail && <p className="text-gray-600 mt-1">{listing.contactEmail}</p>}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <a
                          href={`tel:${listing.contactPhone}`}
                          className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call Owner
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{listing.address}</p>
                    {listing.coordinates && (
                      <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-600">Map view would be displayed here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing not found</h2>
              <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
              <Link 
                href="/listing" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Listings
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 