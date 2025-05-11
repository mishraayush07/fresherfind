'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  const [searchType, setSearchType] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (searchType !== 'all') params.append('type', searchType);
    if (searchLocation) params.append('location', searchLocation);
    
    // Navigate to listings page with filters
    router.push(`/listing?${params.toString()}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const searchBoxVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15, 
        delay: 0.4 
      }
    }
  };

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-10"></div>
      
      {/* Hero image with parallax effect */}
      <div className="absolute inset-0 scale-105 transform-gpu">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
          alt="City Living Hero"
          fill
          priority
          quality={90}
          style={{ 
            objectFit: 'cover', 
            objectPosition: 'center',
            transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
            transition: 'transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1)'
          }}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="w-full"
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
            variants={itemVariants}
          >
            Find Your Perfect <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Home Away</span> From Home
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10 drop-shadow-md font-light"
            variants={itemVariants}
          >
            Discover hostels, PGs, flats, and mess facilities near you. 
            Perfect for students and newcomers to the city.
          </motion.p>
        
          {/* Search box */}
          <motion.div 
            className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8"
            variants={searchBoxVariants}
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  I'm looking for
                </label>
                <div className="relative">
                  <select
                    id="type"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-white text-gray-700 pr-10 transition-all duration-300"
                    aria-label="Select accommodation type"
                  >
                    <option value="all">All Properties</option>
                    <option value="hostel">Hostel</option>
                    <option value="pg">PG</option>
                    <option value="flat">Flat</option>
                    <option value="mess">Mess</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Where
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    placeholder="Enter city, area or locality"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm pl-10 transition-all duration-300"
                    aria-label="Enter location"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="self-end">
                <button
                  type="submit"
                  className="w-full md:w-auto py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                  disabled={!searchType}
                >
                  <span className="flex items-center justify-center">
                    Search
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
          
          {/* Trust elements */}
          <motion.div 
            className="mt-10 flex flex-wrap justify-center gap-6 text-white"
            variants={itemVariants}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Listings</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Top Rated Properties</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>5000+ Happy Students</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
} 