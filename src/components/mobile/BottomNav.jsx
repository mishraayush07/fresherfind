'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Building2, MapPin, Utensils, User } from 'lucide-react';
import ChatButton from '@/components/Chat/ChatButton';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/listing', label: 'Listings', icon: Building2 },
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/mess', label: 'Mess', icon: Utensils },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <ChatButton />
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center"
              >
                <item.icon
                  className={`h-6 w-6 ${
                    isActive ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? 'text-blue-500' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
} 