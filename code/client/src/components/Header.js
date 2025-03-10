import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Header({
  token,
  handleLogin,
  handleLogout,
  fetchUserData,
  fetchWeather,
  fetchRecommendations,
}) {
  const location = useLocation();

  return (
    <header className="menu-bar">
      <img 
        src="/SoundScape_Word_Logo_Transparent.png"
        style={{ 
          width: "300px", 
          height: "auto",
          marginRight: "auto"
        }} 
        alt="SoundScape Logo" 
      />

      <nav>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/playlist" className="nav-link">
          Playlist
        </Link>
      </nav>
      {/* Display extra action buttons only on the Home page */}
      {location.pathname === '/' && (
        <div className="action-buttons">
          {!token ? (
            <button onClick={handleLogin}>Login to Spotify</button>
          ) : (
            <>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
          <button onClick={fetchWeather}>Get Weather</button>
        </div>
      )}
    </header>
  );
}

export default Header;
