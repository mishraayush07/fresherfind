'use client';

import { useState, useEffect } from 'react';
import ChatBot from './ChatBot';

export default function ChatButton() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Close chat with escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isChatOpen]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isChatOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isChatOpen]);

  // Show tooltip after 3 seconds if chat hasn't been opened yet
  useEffect(() => {
    if (!isChatOpen) {
      const tooltipTimer = setTimeout(() => {
        setIsTooltipVisible(true);
      }, 3000);
      
      return () => clearTimeout(tooltipTimer);
    }
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsTooltipVisible(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isTooltipVisible && !isChatOpen && (
          <div className="absolute bottom-16 right-0 bg-white p-3 rounded-lg shadow-lg text-gray-700 text-sm w-48 mb-2 animate-fade-in">
            Need help? Chat with our AI assistant!
            <div className="absolute bottom-[-6px] right-5 w-3 h-3 bg-white transform rotate-45"></div>
          </div>
        )}
        
        <button 
          onClick={toggleChat}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          onMouseEnter={() => !isChatOpen && setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          aria-label="Chat with AI assistant"
        >
          {isChatOpen ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
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
          )}
        </button>
      </div>

      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:inset-auto md:bottom-24 md:right-6 z-40 flex items-end md:items-end justify-center md:justify-end" 
          onClick={(e) => {
            // Close if clicking the overlay area (not the chat container)
            if (e.target === e.currentTarget) {
              toggleChat();
            }
          }}
        >
          <div className="relative w-full md:w-96 h-[500px] md:h-[450px] max-h-[90vh] md:max-h-[600px] animate-slide-up md:animate-slide-in">
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
} 