import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import {
  MessageSquare, User, LogOut, Shield, PlusCircle,
  Menu, X, ChevronDown, Home, Bell, Search, MessageCircle, Archive, Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Activity', path: '/activity', icon: Bell },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-dark-800/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shadow-glow">
              <MessageSquare className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight hidden xs:block">ForumPanel</span>
          </Link>

          {/* Desktop Nav - Hidden on Auth Pages */}
          {!['/login', '/register'].includes(location.pathname) && (
            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Auth section */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-dark-500 overflow-hidden border border-white/10">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-400 font-bold text-xs uppercase">
                        {user.username[0]}
                      </div>
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 mr-1 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass-card py-2 animate-slide-down origin-top-right">
                    <div className="px-3 py-3 mb-2 border-b border-white/[0.06]">
                      <p className="text-sm font-black text-white px-3 py-2 rounded-xl bg-gradient-to-r from-primary-600/20 to-accent-purple/20 border border-primary-500/30 shadow-glow truncate">
                         @{user.username}
                      </p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-400/10 transition-colors"
                      >
                        <Shield size={16} /> Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-white/[0.06] my-2 mx-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost py-2 text-sm px-4">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 text-sm px-4 shadow-glow">
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile menu toggle (optional with bottom bar) */}
            <button
              className="btn-icon md:hidden text-gray-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Top Bar - Only shown when menuOpen is true */}
      {menuOpen && (
        <div className="md:hidden sticky top-16 z-40 bg-dark-800/95 backdrop-blur-xl border-b border-white/[0.06] py-2 animate-slide-down">
          <div className="flex flex-col px-4 gap-1">
             <Link to="/create" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-3 text-gray-300 font-medium">
               <PlusCircle size={18} className="text-primary-400" /> Start a New Topic
             </Link>
             {user?.role === 'admin' && (
               <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-3 text-amber-400 font-medium border-t border-white/05">
                 <Shield size={18} /> Admin Dashboard
               </Link>
             )}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR - Hidden on Auth Pages */}
      {!['/login', '/register'].includes(location.pathname) && (
        <>
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-800/90 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-400'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                <item.icon size={22} className={isActive(item.path) ? 'animate-pulse' : ''} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              </Link>
            ))}
          </nav>
          {/* Mobile Spacer to prevent padding issues with bottom bar */}
          <div className="md:hidden h-16"></div>
        </>
      )}
    </>
  );
};

export default Navbar;
