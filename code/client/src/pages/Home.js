// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import GenerateButton from '../components/GenerateButton';
import WeatherSwitch from '../components/WeatherSwitch';
import TopArtistsSelector from '../components/TopArtistsSelector';
import GenreSelector from '../components/GenereSelector';
import MoodRadio from '../components/MoodRadio';

function Home({ token, playlist, setPlaylist, recommendations, fetchRecommendations, weatherData, fetchWeather }) {
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

  // When the weather toggle is enabled, automatically fetch weather data.
  useEffect(() => {
    if (useWeather) {
      fetchWeather();
    }
  }, [useWeather, fetchWeather]);

  const handleGeneratePlaylist = () => {
    fetchRecommendations(mood, percentNew, genres, tempo, minDuration, maxDuration, useWeather, selectedArtists);
    navigate('/playlist');
  };

  return (
    <div className="content">
      <h2 className="form-section-title">Tune Your Playlist</h2>
      <div className="inputs-grid">
        {/* Mood */}
        <div className="mood-row">
          <p>Mood</p>
          <MoodRadio mood={mood} setMood={setMood} />
        </div>

        {/* Discovery */}
        <label>
          Discovery (% New Songs)
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={percentNew}
            onChange={(e) => setPercentNew(Number(e.target.value))}
          />
          <span className="range-value">{Math.round(percentNew * 100)}%</span>
        </label>

        {/* Tempo */}
        <label>
          Tempo (BPM)
          <input
            type="range"
            min="1"
            max="100"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
          />
          <span className="range-value">{tempo} BPM</span>
        </label>

        {/* Max Tracks */}
        <label>
          Max Tracks to Display
          <input
            type="number"
            min="1"
            max="50"
            value={maxTracks}
            onChange={(e) => setMaxTracks(Number(e.target.value))}
          />
        </label>

        {/* Use Weather Switch */}
        <div>
          <p style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Use Weather Conditions
          </p>
          <WeatherSwitch
            checked={useWeather}
            onChange={(e) => setUseWeather(e.target.checked)}
          />
        </div>

        {/* Minimum Duration */}
        <label>
          Min Duration (Minutes)
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
          Max Duration (Minutes)
          <input
            type="number"
            min="10"
            max="30"
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
          />
        </label>

        {/* Genres */}
        <div className="genres-row">
          <p style={{ marginBottom: '0.5rem' }}>Genres</p>
          <GenreSelector
            selectedGenres={genres}
            setSelectedGenres={setGenres}
          />
        </div>

        {/* Let user select top artists via chips */}
        <div className="top-artists-row">
          <h3>Select Your Top Artists</h3>
          <TopArtistsSelector
            token={token}
            selectedArtists={selectedArtists}
            setSelectedArtists={setSelectedArtists}
          />
        </div>
      </div>

      {weatherData && (
        <div className="weather-data">
          <h2>Current Weather</h2>
          <p>Location: {weatherData.name}</p>
          <p>Temperature: {weatherData.main.temp} °F</p>
          <p>Weather: {weatherData.weather[0]?.description}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <GenerateButton onClick={handleGeneratePlaylist} />
      </div>
    </div>
  );
}

export default Home;
