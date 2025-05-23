import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client with error handling
let prisma;

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Format messages for Gemini (format differs from OpenAI/Groq format)
    const formattedMessages = formatMessagesForGemini(messages);

    // Get the last user message
    const lastMessage = formattedMessages.length > 0 ? formattedMessages[formattedMessages.length - 1].parts[0].text : "";
    console.log("Last user message:", lastMessage);
    
    // Extract user info and query parameters from conversation
    const userInfo = extractUserInfo(messages);
    
    // Create a chat session
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Response text to be sent back to the user
    let responseText = "";
    
    // For first-time users, provide a welcome message
    if (messages.length <= 1) {
      try {
        // Send direct message without history for first message
        const result = await model.generateContent(
          "You are a helpful accommodation search assistant. Respond with a friendly welcome message asking what type of accommodation they're looking for and in which city."
        );
        const response = await result.response;
        responseText = response.text();
      } catch (error) {
        console.error('Error generating welcome message:', error);
        responseText = "Hi there! I'm your accommodation search assistant. I can help you find hostels, PGs, flats, and mess facilities. What type of accommodation are you looking for and in which city?";
      }
      
      // Fallback if Gemini fails
      if (!responseText) {
        responseText = "Hi there! I'm your accommodation search assistant. I can help you find hostels, PGs, flats, and mess facilities. What type of accommodation are you looking for and in which city?";
      }
      
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
    }
    
    // Check if we can extract accommodation type and city from the message
    const lastUserMessage = lastMessage.toLowerCase();
    
    // Try to extract city from the message if not already known
    if (!userInfo.city) {
      const cityPattern = /\b(mumbai|delhi|bangalore|pune|hyderabad|chennai|kolkata|ahmedabad|jaipur|surat|lucknow|kanpur|nagpur|indore|thane|bhopal|coimbatore|kochi)\b/i;
      const cityMatch = lastUserMessage.match(cityPattern);
      if (cityMatch) {
        userInfo.city = cityMatch[0].charAt(0).toUpperCase() + cityMatch[0].slice(1).toLowerCase();
      }
    }
    
    // Try to extract accommodation type from the message if not already known
    if (!userInfo.lookingFor) {
      if (lastUserMessage.includes("hostel")) userInfo.lookingFor = "hostel";
      else if (lastUserMessage.includes("pg") || lastUserMessage.includes("paying guest")) userInfo.lookingFor = "PG";
      else if (lastUserMessage.includes("flat") || lastUserMessage.includes("apartment")) userInfo.lookingFor = "flat";
      else if (lastUserMessage.includes("mess") || lastUserMessage.includes("food")) userInfo.lookingFor = "mess";
    }
    
    // Check for nearby location in the message
    if (lastUserMessage.includes("near") || lastUserMessage.includes("close to") || lastUserMessage.includes("nearby") || lastUserMessage.includes("around")) {
      userInfo.nearbyLocation = extractNearbyLocationFromMessage(lastUserMessage);
    }
    
    // If we have city but no accommodation type, default to hostel
    if (userInfo.city && !userInfo.lookingFor) {
      userInfo.lookingFor = "hostel";
    }
    
    // Detect if the query is specifically about listings or accommodation
    const isListingQuery = userInfo.city && userInfo.lookingFor;
    const isAboutAccommodation = lastUserMessage.includes("hostel") || 
                               lastUserMessage.includes("pg") || 
                               lastUserMessage.includes("flat") || 
                               lastUserMessage.includes("apartment") || 
                               lastUserMessage.includes("mess") ||
                               lastUserMessage.includes("accommodation") ||
                               lastUserMessage.includes("rent") ||
                               lastUserMessage.includes("stay") ||
                               lastUserMessage.includes("room") ||
                               lastUserMessage.includes("house");
    
    // Check if this is a general question
    const isGeneral = await isGeneralQuestion(chat, lastMessage);
    console.log("Is general question:", isGeneral);
    
    // If it's a general question (not about accommodation), handle it differently
    if (isGeneral) {
      try {
        // Direct approach without chat history for more reliable response
        const result = await model.generateContent({
          contents: [{ 
            role: "user", 
            parts: [{ 
              text: `You are a helpful assistant focused on accommodation search. The user has asked: "${lastMessage}"\n\nThis is not about accommodation. Please briefly answer their question, then politely remind them that you're primarily designed to help with finding accommodation like hostels, PGs, flats, or mess facilities. Ask what type of accommodation they're looking for.` 
            }]
          }]
        });
        
        const response = await result;
        responseText = response.response.text();
        console.log("Generated response for general question:", responseText);
        
        // If we got a valid response from Gemini
        if (responseText && responseText.length > 20) {
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
        } else {
          // Fallback if response is too short or empty
          responseText = `I noticed you're asking about "${lastMessage}". While I can try to help with that, I'm primarily designed to assist you with finding accommodation like hostels, PGs, flats, or mess facilities. What type of accommodation are you looking for?`;
        }
      } catch (error) {
        console.error('Gemini API error with general question:', error);
        // Fallback if Gemini fails
        responseText = `I see you're asking about "${lastMessage}". I'm your accommodation search assistant focused on helping you find hostels, PGs, flats, and mess facilities. What type of accommodation are you looking for and in which city?`;
      }
      
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
    }
    // If we have enough info to search AND the query is about listings, do database search
    else if (isListingQuery && isAboutAccommodation) {
      try {
        let listings;
        
        if (userInfo.nearbyLocation) {
          listings = await queryDatabaseWithNearbyLocation(userInfo);
        } else {
          listings = await queryDatabase(userInfo);
        }
        
        responseText = await generateResponseWithListings(chat, lastMessage, userInfo, listings);
      } catch (dbError) {
        console.error('Database query error:', dbError);
        
        // If database query fails, fall back to Gemini AI
        try {
          const result = await model.generateContent({
            contents: [{ 
              role: "user", 
              parts: [{ 
                text: `You are a helpful accommodation search assistant. The user asked: "${lastMessage}"\n\nOur database is currently experiencing issues. Please inform the user about the technical difficulties but offer to assist in other ways.` 
              }]
            }]
          });
          
          const response = await result;
          responseText = response.response.text();
        } catch (aiError) {
          console.error('Gemini API error:', aiError);
          responseText = "I'm experiencing some technical difficulties with our database. Please try again later or contact our support team for assistance.";
        }
      }
    } else if (userInfo.lookingFor && !userInfo.city) {
      // If we know what they're looking for but not where, ask about city
      try {
        const result = await model.generateContent({
          contents: [{ 
            role: "user", 
            parts: [{ 
              text: `You are a helpful accommodation search assistant. The user asked: "${lastMessage}"\n\nI know they're looking for ${userInfo.lookingFor}, but I need to ask which city they're interested in. Generate a friendly response asking about the city.` 
            }]
          }]
        });
        
        const response = await result;
        responseText = response.response.text();
        
        // Fallback if Gemini doesn't generate a relevant response
        if (!responseText || !responseText.toLowerCase().includes("city")) {
          responseText = `Great! In which city are you looking for ${userInfo.lookingFor}?`;
        }
      } catch (error) {
        console.error('Gemini API error:', error);
        responseText = `Great! In which city are you looking for ${userInfo.lookingFor}?`;
      }
    } else {
      // For general accommodation conversation, use Gemini AI
      try {
        const result = await model.generateContent({
          contents: [{ 
            role: "user", 
            parts: [{ 
              text: `You are a helpful accommodation search assistant for a website that helps users find hostels, PGs, flats, and mess facilities. The user asked: "${lastMessage}"\n\nRespond helpfully about accommodation. Ask about the type of accommodation they need and the city they're interested in if they haven't mentioned these.` 
            }]
          }]
        });
        
        const response = await result;
        responseText = response.response.text();
      } catch (error) {
        console.error('Gemini API error:', error);
        responseText = "I'm here to help you find accommodation. Please let me know what type of accommodation you're looking for (hostel, PG, flat, or mess) and in which city.";
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

// Helper function to check if a message is a general question not related to accommodation
async function isGeneralQuestion(chat, message) {
  try {
    // Keywords that indicate it's about accommodation
    const accommodationKeywords = [
      'hostel', 'pg', 'paying guest', 'flat', 'apartment', 'room', 'mess', 
      'accommodation', 'rent', 'stay', 'living', 'housing', 'lodge'
    ];
    
    // Check if any accommodation keywords are in the message
    const containsAccommodationKeyword = accommodationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    // If it clearly contains accommodation keywords, it's not a general question
    if (containsAccommodationKeyword) {
      return false;
    }
    
    // These keywords almost always indicate a general question
    const generalKeywords = [
      'movie', 'film', 'cricket', 'sport', 'football', 'news', 'politics', 
      'weather', 'song', 'music', 'actor', 'actress', 'celebrity', 'game',
      'who is', 'what is', 'when is', 'why is', 'how to', 'best', 'worst',
      'top', 'ranking', 'winner', 'box office', 'president', 'prime minister'
    ];
    
    // If it contains general keywords, it's likely a general question
    const containsGeneralKeyword = generalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    if (containsGeneralKeyword) {
      return true;
    }
    
    // For ambiguous cases, try to use Gemini to classify
    // But don't rely solely on this to avoid API issues
    try {
      // Use a simpler direct prompt to minimize tokens and complexity
      const result = await chat.sendMessage({
        role: "user",
        parts: [{ text: `Is the query "${message}" about accommodation (hostels, PGs, rooms, housing) or something else? Respond with just one word: ACCOMMODATION or GENERAL.` }]
      });
      
      const response = await result.response;
      const text = response.text().trim().toUpperCase();
      
      // Only accept very clear classifications to avoid ambiguity
      if (text === "GENERAL") {
        return true;
      } else if (text === "ACCOMMODATION") {
        return false;
      } else {
        // If the response isn't clear, use our keyword-based classification
        return false; // Default to accommodation-focused response
      }
    } catch (error) {
      console.error('Error using Gemini for classification:', error);
      // If the Gemini API call fails, use our keyword detection
      return containsGeneralKeyword;
    }
  } catch (error) {
    console.error('Error in isGeneralQuestion:', error);
    // If there's any error, default to accommodation-focused response
    return false;
  }
}

// Helper function to extract user information from conversation
function extractUserInfo(messages) {
  const userInfo = {
    name: null,
    lookingFor: null,
    city: null,
    nearbyLocation: null,
    hasShownResults: false,
    budget: null,
    amenities: []
  };
  
  // Skip the system message at index 0 if it exists
  const startIndex = messages[0]?.role === 'system' ? 1 : 0;
  
  // First pass: Direct extraction from user messages
  for (let i = startIndex; i < messages.length; i++) {
    if (messages[i].role === 'user') {
      const content = messages[i].content.toLowerCase();
      
      // Extract accommodation type
      if (!userInfo.lookingFor) {
        if (content.includes("hostel")) userInfo.lookingFor = "hostel";
        else if (content.includes(" pg ") || content.includes("paying guest")) userInfo.lookingFor = "PG";
        else if (content.includes("flat") || content.includes("apartment")) userInfo.lookingFor = "flat";
        else if (content.includes("mess") || content.includes("food")) userInfo.lookingFor = "mess";
      }
      
      // Extract city names
      if (!userInfo.city) {
        const cityPattern = /\b(mumbai|delhi|bangalore|pune|hyderabad|chennai|kolkata|ahmedabad|jaipur|surat|lucknow|kanpur|nagpur|indore|thane|bhopal|coimbatore|kochi)\b/i;
        const cityMatch = content.match(cityPattern);
        if (cityMatch) {
          userInfo.city = cityMatch[0].charAt(0).toUpperCase() + cityMatch[0].slice(1).toLowerCase();
        }
      }
      
      // Extract budget information
      if (!userInfo.budget) {
        const budgetPattern = /(\d{4,6})\s*(rs|rupees|₹|inr)?/i;
        const budgetMatch = content.match(budgetPattern);
        if (budgetMatch && parseInt(budgetMatch[1]) >= 1000) {
          userInfo.budget = parseInt(budgetMatch[1]);
        }
      }
      
      // Extract amenities preferences
      const commonAmenities = [
        "wifi", "ac", "food", "laundry", "parking", "security", "gym", 
        "tv", "fridge", "washing machine", "geyser", "water", "electricity", 
        "furniture", "attached bathroom", "balcony"
      ];
      
      commonAmenities.forEach(amenity => {
        if (content.includes(amenity) && !userInfo.amenities.includes(amenity)) {
          userInfo.amenities.push(amenity);
        }
      });
      
      // Check for nearby location mentions
      if ((content.includes("near") || content.includes("close to") || content.includes("nearby") || content.includes("around")) && !userInfo.nearbyLocation) {
        userInfo.nearbyLocation = extractNearbyLocationFromMessage(content);
      }
    }
  }
  
  // Second pass: Context-based extraction from conversation flow
  for (let i = startIndex; i < messages.length; i++) {
    const message = messages[i];
    
    // Process assistant messages for questions
    if (message.role === 'assistant') {
      const content = message.content.toLowerCase();
      
      // Check if the assistant asked for the user's name
      if (content.includes("name") && content.includes("?") && i + 1 < messages.length && messages[i + 1].role === 'user') {
        const userResponse = messages[i + 1].content.trim();
        // Extract first word as name, but ensure it's not a sentence
        const possibleName = userResponse.split(' ')[0].replace(/[^\w\s]/gi, '');
        if (possibleName.length > 1 && possibleName.length < 20) {
          userInfo.name = possibleName.charAt(0).toUpperCase() + possibleName.slice(1);
        }
      }
      
      // Check if the assistant asked what the user is looking for
      if ((content.includes("looking for") || content.includes("type of") || content.includes("accommodation")) && 
          content.includes("?") && i + 1 < messages.length && messages[i + 1].role === 'user') {
        const nextMessage = messages[i + 1].content.toLowerCase();
        if (nextMessage.includes("hostel")) userInfo.lookingFor = "hostel";
        else if (nextMessage.includes("pg") || nextMessage.includes("paying guest")) userInfo.lookingFor = "PG";
        else if (nextMessage.includes("flat") || nextMessage.includes("apartment")) userInfo.lookingFor = "flat";
        else if (nextMessage.includes("mess")) userInfo.lookingFor = "mess";
      }
      
      // Check if the assistant asked about the city
      if ((content.includes("which city") || content.includes("what city") || content.includes("in which city")) && 
          i + 1 < messages.length && messages[i + 1].role === 'user') {
        userInfo.city = messages[i + 1].content.trim();
        // Clean up city name
        userInfo.city = userInfo.city.replace(/[^\w\s]/gi, '').replace(/^in /i, '').trim();
        if (userInfo.city.length > 0) {
          userInfo.city = userInfo.city.charAt(0).toUpperCase() + userInfo.city.slice(1).toLowerCase();
        }
      }
      
      // Check if the assistant asked about nearby location preference
      if ((content.includes("specific area") || content.includes("landmark") || content.includes("near")) && 
          i + 1 < messages.length && messages[i + 1].role === 'user') {
        userInfo.nearbyLocation = extractNearbyLocationFromMessage(messages[i + 1].content);
      }
      
      // Check if results have already been shown
      if (content.includes("found") && (content.includes("listings") || content.includes("results"))) {
        userInfo.hasShownResults = true;
      }
    }
  }
  
  // Clean up and validate extracted information
  if (userInfo.name && userInfo.name.length > 20) {
    userInfo.name = userInfo.name.substring(0, 20);
  }
  
  if (userInfo.city && userInfo.city.length > 30) {
    userInfo.city = userInfo.city.substring(0, 30);
  }
  
  return userInfo;
}

// Extract nearby location from a message
function extractNearbyLocationFromMessage(message) {
  if (!message) return null;
  
  const content = message.toLowerCase();
  
  // Common patterns for nearby location mentions
  const nearbyPatterns = [
    /near\s+([a-z0-9\s]+)(?:\.|\?|!|$)/i,
    /close to\s+([a-z0-9\s]+)(?:\.|\?|!|$)/i,
    /nearby\s+([a-z0-9\s]+)(?:\.|\?|!|$)/i,
    /around\s+([a-z0-9\s]+)(?:\.|\?|!|$)/i,
    /in\s+([a-z0-9\s]+)\s+area/i,
    /at\s+([a-z0-9\s]+)(?:\.|\?|!|$)/i
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
    // Convert type for database query
    const type = userInfo.lookingFor.toLowerCase() === 'pg' ? 'pg' : userInfo.lookingFor.toLowerCase();
    
    // Add timeout to prevent long-running queries
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 5000)
    );
    
    // Build the query with all available filters
    let whereClause = {
        type: {
          contains: type,
          mode: 'insensitive'
        },
        city: {
          contains: userInfo.city,
          mode: 'insensitive'
        }
    };
    
    // Add budget filter if provided
    if (userInfo.budget) {
      whereClause.price = {
        lte: userInfo.budget
      };
    }
    
    // Add amenities filter if provided
    if (userInfo.amenities && userInfo.amenities.length > 0) {
      whereClause.amenities = {
        hasSome: userInfo.amenities
      };
    }
    
    // Actual query
    const queryPromise = prisma.listing.findMany({
      where: whereClause,
      take: 5, // Limit to 5 results
      orderBy: {
        createdAt: 'desc' // Get newest listings first
      }
    });
    
    // Race between timeout and query
    let listings = await Promise.race([queryPromise, timeoutPromise]);
    
    // If no exact matches found, try a series of more flexible searches
    if (listings.length === 0) {
      console.log('No exact matches found, trying more flexible searches');
      
      // Try 1: Partial match on city name (instead of search operator)
      const cityPartialMatchQuery = prisma.listing.findMany({
        where: {
          type: {
            contains: type,
            mode: 'insensitive'
          },
          city: {
            contains: userInfo.city.substring(0, Math.max(3, Math.floor(userInfo.city.length * 0.7))), // Use first 70% of the city name
            mode: 'insensitive'
          }
        },
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      try {
        listings = await Promise.race([cityPartialMatchQuery, timeoutPromise]);
      } catch (error) {
        console.error('City partial match search failed:', error);
      }
      
      // Try 2: If still no results, try with just the type
      if (listings.length === 0) {
        const typeOnlyQueryPromise = prisma.listing.findMany({
          where: {
            type: {
              contains: type,
              mode: 'insensitive'
            }
          },
          take: 5,
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        listings = await Promise.race([typeOnlyQueryPromise, timeoutPromise]);
      }
      
      // Try 3: If still no results, try with similar accommodation types
      if (listings.length === 0) {
        const similarTypes = getSimilarTypes(type);
        if (similarTypes.length > 0) {
          const similarTypeQueryPromise = prisma.listing.findMany({
            where: {
              type: {
                in: similarTypes,
                mode: 'insensitive'
              },
              city: {
                contains: userInfo.city,
                mode: 'insensitive'
              }
            },
            take: 5,
            orderBy: {
              createdAt: 'desc'
            }
          });
          
          listings = await Promise.race([similarTypeQueryPromise, timeoutPromise]);
        }
      }
      
      // Try 4: Last resort - get any recent listings
      if (listings.length === 0) {
        const anyListingsQueryPromise = prisma.listing.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        listings = await Promise.race([anyListingsQueryPromise, timeoutPromise]);
      }
    }
    
    return listings;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get similar accommodation types
function getSimilarTypes(type) {
  switch(type.toLowerCase()) {
    case 'hostel':
      return ['pg', 'dormitory'];
    case 'pg':
      return ['hostel', 'flat'];
    case 'flat':
      return ['apartment', 'pg'];
    case 'mess':
      return ['canteen', 'tiffin'];
    default:
      return [];
  }
}

// Helper function to query the database with nearby location filter
async function queryDatabaseWithNearbyLocation(userInfo) {
  try {
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
        OR: [
          {
        nearbyLocations: {
          hasSome: [userInfo.nearbyLocation]
        }
          },
          {
            address: {
              contains: userInfo.nearbyLocation,
              mode: 'insensitive'
            }
          },
          {
            location: {
              contains: userInfo.nearbyLocation,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: userInfo.nearbyLocation,
              mode: 'insensitive'
            }
          }
        ]
      },
      take: 5, // Limit to 5 results
      orderBy: {
        createdAt: 'desc' // Get newest listings first
      }
    });
    
    // Race between timeout and query
    let listings = await Promise.race([queryPromise, timeoutPromise]);
    
    // If no exact matches, try a more flexible search
    if (listings.length === 0) {
      // Try with a more flexible location match
      const flexibleLocationQueryPromise = prisma.listing.findMany({
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
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      listings = await Promise.race([flexibleLocationQueryPromise, timeoutPromise]);
      
      // If still no results, fall back to regular search
      if (listings.length === 0) {
        return await queryDatabase(userInfo);
      }
    }
    
    return listings;
  } catch (error) {
    console.error('Database query error with nearby location:', error);
    // Fall back to regular query
      return await queryDatabase(userInfo);
  }
}

// Helper function to generate a response with listings data
async function generateResponseWithListings(chat, lastMessage, userInfo, listings) {
  if (!listings || listings.length === 0) {
    if (userInfo.nearbyLocation) {
      return `I'm sorry, ${userInfo.name || "there"}. I couldn't find any ${userInfo.lookingFor} listings in ${userInfo.city} near ${userInfo.nearbyLocation}. Would you like to see listings without the location filter? Or perhaps try a different area?`;
    }
    return `I'm sorry, ${userInfo.name || "there"}. I couldn't find any ${userInfo.lookingFor} listings in ${userInfo.city}. Would you like to try a different accommodation type or city? We have listings for hostels, PGs, flats, and mess facilities in various cities.`;
  }
  
  // Format listings into a nice message
  let listingsText = "";
  
  if (userInfo.nearbyLocation) {
    listingsText = `Great news, ${userInfo.name || "there"}! I found ${listings.length} ${userInfo.lookingFor} listings in ${userInfo.city} near ${userInfo.nearbyLocation}:\n\n`;
  } else {
    listingsText = `Great news, ${userInfo.name || "there"}! I found ${listings.length} ${userInfo.lookingFor} listings in ${userInfo.city}:\n\n`;
  }
  
  listings.forEach((listing, index) => {
    listingsText += `**${index + 1}. ${listing.title}**\n`;
    listingsText += `📍 ${listing.address}\n`;
    listingsText += `💰 ₹${listing.price.toLocaleString()} per month\n`;
    
    // Add nearby locations if available
    if (listing.nearbyLocations && listing.nearbyLocations.length > 0) {
      listingsText += `🏙️ Nearby: ${listing.nearbyLocations.join(', ')}\n`;
    }
    
    // Add amenities if available
    if (listing.amenities && listing.amenities.length > 0) {
      listingsText += `✨ Amenities: ${listing.amenities.join(', ')}\n`;
    }
    
    listingsText += `📞 Contact: ${listing.contactName} (${listing.contactPhone})\n\n`;
  });
  
  if (!userInfo.hasShownResults && !userInfo.nearbyLocation) {
    listingsText += `Would you like more information about any of these options, ${userInfo.name || "there"}? Or would you prefer to see listings near a specific location in ${userInfo.city}?`;
  } else {
    listingsText += `Would you like more information about any of these options, ${userInfo.name || "there"}? You can also search for different accommodation types or in other areas.`;
  }
  
  try {
    // This system instruction helps Gemini understand the context
    const systemInstruction = "You are an accommodation search assistant. The user is looking for accommodation.";
    
    // Send the listings to Gemini for enhancement and contextual understanding
    const enhancedMessage = `${systemInstruction}\n\nI've found some listings to share with the user based on their search for ${userInfo.lookingFor} in ${userInfo.city}${userInfo.nearbyLocation ? ' near ' + userInfo.nearbyLocation : ''}. Here are the listings:\n\n${listingsText}\n\nPlease respond to the user's query: ${lastMessage}`;
    
    const result = await chat.sendMessage(enhancedMessage);
    const response = await result.response;
    const responseText = response.text();
    
    // Check if Gemini's response contains the listing information
    // If not, default back to our formatted listings
    if (responseText.includes('**1.') || 
        (responseText.includes(userInfo.lookingFor) && 
         responseText.includes(userInfo.city))) {
      return responseText;
    } else {
      // If Gemini didn't include the listings in its response, use our formatted version
      return listingsText;
    }
  } catch (error) {
    console.error('Error generating response with Gemini:', error);
    // Return our own formatted listings as fallback
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