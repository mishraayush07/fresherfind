import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    name: 'Hostels',
    icon: '/icons/hostel.png',
    description: 'Find comfortable hostels near your college',
    link: '/hostels'
  },
  {
    name: 'PGs',
    icon: '/icons/pg.png', 
    description: 'Pay Guest accommodations with all amenities',
    link: '/pgs'
  },
  {
    name: 'Mess',
    icon: '/icons/mess.png',
    description: 'Quality food services near you',
    link: '/mess'
  },
  {
    name: 'Flats',
    icon: '/icons/flat.png',
    description: 'Independent flats and apartments',
    link: '/flats'
  },
  {
    name: 'Stationary',
    icon: '/icons/stationary.png',
    description: 'All your study materials in one place',
    link: '/stationary'
  },
  {
    name: 'Find Mentor',
    icon: '/icons/mentor.png',
    description: 'Connect with experienced mentors',
    link: '/mentors'
  },
  {
    name: 'Laundry',
    icon: '/icons/laundry.png',
    description: 'Professional laundry services',
    link: '/laundry'
  },
  {
    name: 'Transport',
    icon: '/icons/transport.png',
    description: 'Local transport and cab services',
    link: '/transport'
  },
  {
    name: 'Gym',
    icon: '/icons/gym.png',
    description: 'Fitness centers and gyms',
    link: '/gym'
  },
  {
    name: 'Library',
    icon: '/icons/library.png',
    description: 'Study spaces and libraries',
    link: '/library'
  },
  {
    name: 'Events',
    icon: '/icons/events.png',
    description: 'Local events and meetups',
    link: '/events'
  },
  {
    name: 'More',
    icon: '/icons/more.png',
    description: 'Explore more services',
    link: '/services'
  }
];

export default function ServicesGrid() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Services</h2>
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => (
            <Link href={service.link} key={service.name}>
              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-12 h-12 mb-3">
                    <Image
                      src={service.icon}
                      alt={service.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}