# Database Setup for CityLiving App

This guide will help you set up the MongoDB database for the CityLiving application.

## Step 1: Create a MongoDB Atlas Account or Use Local MongoDB

### Option 1: MongoDB Atlas (Recommended for Production)

1. Sign up for a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Configure your database access (username and password)
4. Configure network access (IP whitelist)
5. Get your connection string from the Atlas dashboard

### Option 2: Local MongoDB (Good for Development)

1. Install MongoDB Community Edition from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start your MongoDB server locally
3. Create a new database named `city_living`

## Step 2: Set Up Environment Variables

1. Create a `.env` file in the root directory of your project
2. Add your MongoDB connection string to the `.env` file:

```
DATABASE_URL="mongodb+srv://username:password@cluster0.example.mongodb.net/city_living?retryWrites=true&w=majority"
```

- For MongoDB Atlas: Replace `username`, `password`, and `cluster0.example.mongodb.net` with your actual credentials.
- For Local MongoDB: Use `DATABASE_URL="mongodb://localhost:27017/city_living"`

## Step 3: Generate Prisma Client

Run the following command to generate the Prisma client based on your schema:

```bash
npx prisma generate
```

## Step 4: Seed the Database

Once your MongoDB connection is configured, run the seed script to populate the database with initial data:

```bash
npm run prisma:seed
```

This will insert all the dummy data (hostels, PGs, mess services) into your MongoDB database.

## Step 5: Verify the Setup

To verify that your database has been properly seeded, you can use MongoDB Compass or the MongoDB Atlas interface to check that the collections were created and populated.

## Troubleshooting

If you encounter issues with database connectivity:

1. Make sure your MongoDB connection string is correct in the `.env` file
2. Check that network access is properly configured (especially with MongoDB Atlas)
3. For local MongoDB, ensure the MongoDB service is running
4. Check console errors for more specific issues 