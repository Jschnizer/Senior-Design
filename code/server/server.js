const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Spotify login route
app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email user-top-read';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scopes,
        redirect_uri: process.env.REDIRECT_URI,
        state: generateRandomString(16),
      })
  );
});

// Generate random string for Spotify's state parameter
function generateRandomString(length) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Spotify callback route
app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  axios
    .post(authOptions.url, authOptions.data, { headers: authOptions.headers })
    .then((response) => {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;

      // Redirect to front-end with tokens
      res.redirect(
        'http://localhost:3000/?' +
          new URLSearchParams({
            access_token,
            refresh_token,
          })
      );
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error retrieving access token');
    });
});

// Route to fetch user's top tracks from Spotify
app.get('/me', (req, res) => {
  const access_token = req.query.access_token;

  axios
    .get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error fetching user data');
    });
});

// Fetch AI recommendations from Python Flask server
app.post('/recommend', async (req, res) => {
  try {
    const { topTracks, mood, percentNew, weather } = req.body;

    // Map mood string to numeric value
    const moodMapping = {
      happy: 1,
      sad: 2,
      energetic: 3,
      relaxed: 4,
    };
    const moodNumeric = moodMapping[mood] || 0; // Default to 0 if mood is invalid

    // Send data to Python server
    const response = await axios.post('http://localhost:5001/recommend', {
      topTracks,
      mood: moodNumeric,
      percentNew,
      weather,
    });
    console.log("Response from Python server:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching recommendations' });
  }
});

// Route to fetch weather data
app.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Build the OpenWeatherMap URL
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;

    const weatherResponse = await axios.get(openWeatherUrl);
    res.json(weatherResponse.data); // Return weather data to the client
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
