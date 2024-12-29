const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

const app = express();
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Helper function to generate random string for the state parameter
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Spotify login route
app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: process.env.REDIRECT_URI,
      state: generateRandomString(16)
    }));
});

// Spotify callback route
app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    }),
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers })
    .then(response => {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;

      // Pass the tokens to your front-end
      res.redirect('http://localhost:3000/?' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error retrieving access token');
    });
});

// Route to fetch user's top tracks
app.get('/me', (req, res) => {
  const access_token = req.query.access_token;

  axios.get('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching user data');
    });
});

// Token refresh route
app.get('/refresh_token', (req, res) => {
  const refresh_token = req.query.refresh_token;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers })
    .then(response => {
      res.json({ access_token: response.data.access_token });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error refreshing token');
    });
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
  console.log(`Server listening on port ${PORT}`);
});
