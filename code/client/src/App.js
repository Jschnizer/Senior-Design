import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

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

  const fetchRecommendations = () => {
    axios
      .post('http://localhost:5001/recommend', {
        danceability: 0.8,
        energy: 0.7,
        tempo: 120,
        mood: 1, // Happy
        time_of_day: 2 // Afternoon
      })
      .then(response => {
        console.log("Recommendation:", response.data);
        // Display the result to the user
      })
      .catch(error => {
        console.error("Error fetching recommendations:", error);
      });
  };

  // Fetch weather data
  const fetchWeather = () => {
    // Get user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Call /weather endpoint on the server
        axios
          .get('http://localhost:5000/weather', {
            params: { lat, lon },
          })
          .then(response => {
            console.log('Weather data:', response.data);
            setWeatherData(response.data);
          })
          .catch(error => {
            console.error('Error fetching weather:', error);
            alert('Failed to fetch weather. Please try again.');
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to access your location. Please allow location access.');
      }
    );
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

      <button onClick={fetchRecommendations}>Get AI Recommendations</button>
      <button onClick={fetchWeather}>Get Weather for My Location</button>

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

      {weatherData && (
        <div className="weather-data">
          <h2>Current Weather</h2>
          <p>Location: {weatherData.name}</p>
          <p>Temperature: {weatherData.main.temp} °F</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}

      <footer>© 2024 SoundScape. All rights reserved.</footer>
    </div>
  );
}

export default App;
