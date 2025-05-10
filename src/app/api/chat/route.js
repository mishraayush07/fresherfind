import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

// Mock data for fallback when database is unavailable
const MOCK_LISTINGS = {
  hostel: [
    {
      id: "mock1",
      title: "Student Comfort Hostel",
      description: "Comfortable hostel for students with all amenities",
      price: 8000,
      location: "Near University Campus",
      address: "123 College Road",
      city: "Delhi",
      type: "hostel",
      amenities: ["WiFi", "Laundry", "Mess", "Security"],
      images: ["/images/hostel1.jpg"],
      contactName: "Hostel Manager",
      contactPhone: "9876543210",
      nearbyLocations: ["Delhi University", "Metro Station", "Market"]
    },
    {
      id: "mock2",
      title: "City Center PG",
      description: "Well-maintained PG in the heart of the city",
      price: 9500,
      location: "City Center",
      address: "45 Main Street",
      city: "Mumbai",
      type: "pg",
      amenities: ["WiFi", "AC", "Food", "Parking"],
      images: ["/images/pg1.jpg"],
      contactName: "PG Owner",
      contactPhone: "9876543211",
      nearbyLocations: ["Mumbai University", "Railway Station", "Shopping Mall"]
    }
  ],
  pg: [
    {
      id: "mock3",
      title: "Comfort PG for Students",
      description: "Affordable PG with good facilities",
      price: 7500,
      location: "College Area",
      address: "78 College Lane",
      city: "Bangalore",
      type: "pg",
      amenities: ["WiFi", "Food", "Cleaning", "TV"],
      images: ["/images/pg2.jpg"],
      contactName: "PG Manager",
      contactPhone: "9876543212",
      nearbyLocations: ["Bangalore University", "Bus Stop", "Park"]
    }
  ],
  mess: [
    {
      id: "mock4",
      title: "Homely Food Mess",
      description: "Authentic home-style food service",
      price: 3000,
      location: "Residential Area",
      address: "34 Food Street",
      city: "Pune",
      type: "mess",
      amenities: [],
      images: ["/images/mess1.jpg"],
      contactName: "Mess Owner",
      contactPhone: "9876543213",
      nearbyLocations: ["Pune University", "Hospital", "Market"]
    }
  ],
  flat: [
    {
      id: "mock5",
      title: "2BHK Apartment",
      description: "Spacious apartment for rent",
      price: 15000,
      location: "Suburban Area",
      address: "56 Housing Society",
      city: "Hyderabad",
      type: "flat",
      amenities: ["WiFi", "AC", "Parking", "Security", "Gym"],
      images: ["/images/flat1.jpg"],
      contactName: "Apartment Owner",
      contactPhone: "9876543214",
      nearbyLocations: ["Hyderabad University", "IT Park", "Shopping Mall"]
    }
  ]
};

// Initialize Prisma client with error handling
let prisma;
let isPrismaAvailable = true;

try {
  // Prevent multiple instances in development with hot reloading
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  isPrismaAvailable = false;
}

