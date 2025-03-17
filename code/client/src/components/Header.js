// Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';
import Logout from './Logout';
import Button from './Button';

function Header({
  token,
  handleLogin,
  handleLogout,
  fetchUserData,
  // Removed fetchWeather and fetchRecommendations from here, if not needed
}) {
  const location = useLocation();

  return (
    <header className="menu-bar">
      <img 
        src="/SoundScape_Word_Logo_Transparent.png"
        style={{ width: "200px", height: "auto", marginRight: "2rem" }} 
        alt="SoundScape Logo" 
      />
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/playlist" className="nav-link">
          Playlist
        </Link>
      </nav>
      {/* Display extra action buttons only on the Home page */}
      {location.pathname === '/' && (
        <div className="action-buttons" style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          {!token ? (
            <button className="header-button" onClick={handleLogin}>
              Login to Spotify
            </button>
          ) : (
            <Logout onClick={handleLogout} />
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
