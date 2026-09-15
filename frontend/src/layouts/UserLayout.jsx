import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';

export const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-orange-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} PujaConnect. All rights reserved.
      </footer>
    </div>
  );
};
