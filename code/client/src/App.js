import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get the hash of the url
    const hash = window.location.search;
    let token = window.localStorage.getItem('token');
    let refreshToken = window.localStorage.getItem('refresh_token');

    if (!token && hash) {
      const urlParams = new URLSearchParams(hash.substring(1));
      token = urlParams.get('access_token');
      refreshToken = urlParams.get('refresh_token');

      window.location.search = ''; // Clear the URL query parameters
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('refresh_token', refreshToken);
    }

    setToken(token);
    setRefreshToken(refreshToken);

    if (token) {
      fetchUserData(token);
    }
  }, [token]);

  const fetchUserData = (accessToken) => {
    axios.get('http://localhost:5000/me', { params: { access_token: accessToken } })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data. Please log in again.');
      });
  };

  const refreshAccessToken = () => {
    axios.get('http://localhost:5000/refresh_token', { params: { refresh_token: refreshToken } })
      .then(response => {
        const newToken = response.data.access_token;
        setToken(newToken);
        window.localStorage.setItem('token', newToken);
        fetchUserData(newToken);
      })
      .catch(error => {
        console.error('Error refreshing token:', error);
      });
  };

  const handleLogin = () => {
    window.location = 'http://localhost:5000/login';
  };

  const handleLogout = () => {
    setToken('');
    setRefreshToken('');
    setUserData(null);
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refresh_token');
  };

  return (
    <div className="App">
      <h1>AI-Powered Music App</h1>
      {!token ? (
        <button onClick={handleLogin}>Login to Spotify</button>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
      {userData && (
        <div>
          <h2>Your Top Tracks</h2>
          <ul>
            {userData.items.map((track, index) => (
              <li key={index}>{track.name} by {track.artists.map(artist => artist.name).join(', ')}</li>
            ))}
          </ul>
        </div>
      )}
      {token && <button onClick={refreshAccessToken}>Refresh Token</button>}
    </div>
  );
}

export default App;
