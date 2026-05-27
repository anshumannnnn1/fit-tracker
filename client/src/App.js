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

// ✅ Fixed: actually checks auth before allowing access
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* ✅ Fixed: renders Auth page, redirects to home if already logged in */}
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