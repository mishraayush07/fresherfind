const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import the dummy data
const { hostels, pgs, mess } = require('../src/lib/dummyData');

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