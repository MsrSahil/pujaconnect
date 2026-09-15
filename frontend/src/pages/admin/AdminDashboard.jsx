import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PanditApprovals } from './PanditApprovals';
import { PujaCatalog } from './PujaCatalog';
import { PlatformBookings } from './PlatformBookings';
import { UsersList } from './UsersList';
import { ShieldCheck, BookOpen, Activity, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('approvals');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
        <p className="text-gray-600 mt-1">Logged in as system administrator ({user?.email})</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex flex-col sm:flex-row border-b border-gray-200">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex-1 py-4 px-4 text-center font-medium transition flex items-center justify-center text-sm sm:text-base ${
              activeTab === 'approvals'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
            }`}
          >
            <ShieldCheck className="mr-1.5" size={18} /> Pandit Approvals
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-4 px-4 text-center font-medium transition flex items-center justify-center text-sm sm:text-base ${
              activeTab === 'catalog'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="mr-1.5" size={18} /> Puja Catalog
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-4 px-4 text-center font-medium transition flex items-center justify-center text-sm sm:text-base ${
              activeTab === 'bookings'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
            }`}
          >
            <Activity className="mr-1.5" size={18} /> Platform Bookings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 px-4 text-center font-medium transition flex items-center justify-center text-sm sm:text-base ${
              activeTab === 'users'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
            }`}
          >
            <Users className="mr-1.5" size={18} /> Users List
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'approvals' && <PanditApprovals />}
        {activeTab === 'catalog' && <PujaCatalog />}
        {activeTab === 'bookings' && <PlatformBookings />}
        {activeTab === 'users' && <UsersList />}
      </div>
    </div>
  );
};
