import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    // Create a chat session
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Get the last message from the formatted messages (the user's latest message)
    const lastMessage = formattedMessages.length > 0 ? formattedMessages[formattedMessages.length - 1].parts[0].text : "";

    // Send the message to Gemini and get the response
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    // Return the response from Gemini
    return NextResponse.json({
      model: "gemini-1.5-flash-latest",
      choices: [
        {
          message: {
            role: "assistant",
            content: text,
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