'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import LocationHeader from '@/components/LocationHeader';

export default function MessDetailsPage() {
  const { id } = useParams();
  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchMessDetails() {
      try {
        const response = await fetch(`/api/mess?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mess details');
        }
        const data = await response.json();
        setMess(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMessDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !mess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LocationHeader />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error || 'Mess service not found'}
          </div>
          <Link href="/mess" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to all mess services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/mess" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to all mess services
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96 lg:h-[500px]">
            <Image
              src={mess.images[activeImage]}
              alt={mess.name}
              fill
              className="object-cover"
            />
            
            {/* Image Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {mess.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`h-2 w-8 rounded-full ${activeImage === index ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="flex p-2 overflow-x-auto">
            {mess.images.map((image, index) => (
              <div
                key={index}
                className={`relative h-20 w-32 flex-shrink-0 mx-1 cursor-pointer border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image}
                  alt={`${mess.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{mess.name}</h1>
                <p className="text-gray-600 mt-1">{mess.location}</p>
              </div>
              <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-base font-semibold text-green-600">{mess.rating}</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Meal Type</h3>
                      <p className="text-gray-600">{mess.mealType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Price</h3>
                      <p className="text-gray-600">₹{mess.price}/{mess.priceUnit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Meal Timings</h3>
                      <p className="text-gray-600">{mess.timing}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Speciality</h3>
                      <p className="text-gray-600">{mess.speciality}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">City</h3>
                      <p className="text-gray-600">{mess.city}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Monthly Menu Highlights</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Breakfast</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Idli & Sambar</li>
                          <li>Poha & Jalebi</li>
                          <li>Aloo Paratha & Curd</li>
                          <li>Upma & Chutney</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Lunch</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Rice, Dal & Sabzi</li>
                          <li>Roti, Paneer & Salad</li>
                          <li>Biryani & Raita</li>
                          <li>Pulao, Chole & Papad</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Dinner</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Roti, Rice & Dal</li>
                          <li>Jeera Rice & Curry</li>
                          <li>Paratha & Sabzi</li>
                          <li>Khichdi & Pickles</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Special (Weekends)</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Pav Bhaji</li>
                          <li>Chole Bhature</li>
                          <li>Dosa & Sambhar</li>
                          <li>Dessert (Ice Cream/Gulab Jamun)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600">{mess.description}</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Phone</h3>
                      <p className="text-blue-600">{mess.contact}</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                    Contact Mess Service
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Reviews</h2>
                {mess.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 py-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-blue-800 font-medium">
                          {review.user.split(' ')[0][0]}{review.user.split(' ')[1]?.[0]}
                        </div>
                        <h3 className="ml-3 font-medium">{review.user}</h3>
                      </div>
                      <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                        <span className="text-sm font-medium text-green-600 mr-1">{review.rating}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))}
                
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800">Subscription Plans</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                      <div>
                        <span className="font-medium">Monthly Plan</span>
                        <p className="text-sm text-gray-600">All meals included</p>
                      </div>
                      <span className="font-bold text-green-600">₹{mess.price}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                      <div>
                        <span className="font-medium">Quarterly Plan</span>
                        <p className="text-sm text-gray-600">5% discount</p>
                      </div>
                      <span className="font-bold text-green-600">₹{Math.round(mess.price * 3 * 0.95)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                      <div>
                        <span className="font-medium">Half-yearly Plan</span>
                        <p className="text-sm text-gray-600">10% discount</p>
                      </div>
                      <span className="font-bold text-green-600">₹{Math.round(mess.price * 6 * 0.9)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 