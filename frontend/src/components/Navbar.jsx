import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand with Minimal Circle Emblem from reference */}
        <NavLink to="/" className="nav-brand">
          <div className="brand-circle-badge">
            <span>IQ</span>
          </div>
          <div className="brand-name-group">
            <span className="brand-title">Invest</span>
            <span className="brand-title-serif">IQ</span>
          </div>
        </NavLink>

        {/* Minimal Uppercase Tracked Navigation Links */}
        {isAuthenticated && (
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink to="/watchlist" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Watchlist
              </NavLink>
            </li>
            <li>
              <NavLink to="/portfolio" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Portfolio
              </NavLink>
            </li>
            <li>
              <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Trades
              </NavLink>
            </li>
            <li>
              <NavLink to="/sip" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                SIP Engine
              </NavLink>
            </li>
          </ul>
        )}

        {/* Right Action / Auth Buttons */}
        <div className="nav-user">
          {isAuthenticated ? (
            <>
              <div className="user-pill">
                <span className="user-dot"></span>
                <span className="user-name">{user?.name || 'Investor'}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Exit
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <NavLink to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Join
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
