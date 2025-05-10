import { PrismaClient } from '@prisma/client';

/*
 * IMPORTANT: Database Setup Instructions
 * 
 * 1. Create a .env file in the root directory
 * 2. Add the following line to your .env file, replacing with your actual MongoDB connection string:
 *    DATABASE_URL="mongodb+srv://username:password@cluster0.example.mongodb.net/city_living?retryWrites=true&w=majority"
 * 
 * 3. For development, you can:
 *    - Sign up for MongoDB Atlas (free tier): https://www.mongodb.com/cloud/atlas/register
 *    - Or use a local MongoDB server
 */

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 