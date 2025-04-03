import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  // Shared state
  const [playlist, setPlaylist] = useState([]);
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieve token and refresh token from URL or localStorage on mount
  useEffect(() => {
    const hash = window.location.search;
    let savedToken = window.localStorage.getItem('token');
    let savedRefreshToken = window.localStorage.getItem('refresh_token');

    if (!savedToken && hash) {
      const urlParams = new URLSearchParams(hash.substring(1));
      savedToken = urlParams.get('access_token');
      const newRefreshToken = urlParams.get('refresh_token');
      window.location.search = '';
      window.localStorage.setItem('token', savedToken);
      if (newRefreshToken) {
        window.localStorage.setItem('refresh_token', newRefreshToken);
        savedRefreshToken = newRefreshToken;
      }
    }
    setToken(savedToken);
    // fetchWeather();
  }, []);

  // Axios interceptor for refreshing token on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response && error.response.status === 401) {
          const refreshToken = window.localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const { data } = await axios.post('http://localhost:5000/refresh', { refresh_token: refreshToken });
              // Save new access token and update state
              window.localStorage.setItem('token', data.access_token);
              setToken(data.access_token);
              // Update the original request's header and retry it
              error.config.headers.Authorization = `Bearer ${data.access_token}`;
              return axios(error.config);
            } catch (refreshError) {
              // If refreshing fails, clear tokens and redirect to login
              window.localStorage.removeItem('token');
              window.localStorage.removeItem('refresh_token');
              setToken('');
              window.location = '/login';
            }
          } else {
            window.location = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [token]);

  // Fetch user data when token is set
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleLogin = () => {
    window.location = 'http://localhost:5000/login';
  };

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    setRecommendations([]);
    setPlaylist([]);
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refresh_token');
  };

  const fetchUserData = () => {
    if (!token) {
      alert('Please log in first!');
      return;
    }
    axios
      .get('http://localhost:5000/me', { params: { access_token: token } })
      .then((response) => {
        console.log("User Data:", response.data);
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
            console.log('Weather Data:', response.data);
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

  const fetchRecommendations = (mood, percentNew, genres, tempo, minDuration, maxDuration, useWeather, selectedArtists) => {
    if (!token) {
      alert('Please log in first!');
      return;
    }
    setLoading(true);
    const selectedArtistNames = selectedArtists.map(artist => artist.name);
    const currentWeather = weatherData?.weather[0]?.description || '';
    const history = userData && userData.items
      ? userData.items.map(track => `${track.name} by ${track.artists[0].name}`)
      : [];
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
      access_token: token,
      selectedArtistNames,
    };
    console.log('Recommendation payload:', payload);
    axios.post('http://localhost:5000/recommend', payload)
      .then(response => {
        setRecommendations(response.data.recommendations);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        alert('Failed to fetch recommendations.');
        setLoading(false);
      });
  };  

  // If no token exists, show the login page
  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<LoginPage handleLogin={handleLogin} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header
          token={token}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          fetchUserData={fetchUserData}
          fetchWeather={fetchWeather}
          fetchRecommendations={fetchRecommendations}
        />
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
                fetchWeather={fetchWeather}
              />
            }
          />
          <Route
            path="/playlist"
            element={
              <Playlist
                token={token}
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
