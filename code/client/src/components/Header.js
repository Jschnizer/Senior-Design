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
  toggleMenu,
}) {
  const location = useLocation();

  return (
    <header className="menu-bar">
      <h1>SoundScape</h1>
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
              <button onClick={fetchUserData}>Get My Tracks</button>
            </>
          )}
          <button onClick={fetchWeather}>Get Weather</button>
          <button onClick={fetchRecommendations}>Get Top Songs</button>
          <button className="hamburger-icon" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
