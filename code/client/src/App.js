// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import './App.css';

function App() {
  // Shared state
  const [playlist, setPlaylist] = useState([]);
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Retrieve token from URL or localStorage on mount
  useEffect(() => {
    const hash = window.location.search;
    let savedToken = window.localStorage.getItem('token');

    if (!savedToken && hash) {
      const urlParams = new URLSearchParams(hash.substring(1));
      savedToken = urlParams.get('access_token');
      window.location.search = '';
      window.localStorage.setItem('token', savedToken);
    }
    setToken(savedToken);
  }, []);

  // --- Functions for Header and Global Actions ---

  const handleLogin = () => {
    window.location = 'http://localhost:5000/login';
  };

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    setRecommendations([]);
    setPlaylist([]);
    window.localStorage.removeItem('token');
  };

  const fetchUserData = () => {
    if (!token) {
      alert('Please log in first!');
      return;
    }
    axios
      .get('http://localhost:5000/me', { params: { access_token: token } })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data.');
      });
  };

  const fetchWeather = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .get('http://localhost:5000/weather', {
            params: { lat: latitude, lon: longitude },
          })
          .then((response) => {
            setWeatherData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching weather:', error);
            alert('Failed to fetch weather.');
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location.');
      }
    );
  };

  // Updated fetchRecommendations to fetch the user's top songs from /me
  // NOTE: This is a temporary workaround until the recommendation endpoint is implemented
  const fetchRecommendations = () => {
    if (!token) {
      alert('Please log in first!');
      return;
    }
    axios
      .get('http://localhost:5000/me', { params: { access_token: token } })
      .then((response) => {
        // Extract a configurable number of tracks from the user's data
        const tracksToDisplay = response.data.items
          .slice(0, 10) // Currently gives 10 tracks but can be adjusted
          .map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map((artist) => artist.name).join(', '),
            albumCover: track.album.images[0]?.url || 'https://via.placeholder.com/150',
          }));
        setRecommendations(tracksToDisplay);
      })
      .catch((error) => {
        console.error('Error fetching top songs:', error);
        alert('Failed to fetch top songs.');
      });
  };

  return (
    <Router>
      <div className="App">
        {/* Unified Header Component */}
        <Header
          token={token}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          fetchUserData={fetchUserData}
          fetchWeather={fetchWeather}
          fetchRecommendations={fetchRecommendations}
        />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                token={token}
                playlist={playlist}
                setPlaylist={setPlaylist}
                recommendations={recommendations}
                fetchRecommendations={fetchRecommendations}
                weatherData={weatherData}
              />
            }
          />
          <Route
            path="/playlist"
            element={
              <Playlist
                recommendations={recommendations}
                setRecommendations={setRecommendations}
                playlist={playlist}
                setPlaylist={setPlaylist}
              />
            }
          />
        </Routes>

        <footer>© 2024 SoundScape. All rights reserved.</footer>
      </div>
    </Router>
  );
}

export default App;