// Initialize the Google Generative AI with API key
export async function POST(request) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API key is missing. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Parse the request body
    let messages;
    try {
      const body = await request.json();
      messages = body.messages;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format. Please check your request body.' },
        { status: 400 }
      );
    }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid messages array:', messages);
      return NextResponse.json(
        { error: 'Invalid request body. Must include a messages array.' },
        { status: 400 }
      );
    }

    // Initialize the Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the Gemini model
    // Use models like:
    // - gemini-1.5-flash-latest (fastest)
    // - gemini-1.5-pro-latest (most capable)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Format messages for Gemini (format differs from OpenAI/Groq format)
    const formattedMessages = formatMessagesForGemini(messages);

    // Get the last user message
    const lastMessage = formattedMessages.length > 0 ? formattedMessages[formattedMessages.length - 1].parts[0].text : "";
    
    // Create a chat session
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Check if we need to handle special commands or queries
    let responseText = "";
    
    // Extract user info and query parameters from conversation
    const userInfo = extractUserInfo(messages);
    
    // Check if database is available
    if (!isPrismaAvailable) {
      console.warn('Prisma client is not available, using mock data');
      
      // Add a note to the system context
      const dbUnavailableContext = "Note: The database is currently unavailable. Using sample listings data instead.";
      const result = await chat.sendMessage(dbUnavailableContext + "\n\n" + lastMessage);
      const response = await result.response;
      responseText = response.text();
      
      // If we have enough user info, use mock data
      if (userInfo.name && userInfo.city && userInfo.lookingFor) {
        const mockListings = getMockListings(userInfo);
        responseText = await generateResponseWithListings(chat, lastMessage, userInfo, mockListings);
      } else {
        // Continue the normal conversation flow to collect user info
        if (messages.length <= 2) {
          responseText = "Hi there! I'd like to help you find the perfect accommodation. Could you please tell me your name?";
        } else if (!userInfo.name) {
          responseText = "Great! What's your name so I can personalize your experience?";
        } else if (!userInfo.lookingFor) {
          responseText = `Thanks, ${userInfo.name}! What type of accommodation are you looking for? (hostel, PG, flat, or mess)`;
        } else if (!userInfo.city) {
          responseText = `Excellent, ${userInfo.name}! In which city are you looking for ${userInfo.lookingFor}?`;
        }
      }
    } else {
      // Database is available, proceed with normal flow
      // If we have enough user info, perform database query
      if (userInfo.name && userInfo.city && userInfo.lookingFor) {
        try {
          // If we have a nearby location preference, use it for filtering
          if (userInfo.nearbyLocation && !userInfo.hasQueriedWithNearby) {
            // Mark that we've queried with nearby location to avoid repetitive queries
            userInfo.hasQueriedWithNearby = true;
            const listings = await queryDatabaseWithNearbyLocation(userInfo);
            responseText = await generateResponseWithListings(chat, lastMessage, userInfo, listings);
          } else {
            // Regular query without nearby location filter
            const listings = await queryDatabase(userInfo);
            
            // If this is the first time showing results and we have results, ask about nearby location
            if (!userInfo.hasShownResults && listings.length > 0) {
              userInfo.hasShownResults = true;
              responseText = await generateResponseWithListings(chat, lastMessage, userInfo, listings);
              responseText += `\n\nIs there a specific area or landmark you'd like to be near in ${userInfo.city}? For example, a college, workplace, or market?`;
            } else {
              responseText = await generateResponseWithListings(chat, lastMessage, userInfo, listings);
            }
          }
        } catch (dbError) {
          console.error('Database query error:', dbError);
          
          // Fallback to mock data
          const mockListings = getMockListings(userInfo);
          responseText = await generateResponseWithListings(chat, lastMessage, userInfo, mockListings);
          responseText = "I'm experiencing some technical difficulties with our database, but I can still help you with some sample listings. " + responseText;
        }
      } else {
        // Continue the normal conversation flow
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        responseText = response.text();
        
        // Guide conversation if we're missing info
        if (messages.length <= 2) {
          responseText = "Hi there! I'd like to help you find the perfect accommodation. Could you please tell me your name?";
        } else if (!userInfo.name) {
          responseText = "Great! What's your name so I can personalize your experience?";
        } else if (!userInfo.lookingFor) {
          responseText = `Thanks, ${userInfo.name}! What type of accommodation are you looking for? (hostel, PG, flat, or mess)`;
        } else if (!userInfo.city) {
          responseText = `Excellent, ${userInfo.name}! In which city are you looking for ${userInfo.lookingFor}?`;
        } else if (lastMessage.toLowerCase().includes("near") || 
                  lastMessage.toLowerCase().includes("close to") || 
                  lastMessage.includes("nearby")) {
          // User is asking about a specific nearby location
          const nearbyLocation = extractNearbyLocationFromMessage(lastMessage);
          if (nearbyLocation) {
            userInfo.nearbyLocation = nearbyLocation;
            try {
              const listings = await queryDatabaseWithNearbyLocation(userInfo);
              responseText = await generateResponseWithListings(chat, lastMessage, userInfo, listings, true);
            } catch (dbError) {
              console.error('Database query error:', dbError);
              
              // Fallback to mock data
              const mockListings = getMockListings(userInfo, nearbyLocation);
              responseText = await generateResponseWithListings(chat, lastMessage, userInfo, mockListings, true);
              responseText = "I'm experiencing some technical difficulties with our database, but I can still help you with some sample listings. " + responseText;
            }
          } else {
            responseText = `Could you please specify which location in ${userInfo.city} you'd like to be near?`;
          }
        }
      }
    }

    // Return the response
    return NextResponse.json({
      model: "gemini-1.5-flash-latest",
      choices: [
        {
          message: {
            role: "assistant",
            content: responseText,
          },
        },
      ],
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return detailed error message
    let errorMessage = 'An error occurred while processing your request';
    let statusCode = 500;
    
    if (error.message) {
      errorMessage = error.message;
      
      // Check for specific error types and give helpful messages
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid API key. Please check your Google Gemini API key.';
      } else if (error.message.includes('model')) {
        errorMessage = 'The requested model is not available or not accessible with your API key.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('prisma') || error.message.includes('database') || error.message.includes('EPERM')) {
        errorMessage = 'We are experiencing database connectivity issues. Our team has been notified.';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message || 'No additional details available'
      },
      { status: statusCode }
    );
  }
}

