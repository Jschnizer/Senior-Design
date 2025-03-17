// Header.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import Logout from './Logout';
import Button from './Button';

function Header({
  token,
  handleLogin,
  handleLogout,
  fetchUserData,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = () => navigate('/');
  const goPlaylist = () => navigate('/playlist');

  return (
    <header
      className="menu-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
      }}
    >
      <img
        src="/SoundScape_Word_Logo_Transparent.png"
        style={{ width: '200px', height: 'auto' }}
        alt="SoundScape Logo"
      />

      {/* Container for Home & Playlist buttons with spacing */}
      <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
        <Button text="Home" onClick={goHome} />
        <Button text="Playlist" onClick={goPlaylist} />
      </div>

      {/* Display login/logout on the Home page, aligned to the right */}
      {location.pathname === '/' && (
        <div
          className="action-buttons"
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: '1rem',
          }}
        >
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
