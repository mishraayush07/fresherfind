"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

const cities = [
  { name: 'Ahmedabad', image: '/cities/ahmedabad.jpg' },
  { name: 'Bangalore', image: '/cities/bangalore.jpg' },
  { name: 'Chennai', image: '/cities/chennai.jpg' },
  { name: 'Delhi', image: '/cities/delhi.jpg' },
  { name: 'Hyderabad', image: '/cities/hyderabad.jpg' },
  { name: 'Kolkata', image: '/cities/kolkata.jpg' },
  { name: 'Mumbai', image: '/cities/mumbai.jpg' },
  { name: 'Pune', image: '/cities/pune.jpg' },
];
  
export default function LocationHeader() {
  const [userLocation, setUserLocation] = useState('Detecting location...');

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            setUserLocation(data.address.city || data.address.town || 'Location detected');
          } catch (error) {
            setUserLocation('Location detected');
          }
        },
        () => setUserLocation('Location not available')
      );
    }
  }, []);

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{userLocation}</span>
          </div>
        </div>
      </div>

      {/* Cities Scroll */}
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex space-x-6 px-4 min-w-max mx-auto justify-center">
          {cities.map((city) => (
            <div key={city.name} className="flex flex-col items-center space-y-2 w-20">
              <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center truncate w-full">{city.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 