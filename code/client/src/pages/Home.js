import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home({ token, playlist, setPlaylist, recommendations, fetchRecommendations, weatherData }) {
  const navigate = useNavigate();

  // Local state for contextual inputs
  const [mood, setMood] = useState('');
  const [percentNew, setPercentNew] = useState(0.5);
  const [maxTracks, setMaxTracks] = useState(10);
  const [genres, setGenres] = useState([]);
  const [tempo, setTempo] = useState(50);
  const [useWeather, setUseWeather] = useState(false);
  const [minDuration, setMinDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(30);
  const [selectedArtists, setSelectedArtists] = useState([]);

  const handleGeneratePlaylist = (mood, percentNew, genres, tempo, minDuration, maxDuration, useWeather) => {
    // Since the recommendation endpoint is not working yet fetch the user's top songs instead.
    fetchRecommendations(mood, percentNew, genres, tempo, minDuration, maxDuration, useWeather);
    navigate('/playlist');
  };

  return (
    <div className="content">
      <h2>Contextual Inputs</h2>
      <div className="inputs-grid">
        {/* Mood */}
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
        {/* Discovery */}
        <label>
          Discovery (% New Songs):
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={percentNew}
            onChange={(e) => setPercentNew(Number(e.target.value))}
          />
        </label>
        {/* Max Tracks */}
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
        {/* Genres */}
        <label>
          Genres:
          <select
            multiple
            value={genres}
            onChange={(e) =>
              setGenres(Array.from(e.target.selectedOptions, (option) => option.value))
            }
          >
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
            <option value="hiphop">Hip Hop</option>
          </select>
        </label>
        {/* Tempo */}
        <label>
          Tempo (BPM):
          <input
            type="range"
            min="1"
            max="100"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
          />
        </label>
        {/* Use Weather */}
        <label>
          <input
            type="checkbox"
            checked={useWeather}
            onChange={(e) => setUseWeather(e.target.checked)}
          />
          Use Weather Conditions
        </label>
        {/* Minimum Duration */}
        <label>
          Minimum Song Duration (Minutes):
          <input
            type="number"
            min="1"
            max="10"
            value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value))}
          />
        </label>
        {/* Maximum Duration */}
        <label>
          Maximum Song Duration (Minutes):
          <input
            type="number"
            min="10"
            max="30"
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
          />
        </label>
        {/* Filter by Artist */}
        <label>
          Filter by Artist:
          <select
            multiple
            value={selectedArtists}
            onChange={(e) =>
              setSelectedArtists(Array.from(e.target.selectedOptions, (option) => option.value))
            }
          >
            <option value="artist1">Artist 1</option>
            <option value="artist2">Artist 2</option>
            <option value="artist3">Artist 3</option>
          </select>
        </label>
      </div>

      {weatherData && (
        <div className="weather-data">
          <h2>Current Weather</h2>
          <p>Location: {weatherData.name}</p>
          <p>Temperature: {weatherData.main.temp} °F</p>
          <p>Weather: {weatherData.weather[0]?.description}</p>
        </div>
      )}

      {/* Generate Playlist button at the bottom */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => handleGeneratePlaylist(mood, percentNew, genres, tempo, minDuration, maxDuration, useWeather)}>
          Generate Playlist
        </button>
      </div>
    </div>
  );
}

export default Home;