// Get mock listings based on user preferences
function getMockListings(userInfo, nearbyLocation = null) {
  const type = userInfo.lookingFor.toLowerCase();
  let listings = MOCK_LISTINGS[type] || [];
  
  // Filter by city if provided
  if (userInfo.city) {
    listings = listings.filter(listing => 
      listing.city.toLowerCase() === userInfo.city.toLowerCase()
    );
  }
  
  // Filter by nearby location if provided
  if (nearbyLocation) {
    listings = listings.filter(listing => 
      listing.nearbyLocations.some(loc => 
        loc.toLowerCase().includes(nearbyLocation.toLowerCase())
      )
    );
  }
  
  // If no matches, return all listings of that type
  if (listings.length === 0) {
    listings = MOCK_LISTINGS[type] || [];
    
    // If still no listings, return first mock listing from any type
    if (listings.length === 0) {
      for (const typeKey in MOCK_LISTINGS) {
        if (MOCK_LISTINGS[typeKey].length > 0) {
          listings = [MOCK_LISTINGS[typeKey][0]];
          break;
        }
      }
    }
  }
  
  return listings;
}

// Helper function to extract user information from conversation
function extractUserInfo(messages) {
  const userInfo = {
    name: null,
    lookingFor: null,
    city: null,
    nearbyLocation: null,
    hasShownResults: false,
    hasQueriedWithNearby: false
  };
  
  // Skip the system message at index 0 if it exists
  const startIndex = messages[0]?.role === 'system' ? 1 : 0;
  
  for (let i = startIndex; i < messages.length; i++) {
    const message = messages[i];
    
    // Process assistant messages for questions
    if (message.role === 'assistant') {
      const content = message.content.toLowerCase();
      
      // Check if the assistant asked for the user's name
      if (content.includes("name") && content.includes("?") && i + 1 < messages.length && messages[i + 1].role === 'user') {
        userInfo.name = messages[i + 1].content.trim().split(' ')[0]; // Get first word as name
      }
      
      // Check if the assistant asked what the user is looking for
      if ((content.includes("what") && content.includes("looking for") && content.includes("?")) && 
          i + 1 < messages.length && messages[i + 1].role === 'user') {
        const nextMessage = messages[i + 1].content.toLowerCase();
        if (nextMessage.includes("hostel")) userInfo.lookingFor = "hostel";
        else if (nextMessage.includes("pg")) userInfo.lookingFor = "PG";
        else if (nextMessage.includes("flat")) userInfo.lookingFor = "flat";
        else if (nextMessage.includes("mess")) userInfo.lookingFor = "mess";
      }
      
      // Check if the assistant asked about the city
      if ((content.includes("which city") || content.includes("what city")) && i + 1 < messages.length && messages[i + 1].role === 'user') {
        userInfo.city = messages[i + 1].content.trim();
      }
      
      // Check if the assistant asked about nearby location preference
      if ((content.includes("specific area") || content.includes("landmark") || content.includes("near")) && 
          i + 1 < messages.length && messages[i + 1].role === 'user') {
        userInfo.nearbyLocation = extractNearbyLocationFromMessage(messages[i + 1].content);
      }
      
      // Check if results have already been shown
      if (content.includes("here are the details") || content.includes("found") && content.includes("listings")) {
        userInfo.hasShownResults = true;
      }
    }
    
    // Also check user messages for direct mentions of preferences
    if (message.role === 'user') {
      const content = message.content.toLowerCase();
      
      // Look for direct mentions of accommodation types
      if (!userInfo.lookingFor) {
        if (content.includes("hostel")) userInfo.lookingFor = "hostel";
        else if (content.includes("pg")) userInfo.lookingFor = "PG";
        else if (content.includes("flat")) userInfo.lookingFor = "flat";
        else if (content.includes("mess")) userInfo.lookingFor = "mess";
      }
      
      // Look for direct mentions of cities
      if (!userInfo.city) {
        const commonCities = ['mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai'];
        for (const city of commonCities) {
          if (content.includes(city)) {
            userInfo.city = city.charAt(0).toUpperCase() + city.slice(1); // Capitalize first letter
            break;
          }
        }
      }
      
      // Check for nearby location mentions
      if ((content.includes("near") || content.includes("close to") || content.includes("nearby")) && !userInfo.nearbyLocation) {
        userInfo.nearbyLocation = extractNearbyLocationFromMessage(content);
      }
    }
  }
  
  return userInfo;
}

