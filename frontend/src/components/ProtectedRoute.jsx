import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

// Protects any route that requires authentication
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

// Protects admin-only routes
export const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-dark-900">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shadow-glow">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
      <p className="text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);
