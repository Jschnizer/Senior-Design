import express from 'express';
import cors from 'cors';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fetch album cover for a recommendation using Spotify API and validate it
async function validateAndFetchAlbumCover(rec, accessToken) {
  try {
    const query = `track:${rec.name} artist:${rec.artist}`;
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: query, type: 'track', limit: 1 },
    });
    const items = response.data.tracks.items;
    if (items && items.length > 0) {
      // Optionally update the recommendation with the valid Spotify track ID.
      rec.id = items[0].id;
      // Update the album cover if available; otherwise, use a placeholder.
      rec.albumCover =
        items[0].album && items[0].album.images && items[0].album.images.length > 0
          ? items[0].album.images[0].url
          : 'https://via.placeholder.com/150';
      return rec;
    }
    // If no track was found, return null to filter it out.
    return null;
  } catch (error) {
    console.error(`Error validating and fetching album cover for ${rec.name}:`, error);
    return null;
  }
}


// Spotify login route
app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email user-top-read playlist-modify-public';
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

// Route to refresh the access token using a refresh token
app.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ error: 'Missing refresh token' });
  }
  try {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    res.status(500).json({ error: "Error refreshing token" });
  }
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
      console.log('Access token:', access_token);

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

app.post('/recommend', async (req, res) => {
  try {
    const {
      mood,             // e.g., "happy", "sad", etc.
      percentNew,       // e.g., 0.6 (0 = familiar, 1 = experimental)
      weather,          // e.g., "light rain"
      genres,           // e.g., ["pop", "indie"]
      tempo,            // desired BPM (e.g., 100)
      minDuration,      // in minutes (e.g., 3)
      maxDuration,      // in minutes (e.g., 5)
      useWeather,       // boolean: whether to use weather info
      history,          // array of strings, e.g. ["Song A by Artist1", "Song B by Artist2", ...]
      access_token      // Spotify access token for retrieving album covers
    } = req.body;

    // Determine a time-of-day description.
    const currentHour = new Date().getHours();
    const timeOfDay =
      currentHour < 12 ? "morning" :
      currentHour < 18 ? "afternoon" :
      currentHour < 21 ? "evening" : "night";

    // Build history text (if provided)
    let historyText = '';
    if (history && Array.isArray(history) && history.length > 0) {
      historyText = `User's listening history includes: ${history.join('; ')}.`;
    }

    // Construct the prompt for ChatGPT.
    const prompt = `
You are a music recommendation assistant. Based on the contextual information and the user's listening history provided below, please generate a ranked list of 25 Spotify track recommendations that blend familiar tracks with new discoveries. The blend should be controlled by the "percentNew" value, where 0.0 means all recommendations should be similar to the user's current tastes, and 1.0 means all recommendations should be new and experimental. Only return songs that you are sure exist on Spotify and include their valid Spotify track IDs if available.

${historyText}

Context:
- Mood: ${mood}
- New Music Preference (0.0 = familiar, 1.0 = experimental): ${percentNew}
- Weather: ${useWeather ? weather : "N/A"}
- Time of Day: ${timeOfDay}
- Preferred Tempo: around ${tempo} BPM
- Duration Range: ${minDuration} to ${maxDuration} minutes
- Preferred Genres: ${genres && genres.length ? genres.join(", ") : "any"}

For each recommended track, please provide:
- Spotify track ID (if available; if not, leave as null)
- Track name
- Artist name
- Album cover URL (leave as null for now)
- A score between 0 and 1 indicating how well the track fits these preferences

Return the output in valid JSON format with no markdown formatting as an array of objects with the keys "id", "name", "artist", "albumCover", and "score".
    `;

    // Call ChatGPT.
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful music recommendation assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    let reply = chatResponse.choices[0].message.content.trim();

    // Remove code fences if present.
    if (reply.startsWith("```")) {
      reply = reply.split('\n').slice(1, -1).join('\n').trim();
    }
    
    let recommendations = JSON.parse(reply);

    // Validate each recommendation and fetch album cover
    if (access_token) {
      recommendations = await Promise.all(
        recommendations.map(async (rec) => await validateAndFetchAlbumCover(rec, access_token))
      );
      // Filter out any recommendations that could not be validated.
      recommendations = recommendations.filter(rec => rec !== null);
    } else {
      // Use placeholder if no token provided.
      recommendations = recommendations.map(rec => ({
        ...rec,
        albumCover: rec.albumCover || 'https://via.placeholder.com/150'
      }));
    }

    res.json({ recommendations });
  } catch (error) {
    console.error("Error in /recommend endpoint:", error);
    res.status(500).json({ error: "Error generating recommendations" });
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

// Endpoint to export playlist to Spotify
app.post('/export', async (req, res) => {
  const { access_token, trackIds, playlistName } = req.body;

  if (!access_token || !trackIds || !trackIds.length) {
    return res.status(400).json({ error: "Missing access token or track IDs" });
  }

  try {
    // Step 1: Get the user's Spotify ID
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userId = userResponse.data.id;

    // Step 2: Create a new playlist for the user
    const createResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName || "My SoundScape Playlist",
        public: true,
        description: "Playlist exported from SoundScape",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const playlistId = createResponse.data.id;

    // Step 3: Convert track IDs to Spotify track URIs
    const uris = trackIds.map(id => `spotify:track:${id}`);

    // Spotify allows adding up to 100 tracks per request.
    const chunkSize = 100;
    for (let i = 0; i < uris.length; i += chunkSize) {
      const chunk = uris.slice(i, i + chunkSize);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: chunk },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    res.json({
      playlistId,
      playlistUrl: createResponse.data.external_urls.spotify,
    });
  } catch (error) {
    console.error("Error exporting playlist:", error.response?.data || error.message);
    res.status(500).json({ error: "Error exporting playlist" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