// Extract nearby location from a message
function extractNearbyLocationFromMessage(message) {
  if (!message) return null;
  
  const content = message.toLowerCase();
  
  // Common patterns for nearby location mentions
  const nearbyPatterns = [
    /near\s+([a-z\s]+)(?:\.|\?|!|$)/i,
    /close to\s+([a-z\s]+)(?:\.|\?|!|$)/i,
    /nearby\s+([a-z\s]+)(?:\.|\?|!|$)/i,
    /around\s+([a-z\s]+)(?:\.|\?|!|$)/i
  ];
  
  for (const pattern of nearbyPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no pattern matches but "near" is mentioned, take the words after "near"
  if (content.includes("near")) {
    const words = content.split("near")[1].trim().split(" ");
    if (words.length > 0) {
      // Take up to 3 words after "near"
      return words.slice(0, 3).join(" ").replace(/[,.!?]$/, "").trim();
    }
  }
  
  // If message is very short, it might just be the location name
  if (content.split(" ").length <= 3 && !content.includes("?")) {
    return content.replace(/[,.!?]$/, "").trim();
  }
  
  return null;
}

// Helper function to query the database based on user preferences
async function queryDatabase(userInfo) {
  try {
    if (!isPrismaAvailable) {
      return getMockListings(userInfo);
    }
    
    // Convert type for database query
    const type = userInfo.lookingFor.toLowerCase() === 'pg' ? 'pg' : userInfo.lookingFor.toLowerCase();
    
    // Add timeout to prevent long-running queries
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 5000)
    );
    
    // Actual query
    const queryPromise = prisma.listing.findMany({
      where: {
        type: {
          contains: type,
          mode: 'insensitive'
        },
        city: {
          contains: userInfo.city,
          mode: 'insensitive'
        }
      },
      take: 5, // Limit to 5 results
      orderBy: {
        createdAt: 'desc' // Get newest listings first
      }
    }).catch(error => {
      console.error('Prisma query error:', error);
      return getMockListings(userInfo);
    });
    
    // Race between timeout and query
    const listings = await Promise.race([queryPromise, timeoutPromise])
      .catch(error => {
        console.error('Query race error:', error);
        return getMockListings(userInfo);
      });
    
    return listings;
  } catch (error) {
    console.error('Database query error:', error);
    // Return mock listings instead of throwing error
    return getMockListings(userInfo);
  }
}

