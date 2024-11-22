import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const hash = window.location.search;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      const urlParams = new URLSearchParams(hash.substring(1));
      token = urlParams.get('access_token');
      window.location.search = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const fetchUserData = () => {
    if (!token) {
      alert('Please log in first!');
      return;
    }

    axios
      .get('http://localhost:5000/me', { params: { access_token: token } })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data. Please log in again.');
      });
  };

  const handleLogin = () => {
    window.location = 'http://localhost:5000/login';
  };

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    window.localStorage.removeItem('token');
  };

  return (
    <div className="App">
      <h1>SoundScape</h1>
      {!token ? (
        <button onClick={handleLogin}>Login to Spotify</button>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={fetchUserData}>Get My Playlists</button>
        </>
      )}
      {userData && (
        <div className="user-data">
          <h2>Your Top Tracks</h2>
          <ul>
            {userData.items.map((track, index) => (
              <li key={index}>
                <strong>{track.name}</strong> by{' '}
                {track.artists.map(artist => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <footer>© 2024 SoundScape. All rights reserved.</footer>
    </div>
  );
}

export default App;
