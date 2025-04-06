import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import GenerateButton from '../components/GenerateButton';
import WeatherSwitch from '../components/WeatherSwitch';
import TopArtistsSelector from '../components/TopArtistsSelector';
import GenreSelector from '../components/GenereSelector';
import MoodRadio from '../components/MoodRadio';
import WeatherCard from '../components/WeatherCard';

// Constants for API URLs
const RAILWAY_URL = 'https://senior-design-production.up.railway.app';
const LOCAL_BACKEND = 'http://localhost:5000';

function Home({ token, playlist, setPlaylist, recommendations, fetchRecommendations, weatherData, fetchWeather }) {
  const navigate = useNavigate();

  // Local state for contextual inputs
  const [mood, setMood] = useState('');
  const [percentNew, setPercentNew] = useState(0.5);
  const [genres, setGenres] = useState([]);
  const [tempo, setTempo] = useState(100);
  const [useWeather, setUseWeather] = useState(false);
  const [minDuration, setMinDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(30);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [userName, setUserName] = useState('');

  // State for checkboxes to enable/disable inputs
  const [enabledInputs, setEnabledInputs] = useState({
    mood: true,
    discovery: true,
    genres: true,
    tempo: true,
    duration: true,
    artists: true,
  });

  // Fetch the user's name when the token is available
  useEffect(() => {
    if (token) {
      axios.get(`${RAILWAY_URL}/user`, { params: { access_token: token } })
        .then((response) => {
          setUserName(response.data.display_name);
        })
        .catch((error) => {
          console.error('Error fetching user name:', error);
        });
    }
  }, [token]);

  // When the weather toggle is enabled, automatically fetch weather data.
  useEffect(() => {
    if (useWeather && !weatherData) {
      fetchWeather();
    }
  }, [useWeather]);

  const handleCheckboxChange = (inputName) => {
    setEnabledInputs((prev) => ({
      ...prev,
      [inputName]: !prev[inputName],
    }));
  };

  const handleGeneratePlaylist = () => {
    fetchRecommendations(
      enabledInputs.mood ? mood : null,
      enabledInputs.discovery ? percentNew : null,
      enabledInputs.genres ? genres : null,
      enabledInputs.tempo ? tempo : null,
      enabledInputs.duration ? minDuration : null,
      enabledInputs.duration ? maxDuration : null,
      useWeather,
      enabledInputs.artists ? selectedArtists : null,
      true // clear previous recommendations
    );
    navigate('/playlist');
  };

  return (
    <div className="content">
      <h1 className="main-title">Welcome to SoundScape, {userName}</h1>
      {/* <img src="/wave.png" alt="Wave" /> */}
      <h2 className="form-section-title">Tune Your Playlist</h2>

      {/* Toggle Checkboxes Section */}
      <div className="input-row">
        {Object.keys(enabledInputs).map((key) => (
          <label key={key} className="checkbox-label">
            <input
              type="checkbox"
              checked={enabledInputs[key]}
              onChange={() => handleCheckboxChange(key)}
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>

      <div className="inputs-grid">

        {/* Mood Selector */}
        <div className={`mood-row ${!enabledInputs.mood ? 'disabled' : ''}`}>
          <p>Moods</p>
          <MoodRadio selectedMoods={mood} setSelectedMoods={setMood} disabled={!enabledInputs.mood} />
        </div>
        
        <div className="input-row">
        {/* Discovery */}
        <label className={`slider-label ${!enabledInputs.discovery ? 'disabled' : ''}`}>
          Discovery (% New Songs)
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={percentNew}
            onChange={(e) => setPercentNew(Number(e.target.value))}
            disabled={!enabledInputs.discovery}
          />
          <span className="range-value">{Math.round(percentNew * 100)}%</span>
        </label>

        {/* Tempo */}
        <label className={`slider-label ${!enabledInputs.tempo ? 'disabled' : ''}`}>
          Average Tempo (BPM)
          <input
            type="range"
            min="1"
            max="200"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            disabled={!enabledInputs.tempo}
          />
          <span className="range-value">{tempo} BPM</span>
        </label>
        </div>

        {/* Minimum and Maximum Duration */}
        <div className="input-row">
        <label className={!enabledInputs.duration ? 'disabled' : ''}>
          Min Duration (Minutes)
          <input
            type="number"
            min="1"
            max="10"
            value={minDuration}
            onChange={(e) => setMinDuration(Number(e.target.value))}
            disabled={!enabledInputs.duration}
          />
        </label>

        <label className={!enabledInputs.duration ? 'disabled' : ''}>
          Max Duration (Minutes)
          <input
            type="number"
            min="10"
            max="30"
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            disabled={!enabledInputs.duration}
          />
        </label>
        </div>

        {/* Use Weather Switch */}
        <div className="mood-row">
        <div>
          <p style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Use Weather Conditions
          </p>
          <WeatherSwitch
            checked={useWeather}
            onChange={(e) => setUseWeather(e.target.checked)}
          />
        </div>

        {/* Weather Card */}
        {useWeather && weatherData && (
          <div className="weather-card-row" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
            <WeatherCard
              weatherData={weatherData}
              iconUrl={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            />
          </div>
        )}
        </div>

        {/* Genre Selector */}
        <div className={`genres-row ${!enabledInputs.genres ? 'disabled' : ''}`}>
          <p>Genres</p>
          <GenreSelector selectedGenres={genres} setSelectedGenres={setGenres} disabled={!enabledInputs.genres} />
        </div>

        {/* Top Artists Selector */}
        <div className={`top-artists-row ${!enabledInputs.artists ? 'disabled' : ''}`}>
          <h3>Select From Your Top Artists</h3>
          <TopArtistsSelector token={token} selectedArtists={selectedArtists} setSelectedArtists={setSelectedArtists} disabled={!enabledInputs.artists} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <GenerateButton onClick={handleGeneratePlaylist} text={"Genertate Playlist"} />
      </div>
    </div>
  );
}

export default Home;
