import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [mood, setMood] = useState(''); // Mood selected by the user
  const [percentNew, setPercentNew] = useState(0.5); // Discovery slider

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
    setRecommendations([]);
    window.localStorage.removeItem('token');
  };

  const fetchRecommendations = () => {
    if (!userData || !token) {
      alert('Please log in and fetch your playlists first!');
      return;
    }
  
    // Prepare top track IDs
    const topTracks = userData.items.slice(0, 5).map(track => track.id);
  
    axios
      .post('http://localhost:5000/recommend', {
        topTracks,
        mood, // e.g., "happy"
        percentNew, // Discovery percentage
        weather: weatherData?.weather[0]?.description || 'unknown',
      })
      .then(response => {
        console.log('Recommendations:', response.data);
        // Display the recommendations to the user
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        alert('Failed to fetch recommendations. Please try again.');
      });
  };
  

  const fetchWeather = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

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

      <div>
        <h2>Contextual Inputs</h2>
        <label>
          Mood:
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">Select Mood</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="energetic">Energetic</option>
          </select>
        </label>
        <label>
          Discovery (% New Songs):
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={percentNew}
            onChange={(e) => setPercentNew(Number(e.target.value))}
          />
        </label>
        <button onClick={fetchWeather}>Get Weather</button>
        <button onClick={fetchRecommendations}>Get AI Recommendations</button>
      </div>

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

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>Recommended Tracks</h2>
          <ul>
            {recommendations.map((track, index) => (
              <li key={index}>
                {track.name} by {track.artist}
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
