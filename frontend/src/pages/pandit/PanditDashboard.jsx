import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BookingRequests } from './BookingRequests';
import { AvailabilityManager } from './AvailabilityManager';
import { ProfileManager } from './ProfileManager';
import { Calendar, Inbox, UserCheck } from 'lucide-react';

export const PanditDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pandit Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="flex flex-col sm:flex-row border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
              activeTab === 'bookings'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
            }`}
          >
            <Inbox className="mr-2" size={18} /> Booking Requests
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
              activeTab === 'availability'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="mr-2" size={18} /> Availability Manager
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
              activeTab === 'profile'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
            }`}
          >
            <UserCheck className="mr-2" size={18} /> Profile & Services
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'bookings' && <BookingRequests />}
        {activeTab === 'availability' && <AvailabilityManager />}
        {activeTab === 'profile' && <ProfileManager />}
      </div>
    </div>
  );
};
