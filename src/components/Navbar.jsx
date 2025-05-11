'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white/90 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-600 group-hover:to-blue-600">
                FresherFind
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/listing">Browse Listings</NavLink>
            <NavLink href="/add-listing">Add Listing</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/chat" className="flex items-center">
              <span>Chat</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </NavLink>
            <Link 
              href="/add-listing" 
              className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Post Your Property
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <div className="relative w-6 h-5">
                <span 
                  className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}
                  style={{ top: '0' }}
                />
                <span 
                  className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <span 
                  className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}
                  style={{ bottom: '0' }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-inner">
          <MobileNavLink href="/listing">Browse Listings</MobileNavLink>
          <MobileNavLink href="/add-listing">Add Listing</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/chat">
            <span className="flex items-center">
              Chat Assistant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </span>
          </MobileNavLink>
          <div className="pt-2">
            <Link 
              href="/add-listing"
              className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium"
            >
              Post Your Property
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Desktop navigation link component
function NavLink({ href, className = '', children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 relative group ${
        isActive 
          ? 'text-blue-600' 
          : 'text-gray-700 hover:text-blue-600'
      } ${className}`}
    >
      <div className="flex items-center justify-center">
        {children}
      </div>
      <span 
        className={`absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-blue-600 transform -translate-x-1/2 transition-transform duration-300 ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-blue-50 text-blue-600 font-medium' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
} 