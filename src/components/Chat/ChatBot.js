'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentModel, setCurrentModel] = useState("gemini-1.5-flash-latest");
  const [chatState, setChatState] = useState("initial"); // initial, collecting-info, showing-results
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add entrance animation when component mounts
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        chatContainer.classList.add('animate-slide-up');
      } else {
        chatContainer.classList.add('animate-slide-in');
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to correct common spelling mistakes in user input
  const correctSpellingMistakes = (text) => {
    // Common misspellings and their corrections
    const corrections = {
      'hostl': 'hostel',
      'hostels': 'hostel',
      'hostle': 'hostel',
      'hotle': 'hostel',
      'hotl': 'hostel',
      'hotell': 'hostel',
      'hotl': 'hostel',
      'pgg': 'pg',
      'pgs': 'pg',
      'paying gust': 'paying guest',
      'flats': 'flat',
      'appartment': 'apartment',
      'appartments': 'apartment',
      'apartments': 'apartment',
      'flatt': 'flat',
      'mess': 'mess',
      'messes': 'mess',
      'accomodation': 'accommodation',
      'acommodation': 'accommodation',
      'acomodation': 'accommodation',
      'dlehi': 'delhi',
      'dlhi': 'delhi',
      'mumbaii': 'mumbai',
      'bombay': 'mumbai',
      'banglore': 'bangalore',
      'bangalor': 'bangalore',
      'bangaluru': 'bangalore',
      'hydrabd': 'hyderabad',
      'hydrabad': 'hyderabad',
      'chenai': 'chennai',
      'chenni': 'chennai',
      'pun': 'pune',
      'poona': 'pune',
      'kolkatta': 'kolkata',
      'calcutta': 'kolkata'
    };
    
    // Split the text into words and correct each word if needed
    return text.split(' ').map(word => {
      const lowercaseWord = word.toLowerCase();
      return corrections[lowercaseWord] || word;
    }).join(' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Apply spelling corrections to user input
    const correctedInput = correctSpellingMistakes(input);
    
    const userMessage = { role: 'user', content: correctedInput };
    
    // Update UI immediately with user message (show original input, not corrected)
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare the messages for the API
      const apiMessages = [
        { role: 'system', content: 'You are a helpful assistant for a city-listing website. You can help users find accommodation, answer questions about listings, and provide information about different areas.' },
        ...messages.map(msg => 
          msg.role === 'user' ? { ...msg, content: correctSpellingMistakes(msg.content) } : msg
        ),
        userMessage
      ];
      
      // Send request to our API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from Gemini AI service');
      }
      
      // Check if the response contains an error message
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Extract the assistant's message from the response
      let assistantContent = '';
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Standard format
        assistantContent = data.choices[0].message.content;
        if (data.model) {
          setCurrentModel(data.model);
        }
      } else if (data.content) {
        // Alternative format
        assistantContent = data.content;
      } else {
        console.warn('Unexpected response format:', data);
        assistantContent = 'I received your message, but there was an issue with the response format. Please try asking in a different way.';
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: assistantContent
      };
      
      // Update the messages state with the assistant's response
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      
      // Update chat state based on conversation progress
      updateChatState(assistantContent);
    } catch (err) {
      console.error('Error in chat:', err);
      
      // Handle specific error cases with user-friendly messages
      let errorMessage = err.message || 'Something went wrong. Please try again.';
      
      if (errorMessage.includes('API key')) {
        errorMessage = 'There is an issue with the AI service configuration. Please contact the site administrator.';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'The AI service is currently experiencing high traffic. Please try again in a few minutes.';
      } else if (errorMessage.includes('model')) {
        errorMessage = 'The selected AI model is currently unavailable. The system will try to use an alternative model.';
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Unable to connect to the AI service. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update chat state based on conversation progress
  const updateChatState = (assistantContent) => {
    if (messages.length <= 2) {
      setChatState("collecting-info");
    } else if (assistantContent.includes("found") && 
              (assistantContent.includes("listings") || assistantContent.includes("hostel") || 
               assistantContent.includes("PG") || assistantContent.includes("flat") || 
               assistantContent.includes("mess"))) {
      setChatState("showing-results");
    } else if (assistantContent.includes("specific area") || 
              assistantContent.includes("landmark") || 
              assistantContent.includes("near")) {
      setChatState("asking-location");
    }
  };

  const retryLastMessage = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      setInput(messages[messages.length - 1].content);
    }
  };

  // Format message content with proper HTML formatting
  const formatMessageContent = (content) => {
    // Check if this is a listing result message
    if ((content.includes("**") && content.includes("found")) || 
        (content.includes("found") && content.includes("listings"))) {
      // Parse and format the listing results
      return (
        <div className="listing-results">
          {content.split('\n\n').map((paragraph, idx) => {
            // Check if this paragraph is a listing item
            if (paragraph.startsWith('**')) {
              const lines = paragraph.split('\n');
              // Extract title (remove ** markers)
              const title = lines[0].replace(/\*\*/g, '');
              
              return (
                <div key={idx} className="listing-item p-3 mb-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-blue-700 text-lg mb-2">{title}</h3>
                  <div className="space-y-1">
                    {lines.slice(1).map((line, lineIdx) => {
                      if (line.includes('📍')) {
                        return <p key={lineIdx} className="text-gray-700 flex items-start">
                          <span className="mr-2">📍</span>
                          <span>{line.replace('📍', '')}</span>
                        </p>;
                      } else if (line.includes('💰')) {
                        return <p key={lineIdx} className="font-semibold text-green-700 flex items-start">
                          <span className="mr-2">💰</span>
                          <span>{line.replace('💰', '')}</span>
                        </p>;
                      } else if (line.includes('✨')) {
                        return <p key={lineIdx} className="text-gray-600 flex items-start">
                          <span className="mr-2">✨</span>
                          <span>{line.replace('✨', '')}</span>
                        </p>;
                      } else if (line.includes('🏙️')) {
                        return <p key={lineIdx} className="text-indigo-600 font-medium flex items-start">
                          <span className="mr-2">🏙️</span>
                          <span>{line.replace('🏙️', '')}</span>
                        </p>;
                      } else if (line.includes('📞')) {
                        return <p key={lineIdx} className="text-blue-600 flex items-start">
                          <span className="mr-2">📞</span>
                          <span>{line.replace('📞', '')}</span>
                        </p>;
                      } else {
                        return <p key={lineIdx}>{line}</p>;
                      }
                    })}
                  </div>
                </div>
              );
            } else {
              // Process regular paragraphs with markdown-like formatting
              return <p key={idx} className="mb-2">{formatTextWithMarkdown(paragraph)}</p>;
            }
          })}
        </div>
      );
    }
    
    // Regular message formatting with markdown support
    return <div className="message-content">{formatTextWithMarkdown(content)}</div>;
  };

  // Helper function to format text with markdown-like syntax
  const formatTextWithMarkdown = (text) => {
    if (!text) return '';
    
    // Format bold text (replace ** with <strong>)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format paragraphs
    formattedText = formattedText.split('\n\n').map(para => 
      `<p>${para}</p>`
    ).join('');
    
    // Format line breaks
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  // Generate placeholder text based on chat state
  const getPlaceholderText = () => {
    switch (chatState) {
      case "initial":
        return "Hi! I'm looking for accommodation...";
      case "collecting-info":
        return "Tell me your preferences or city...";
      case "asking-location":
        return "Enter a nearby location (university, landmark, etc.)...";
      case "showing-results":
        return "Ask about a specific listing or search near a location...";
      default:
        return "Type your message...";
    }
  };

  return (
    <div id="chat-container" className="flex flex-col h-full w-full border rounded-lg overflow-hidden bg-white shadow-lg md:rounded-2xl">
      <div className="p-3 bg-blue-600 text-white font-medium flex justify-between items-center">
        <span className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </svg>
          Accommodation Finder
        </span>
        {chatState === "showing-results" && (
          <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
            Showing Listings
          </span>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p className="mb-2 font-medium">👋 Hi there! How can I help you today?</p>
            <p className="text-sm">Looking for a hostel, PG, flat or mess? Just tell me what you need and where!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${
                message.role === 'user' 
                  ? 'text-right' 
                  : 'text-left'
              }`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-800 border border-gray-200'
                } max-w-[85%] shadow-sm`}
              >
                {message.role === 'assistant' 
                  ? formatMessageContent(message.content)
                  : message.content
                }
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block p-3 rounded-lg bg-white text-gray-800 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="dot-typing"></div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 mb-4 p-3 bg-red-50 rounded border border-red-100">
            <p className="mb-2">Error: {error}</p>
            <button 
              onClick={retryLastMessage} 
              className="text-blue-600 underline text-sm hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            placeholder={getPlaceholderText()}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
        
        {chatState === "showing-results" && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Tip: You can ask to find listings near specific locations like "near Delhi University" or "close to Koramangala"
          </div>
        )}
      </form>
    </div>
  );
} 