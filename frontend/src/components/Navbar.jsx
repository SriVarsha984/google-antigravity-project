import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <MessageSquare className="brand-icon" />
          <span>ForumPanel</span>
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin">Moderation</Link>}
              <div className="user-menu">
                <User className="user-icon" size={20} />
                <span>{user.username}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
