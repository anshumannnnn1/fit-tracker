import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Steps from './pages/Steps';
import Calories from './pages/Calories';
import Workout from './pages/Workout';
import Water from './pages/Water';
import Schedule from './pages/Schedule';
import Diet from './pages/Diet';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ✅ Fix: wait for auth check to finish before redirecting
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontSize: 16, color: '#6B7280'
    }}>
      Loading...
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  // ✅ Fix: don't render routes until auth state is known
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontSize: 16, color: '#6B7280'
    }}>
      Loading...
    </div>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Auth />}
      />
      <Route path="/"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/steps"    element={<ProtectedRoute><Steps /></ProtectedRoute>} />
      <Route path="/calories" element={<ProtectedRoute><Calories /></ProtectedRoute>} />
      <Route path="/workout"  element={<ProtectedRoute><Workout /></ProtectedRoute>} />
      <Route path="/water"    element={<ProtectedRoute><Water /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/diet"     element={<ProtectedRoute><Diet /></ProtectedRoute>} />
      <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}