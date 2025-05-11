import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ListingCard({ listing }) {
  // Define type icons and colors
  const typeConfig = {
    hostel: {
      icon: "🏠",
      color: "bg-green-100 text-green-800",
      badge: "bg-gradient-to-r from-green-500 to-green-600",
      border: "border-green-200",
      shadow: "shadow-green-100"
    },
    pg: {
      icon: "🏘️",
      color: "bg-blue-100 text-blue-800",
      badge: "bg-gradient-to-r from-blue-500 to-blue-600",
      border: "border-blue-200",
      shadow: "shadow-blue-100"
    },
    flat: {
      icon: "🏢",
      color: "bg-purple-100 text-purple-800",
      badge: "bg-gradient-to-r from-purple-500 to-purple-600",
      border: "border-purple-200",
      shadow: "shadow-purple-100"
    },
    mess: {
      icon: "🍽️",
      color: "bg-orange-100 text-orange-800",
      badge: "bg-gradient-to-r from-orange-500 to-orange-600",
      border: "border-orange-200",
      shadow: "shadow-orange-100"
    }
  };

  // Use default config if type not found
  const config = typeConfig[listing.type.toLowerCase()] || {
    icon: "🏠",
    color: "bg-gray-100 text-gray-800",
    badge: "bg-gradient-to-r from-gray-500 to-gray-600",
    border: "border-gray-200",
    shadow: "shadow-gray-100"
  };

  // Calculate rating stars
  const rating = listing.metadata?.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="h-full"
    >
      <Link href={`/listing/${listing.id}`} className="block h-full outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl">
        <div className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border ${config.border} ${config.shadow} group`}>
          {/* Image */}
          <div className="relative h-52 w-full overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-lg">No Image Available</span>
              </div>
            )}
            
            {/* Type badge */}
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full ${config.badge} shadow-md text-white font-medium text-sm`}>
              <span>{config.icon} {listing.type}</span>
            </div>
            
            {/* Price badge */}
            <div className="absolute bottom-3 right-3 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-900 font-bold">
              ₹{listing.price.toLocaleString()}<span className="text-xs font-medium text-gray-600">/month</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">{listing.title}</h3>
            </div>
            
            {/* Location */}
            <div className="flex items-center mb-3 text-gray-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{listing.location}</span>
            </div>
            
            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < fullStars ? (
                        <span className="text-yellow-400">★</span>
                      ) : i === fullStars && hasHalfStar ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-300">★</span>
                      )}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {rating.toFixed(1)} ({listing.metadata?.reviews || 0} reviews)
                </span>
              </div>
            )}
            
            {/* Description */}
            <p className="text-gray-700 text-sm line-clamp-2 mb-4 flex-grow">{listing.description}</p>
            
            {/* Amenities (showing first 3) */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {listing.amenities.slice(0, 3).map((amenity, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 transition-colors duration-300 group-hover:bg-gray-200"
                  >
                    {amenity}
                  </span>
                ))}
                {listing.amenities.length > 3 && (
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 transition-colors duration-300 group-hover:bg-gray-200">
                    +{listing.amenities.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Footer with view details button */}
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 mt-auto">
            <div className="text-sm text-blue-600 font-medium flex items-center justify-end group-hover:translate-x-1 transition-transform duration-300">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 