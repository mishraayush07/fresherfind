const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import the dummy data
const { hostels, pgs, mess } = require('../src/lib/dummyData');

// Helper function to generate nearby locations based on city
function generateNearbyLocations(city, type) {
  const cityLocations = {
    'Mumbai': [
      'Mumbai University', 'Marine Drive', 'Juhu Beach', 'Bandra Station', 'Dadar Market',
      'Andheri Metro', 'Powai Lake', 'Sion Hospital', 'Churchgate', 'Nariman Point'
    ],
    'Delhi': [
      'Delhi University', 'Connaught Place', 'India Gate', 'Karol Bagh Market', 'Hauz Khas',
      'Lajpat Nagar Metro', 'Lodhi Gardens', 'AIIMS Hospital', 'Chandni Chowk', 'Nehru Place'
    ],
    'Bangalore': [
      'Bangalore University', 'MG Road', 'Cubbon Park', 'Indiranagar', 'Koramangala',
      'Electronic City', 'Lalbagh Botanical Garden', 'Christ College', 'Whitefield', 'Brigade Road'
    ],
    'Pune': [
      'Pune University', 'FC Road', 'Shivaji Nagar', 'Koregaon Park', 'Aga Khan Palace',
      'Sinhagad Fort', 'Magarpatta City', 'Aundh', 'Hinjewadi IT Park', 'Viman Nagar'
    ],
    'Hyderabad': [
      'Hyderabad University', 'Charminar', 'Hussain Sagar Lake', 'Banjara Hills', 'HITEC City',
      'Golconda Fort', 'Jubilee Hills', 'Secunderabad Railway Station', 'Gachibowli', 'Begumpet'
    ],
    'Chennai': [
      'Chennai University', 'Marina Beach', 'T Nagar', 'Anna Nagar', 'Mylapore',
      'Besant Nagar', 'Adyar', 'Velachery', 'Guindy', 'Egmore'
    ]
  };

  // Default locations if city not found
  const defaultLocations = [
    'City Center', 'Main Market', 'Bus Station', 'Railway Station', 'City Hospital'
  ];

  // Get locations for the city or use default
  const locations = cityLocations[city] || defaultLocations;
  
  // For educational institutions, prioritize nearby colleges/universities
  if (type === 'hostel' || type === 'pg') {
    const educationalPlaces = locations.filter(loc => 
      loc.includes('University') || 
      loc.includes('College') || 
      loc.includes('Institute')
    );
    
    // Ensure at least one educational place is included
    if (educationalPlaces.length > 0) {
      // Select 3-5 random locations, ensuring at least one educational place
      const result = [educationalPlaces[0]];
      
      // Add 2-4 more random locations
      const otherLocations = locations.filter(loc => !educationalPlaces.includes(loc));
      const numToAdd = Math.floor(Math.random() * 3) + 2; // 2-4 additional locations
      
      for (let i = 0; i < numToAdd && i < otherLocations.length; i++) {
        const randomIndex = Math.floor(Math.random() * otherLocations.length);
        result.push(otherLocations[randomIndex]);
        otherLocations.splice(randomIndex, 1); // Remove to avoid duplicates
      }
      
      return result;
    }
  }
  
  // For other types or if no educational places found, just pick random locations
  const numLocations = Math.floor(Math.random() * 3) + 3; // 3-5 nearby locations
  const result = [];
  
  // Copy the array to avoid modifying the original
  const availableLocations = [...locations];
  
  for (let i = 0; i < numLocations && availableLocations.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableLocations.length);
    result.push(availableLocations[randomIndex]);
    availableLocations.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return result;
}

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.listing.deleteMany({});

  // Insert hostels
  console.log('Inserting hostels...');
  for (const hostel of hostels) {
    await prisma.listing.create({
      data: {
        title: hostel.name,
        description: hostel.description,
        price: hostel.price,
        location: hostel.location,
        address: hostel.location,
        city: hostel.city,
        type: 'hostel',
        amenities: hostel.amenities,
        images: hostel.images,
        contactName: `Owner of ${hostel.name}`,
        contactPhone: hostel.contact,
        nearbyLocations: generateNearbyLocations(hostel.city, 'hostel'),
        coordinates: null,
        // Additional metadata as JSON
        metadata: {
          gender: hostel.gender,
          capacity: hostel.capacity,
          priceUnit: hostel.priceUnit,
          rating: hostel.rating,
          reviews: hostel.reviews
        }
      }
    });
  }

  // Insert PGs
  console.log('Inserting PGs...');
  for (const pg of pgs) {
    await prisma.listing.create({
      data: {
        title: pg.name,
        description: pg.description,
        price: pg.price,
        location: pg.location,
        address: pg.location,
        city: pg.city,
        type: 'pg',
        amenities: pg.amenities,
        images: pg.images,
        contactName: `Owner of ${pg.name}`,
        contactPhone: pg.contact,
        nearbyLocations: generateNearbyLocations(pg.city, 'pg'),
        coordinates: null,
        // Additional metadata as JSON
        metadata: {
          gender: pg.gender,
          capacity: pg.capacity,
          priceUnit: pg.priceUnit,
          rating: pg.rating,
          reviews: pg.reviews
        }
      }
    });
  }

  // Insert mess services
  console.log('Inserting mess services...');
  for (const messService of mess) {
    await prisma.listing.create({
      data: {
        title: messService.name,
        description: messService.description,
        price: messService.price,
        location: messService.location,
        address: messService.location,
        city: messService.city,
        type: 'mess',
        amenities: [], // No amenities for mess services in schema
        images: messService.images,
        contactName: `Owner of ${messService.name}`,
        contactPhone: messService.contact,
        nearbyLocations: generateNearbyLocations(messService.city, 'mess'),
        coordinates: null,
        // Additional metadata as JSON
        metadata: {
          mealType: messService.mealType,
          timing: messService.timing,
          speciality: messService.speciality,
          priceUnit: messService.priceUnit,
          rating: messService.rating,
          reviews: messService.reviews
        }
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 