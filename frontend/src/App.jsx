import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import AdminLoginPage from './pages/auth/AdminLoginPage';
import VolunteerLoginPage from './pages/auth/VolunteerLoginPage';
import SignupPage from './pages/auth/SignupPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminRankings from './pages/admin/AdminRankings';
import AdminRoleDirectories from './pages/admin/AdminRoleDirectories';
import AdminNewAccounts from './pages/admin/AdminNewAccounts';

// Volunteer pages
import VolunteerHome from './pages/volunteer/VolunteerHome';
import VolunteerSettings from './pages/volunteer/VolunteerSettings';

import LoadingSpinner from './components/shared/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

const RootRedirect = () => {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user && role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user && role === 'volunteer') return <Navigate to="/volunteer/home" replace />;
  return <AdminLoginPage />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/volunteer/login" element={<VolunteerLoginPage />} />
          <Route path="/volunteer/signup" element={<SignupPage />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/volunteers" element={<ProtectedRoute requiredRole="admin"><AdminVolunteers /></ProtectedRoute>} />
          <Route path="/admin/rankings" element={<ProtectedRoute requiredRole="admin"><AdminRankings /></ProtectedRoute>} />
          <Route path="/admin/role-directories" element={<ProtectedRoute requiredRole="admin"><AdminRoleDirectories /></ProtectedRoute>} />
          <Route path="/admin/new-accounts" element={<ProtectedRoute requiredRole="admin"><AdminNewAccounts /></ProtectedRoute>} />

          {/* Volunteer */}
          <Route path="/volunteer/home" element={<ProtectedRoute requiredRole="volunteer"><VolunteerHome /></ProtectedRoute>} />
          <Route path="/volunteer/settings" element={<ProtectedRoute requiredRole="volunteer"><VolunteerSettings /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
