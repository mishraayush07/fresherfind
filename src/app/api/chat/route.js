import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

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
    
    // If we have enough user info, perform database query
    if (userInfo.name && userInfo.city && userInfo.lookingFor) {
      try {
        const listings = await queryDatabase(userInfo);
        responseText = await generateResponseWithListings(chat, lastMessage, userInfo, listings);
      } catch (dbError) {
        console.error('Database query error:', dbError);
        responseText = "I'm having trouble accessing the database right now. Could you please try again in a moment?";
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

// Helper function to extract user information from conversation
function extractUserInfo(messages) {
  const userInfo = {
    name: null,
    lookingFor: null,
    city: null,
  };
  
  // Skip the system message at index 0 if it exists
  const startIndex = messages[0]?.role === 'system' ? 1 : 0;
  
  for (let i = startIndex; i < messages.length; i++) {
    const message = messages[i];
    
    // Only process assistant messages as they might contain questions about user info
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
    }
  }
  
  return userInfo;
}

// Helper function to query the database based on user preferences
async function queryDatabase(userInfo) {
  try {
    // Convert type for database query
    const type = userInfo.lookingFor.toLowerCase() === 'pg' ? 'PG' : userInfo.lookingFor.toLowerCase();
    
    // Query database for listings matching user preferences
    const listings = await prisma.listing.findMany({
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
    });
    
    return listings;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to generate a response with listings data
async function generateResponseWithListings(chat, lastMessage, userInfo, listings) {
  if (listings.length === 0) {
    return `I'm sorry, ${userInfo.name}. I couldn't find any ${userInfo.lookingFor} listings in ${userInfo.city}. Would you like to try a different accommodation type or city?`;
  }
  
  // Format listings into a nice message
  let listingsText = `Great news, ${userInfo.name}! I found ${listings.length} ${userInfo.lookingFor} listings in ${userInfo.city}. Here are the details:\n\n`;
  
  listings.forEach((listing, index) => {
    listingsText += `**${index + 1}. ${listing.title}**\n`;
    listingsText += `📍 ${listing.address}\n`;
    listingsText += `💰 ₹${listing.price.toLocaleString()} per month\n`;
    listingsText += `✨ Amenities: ${listing.amenities.join(', ')}\n`;
    listingsText += `📞 Contact: ${listing.contactName} (${listing.contactPhone})\n\n`;
  });
  
  listingsText += `Would you like more information about any of these options, ${userInfo.name}?`;
  
  // Send this formatted text to the model to generate a polished response
  const result = await chat.sendMessage(lastMessage + "\n\n" + listingsText);
  const response = await result.response;
  return response.text();
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