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
  const [loading, setLoading] = useState(false); // NEW: loading state

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

  // Fetch user data when token is set
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

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
        console.log("User Data:", response.data); // For debugging
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

  const fetchRecommendations = (mood, percentNew, weather, genres, tempo, minDuration, maxDuration, useWeather) => {
    if (!token) {
      alert('Please log in first!');
      return;
    }
  
    setLoading(true); // Start loading

    // Get weather description.
    const currentWeather = weatherData?.weather[0]?.description || '';
  
    // Prepare listening history from userData (if available)
    const history = userData && userData.items
      ? userData.items.map(track => `${track.name} by ${track.artists[0].name}`)
      : [];
  
    console.log('History:', history);
  
    const payload = {
      mood,
      percentNew,
      weather: useWeather ? currentWeather : '',
      genres,
      tempo,
      minDuration,
      maxDuration,
      useWeather,
      history,
      access_token: token, // for Spotify search to fetch album covers
    };
  
    axios
      .post('http://localhost:5000/recommend', payload)
      .then((response) => {
        setRecommendations(response.data.recommendations);
        setLoading(false); // Stop loading when recommendations arrive
      })
      .catch((error) => {
        console.error('Error fetching recommendations:', error);
        alert('Failed to fetch recommendations.');
        setLoading(false); // Stop loading on error
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
                loading={loading}
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
