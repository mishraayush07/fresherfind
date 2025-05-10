import Image from 'next/image';

const handpickedHostels = [
  {
    id: 1,
    name: 'Student Haven',
    location: 'Near IIT Delhi',
    rating: 4.5,
    price: '₹8,000/month',
    image: '/hostels/hostel1.jpg',
    amenities: ['WiFi', 'Food', 'Laundry']
  },
  {
    id: 2,
    name: 'Campus Comfort',
    location: 'Near DU North Campus',
    rating: 4.3,
    price: '₹7,500/month',
    image: '/hostels/hostel2.jpg',
    amenities: ['WiFi', 'Food', 'Gym']
  },
  {
    id: 3,
    name: 'Scholar\'s Nest',
    location: 'Near JNU',
    rating: 4.7,
    price: '₹9,000/month',
    image: '/hostels/hostel3.jpg',
    amenities: ['WiFi', 'Food', 'Study Room']
  },
  {
    id: 4,
    name: 'Academic Abode',
    location: 'Near DTU',
    rating: 4.4,
    price: '₹8,500/month',
    image: '/hostels/hostel4.jpg',
    amenities: ['WiFi', 'Food', 'Library']
  }
];

export default function HandpickedHostels() {
  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Handpicked Hostels</h2>
          <button className="text-blue-600 font-medium hover:text-blue-700">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {handpickedHostels.map((hostel) => (
              <div
                key={hostel.id}
                className="flex-none w-72 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  <Image
                    src={hostel.image}
                    alt={hostel.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{hostel.name}</h3>
                      <p className="text-sm text-gray-500">{hostel.location}</p>
                    </div>
                    <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-green-600">{hostel.rating}</span>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{hostel.price}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hostel.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}