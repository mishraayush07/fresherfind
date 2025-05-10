'use client';

import { useState } from 'react';
import { User, Settings, Heart, History, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">John Doe</h1>
            <p className="text-gray-600">john.doe@example.com</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-4 bg-white">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-4 border-b border-gray-100 ${
              activeTab === item.id ? 'bg-blue-50' : ''
            }`}
          >
            <item.icon
              className={`h-5 w-5 ${
                activeTab === item.id ? 'text-blue-500' : 'text-gray-400'
              }`}
            />
            <span
              className={`${
                activeTab === item.id ? 'text-blue-500' : 'text-gray-700'
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-4 bg-white p-4">
        <button className="w-full flex items-center gap-4 text-red-500">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center text-blue-500">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Favorites</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <History className="h-6 w-6" />
            <span className="text-xs mt-1">History</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
} 