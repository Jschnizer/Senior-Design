import React, { useEffect, useState } from 'react';
import SwipeableCard from './SwipeableCard'; // Import the swipeable card component
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [mood, setMood] = useState('');
  const [percentNew, setPercentNew] = useState(0.5);
  const [maxTracks, setMaxTracks] = useState(10); // Number of tracks to display

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
      .then((response) => {
        setUserData(response.data);

        // Extract a configurable number of tracks and set them as recommendations
        const tracksToDisplay = response.data.items
          .slice(0, maxTracks)
          .map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map((artist) => artist.name).join(', '),
            albumCover: track.album.images[0]?.url || 'https://via.placeholder.com/150',
          }));

        setRecommendations(tracksToDisplay);
      })
      .catch((error) => {
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
    setPlaylist([]);
    window.localStorage.removeItem('token');
  };

  const fetchRecommendations = () => {
    if (!userData || !token) {
      alert('Please log in and fetch your playlists first!');
      return;
    }

    const topTracks = userData.items.slice(0, maxTracks).map((track) => track.id);

    axios
      .post('http://localhost:5000/recommend', {
        topTracks,
        mood,
        percentNew,
        weather: weatherData?.weather[0]?.description || 'unknown',
      })
      .then((response) => {
        // TODO: Update recommendations based on response
        //setRecommendations(response.data.recommendations);
        console.log('Recommendations:', response.data.recommendations);
      })
      .catch((error) => {
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
          .then((response) => {
            setWeatherData(response.data);
          })
          .catch((error) => {
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

  const handleSwipe = (direction, track) => {
    if (direction === 'right') {
      // Add track to playlist
      setPlaylist((prev) => [...prev, track]);
    }
    // Remove the swiped track from recommendations
    setRecommendations((prev) => prev.filter((rec) => rec.id !== track.id));
  };

  return (
    <div className="App">
      <h1>SoundScape</h1>
      {!token ? (
        <button onClick={handleLogin}>Login to Spotify</button>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={fetchUserData}>Get My Tracks</button>
        </div>
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
            <option value="relaxed">Relaxed</option>
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
        <label>
          Max Tracks to Display:
          <input
            type="number"
            min="1"
            max="50"
            value={maxTracks}
            onChange={(e) => setMaxTracks(Number(e.target.value))}
          />
        </label>
        <button onClick={fetchWeather}>Get Weather</button>
        <button onClick={fetchRecommendations}>Get AI Recommendations</button>
      </div>

      {weatherData && (
        <div className="weather-data">
          <h2>Current Weather</h2>
          <p>Location: {weatherData.name}</p>
          <p>Temperature: {weatherData.main.temp} °F</p>
          <p>Weather: {weatherData.weather[0]?.description}</p>
        </div>
      )}

      <div className="swipe-container">
        {recommendations.length > 0 ? (
          recommendations.map((track) => (
            <SwipeableCard key={track.id} track={track} onSwipe={handleSwipe} />
          ))
        ) : (
          <p>No recommendations available. Fetch your tracks to get started!</p>
        )}
      </div>

      {playlist.length > 0 && (
        <div className="playlist">
          <h2>My Playlist</h2>
          <ul>
            {playlist.map((track, index) => (
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