// Helper function to query the database with nearby location filter
async function queryDatabaseWithNearbyLocation(userInfo) {
  try {
    if (!isPrismaAvailable) {
      return getMockListings(userInfo, userInfo.nearbyLocation);
    }
    
    // Convert type for database query
    const type = userInfo.lookingFor.toLowerCase() === 'pg' ? 'pg' : userInfo.lookingFor.toLowerCase();
    
    // Add timeout to prevent long-running queries
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 5000)
    );
    
    // Actual query with nearby location filter
    const queryPromise = prisma.listing.findMany({
      where: {
        type: {
          contains: type,
          mode: 'insensitive'
        },
        city: {
          contains: userInfo.city,
          mode: 'insensitive'
        },
        nearbyLocations: {
          hasSome: [userInfo.nearbyLocation]
        }
      },
      take: 5, // Limit to 5 results
      orderBy: {
        createdAt: 'desc' // Get newest listings first
      }
    }).catch(error => {
      console.error('Prisma nearby query error:', error);
      return [];
    });
    
    // Race between timeout and query
    let listings = await Promise.race([queryPromise, timeoutPromise])
      .catch(error => {
        console.error('Nearby query race error:', error);
        return [];
      });
    
    // If no exact matches, try a more flexible search
    if (listings.length === 0) {
      // Try to find listings with similar nearby locations
      const flexibleQueryPromise = prisma.listing.findMany({
        where: {
          type: {
            contains: type,
            mode: 'insensitive'
          },
          city: {
            contains: userInfo.city,
            mode: 'insensitive'
          },
          nearbyLocations: {
            some: {
              contains: userInfo.nearbyLocation,
              mode: 'insensitive'
            }
          }
        },
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      }).catch(error => {
        console.error('Prisma flexible nearby query error:', error);
        return [];
      });
      
      listings = await Promise.race([flexibleQueryPromise, timeoutPromise])
        .catch(error => {
          console.error('Flexible nearby query race error:', error);
          return [];
        });
      
      // If still no results, fall back to regular search
      if (listings.length === 0) {
        return await queryDatabase(userInfo);
      }
    }
    
    return listings;
  } catch (error) {
    console.error('Database query error with nearby location:', error);
    // Fall back to regular query
    try {
      return await queryDatabase(userInfo);
    } catch (fallbackError) {
      // Return mock listings if all queries fail
      return getMockListings(userInfo, userInfo.nearbyLocation);
    }
  }
}

// Helper function to generate a response with listings data
async function generateResponseWithListings(chat, lastMessage, userInfo, listings, isNearbyQuery = false) {
  if (!listings || listings.length === 0) {
    if (isNearbyQuery) {
      return `I'm sorry, ${userInfo.name}. I couldn't find any ${userInfo.lookingFor} listings in ${userInfo.city} near ${userInfo.nearbyLocation}. Would you like to see listings without the location filter?`;
    }
    return `I'm sorry, ${userInfo.name}. I couldn't find any ${userInfo.lookingFor} listings in ${userInfo.city}. Would you like to try a different accommodation type or city?`;
  }
  
  // Format listings into a nice message
  let listingsText = "";
  
  if (isNearbyQuery) {
    listingsText = `Great news, ${userInfo.name}! I found ${listings.length} ${userInfo.lookingFor} listings in ${userInfo.city} near ${userInfo.nearbyLocation}. Here are the details:\n\n`;
  } else {
    listingsText = `Great news, ${userInfo.name}! I found ${listings.length} ${userInfo.lookingFor} listings in ${userInfo.city}. Here are the details:\n\n`;
  }
  
  listings.forEach((listing, index) => {
    listingsText += `**${index + 1}. ${listing.title}**\n`;
    listingsText += `📍 ${listing.address}\n`;
    listingsText += `💰 ₹${listing.price.toLocaleString()} per month\n`;
    
    // Add nearby locations
    if (listing.nearbyLocations && listing.nearbyLocations.length > 0) {
      listingsText += `🏙️ Nearby: ${listing.nearbyLocations.join(', ')}\n`;
    }
    
    // Add amenities if available
    if (listing.amenities && listing.amenities.length > 0) {
      listingsText += `✨ Amenities: ${listing.amenities.join(', ')}\n`;
    }
    
    listingsText += `📞 Contact: ${listing.contactName} (${listing.contactPhone})\n\n`;
  });
  
  if (!isNearbyQuery && !userInfo.hasQueriedWithNearby) {
    listingsText += `Would you like more information about any of these options, ${userInfo.name}? Or would you prefer to see listings near a specific location in ${userInfo.city}?`;
  } else {
    listingsText += `Would you like more information about any of these options, ${userInfo.name}?`;
  }
  
  try {
    // Send this formatted text to the model to generate a polished response
    const result = await chat.sendMessage(lastMessage + "\n\n" + listingsText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // If model fails, return the raw listings text
    console.error('Error generating polished response:', error);
    return listingsText;
  }
}

// Helper function to format messages for Gemini API
function formatMessagesForGemini(messages) {
  return messages.map(message => {
    // Determine the role (Gemini uses 'user' and 'model')
    const role = message.role === 'assistant' ? 'model' : 'user';
    
    return {
      role: role,
      parts: [{ text: message.content }]
    };
  });
} 