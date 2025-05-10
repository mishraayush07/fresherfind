import Link from 'next/link';
import Image from 'next/image';

export default function ListingCard({ listing }) {
  // Define type icons and colors
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

  // Use default config if type not found
  const config = typeConfig[listing.type.toLowerCase()] || {
    icon: "🏠",
    color: "bg-gray-100 text-gray-800",
    badge: "bg-gray-500"
  };

  return (
    <Link href={`/listing/${listing.id}`} className="block h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 h-full flex flex-col border border-gray-100">
        {/* Image */}
        <div className="relative h-52 w-full">
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-lg">No Image Available</span>
            </div>
          )}
          
          {/* Type badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-md ${config.color} shadow-sm`}>
            <span className="font-medium">{config.icon} {listing.type}</span>
          </div>
          
          {/* Price badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-white rounded-full shadow-md text-gray-900 font-bold">
            ₹{listing.price.toLocaleString()}{listing.type.toLowerCase() === 'mess' ? '/month' : '/month'}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
          </div>
          
          <div className="flex items-center mb-2 text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{listing.location}</span>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 text-sm line-clamp-2 mb-4 flex-grow">{listing.description}</p>
          
          {/* Amenities (showing first 3) */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {listing.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {amenity}
                </span>
              ))}
              {listing.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  +{listing.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Footer with view details button */}
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 mt-auto">
          <div className="text-sm text-blue-600 font-medium flex items-center justify-end">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 