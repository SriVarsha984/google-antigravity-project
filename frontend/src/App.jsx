import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Thread from './pages/Thread';
import AdminPanel from './pages/AdminPanel';
import CreateThread from './pages/CreateThread';
import Settings from './pages/Settings';
import Activity from './pages/Activity';
import SearchPage from './pages/SearchPage';
import Inbox from './pages/Inbox';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Routes>
            <Route 
              path="/" 
              element={
                user 
                  ? (user.defaultTab === 'Inbox' ? <Navigate to="/inbox" replace /> : <Home />)
                  : <Navigate to="/login" replace />
              } 
            />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
            <Route path="/topic/:id" element={<Thread />} />
            
            {/* New Module Routes */}
            <Route path="/activity" element={<Activity />} />
            <Route path="/search" element={<SearchPage />} />
            
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateThread />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="text-center py-6 text-gray-600 text-xs border-t border-white/[0.04] mt-8">
          © {new Date().getFullYear()} ForumPanel · Built with MERN Stack
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
