import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { UserLayout } from '../layouts/UserLayout';

// Auth Guards
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Home } from '../pages/user/Home';
import { PanditProfile } from '../pages/user/PanditProfile';
import { UserBookings } from '../pages/user/UserBookings';
import { PanditDashboard } from '../pages/pandit/PanditDashboard';
import { AdminDashboard } from '../pages/admin/AdminDashboard';

// Placeholders for Pages (to be implemented in Step 10+)
const NotFound = () => <div className="p-8 text-center text-2xl font-bold">404 - Not Found</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes wrapped in UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pandits/:id" element={<PanditProfile />} />
        
        {/* User-only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/bookings" element={<UserBookings />} />
        </Route>
      </Route>

      {/* Pandit Routes */}
      <Route element={<ProtectedRoute allowedRoles={['pandit']} />}>
        <Route element={<UserLayout />}>
          <Route path="/pandit/dashboard" element={<PanditDashboard />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<UserLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

