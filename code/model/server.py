from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import joblib
import json

app = Flask(__name__)
CORS(app)

##########################################
# 1. Define the PyTorch Recommendation Model
##########################################

class RecommendationModel(nn.Module):
    """
    A simple feed-forward network that takes an 8-dimensional input vector
    and outputs a compatibility score.
    """
    def __init__(self, input_dim=8, hidden_dim=64):
        super(RecommendationModel, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, 1)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        score = self.fc2(x)
        return score

# Load the pre-trained model weights (saved as a PyTorch state dict)
model = RecommendationModel(input_dim=8, hidden_dim=64)
model.load_state_dict(torch.load('recommendation_model.pt', map_location=torch.device('cpu')))
model.eval()

# Load the scaler (e.g., a scikit-learn scaler saved with joblib)
scaler = joblib.load('scaler.pkl')

##########################################
# 2. Load Local Cached Data Instead of Calling Spotify
##########################################

# These JSON files should contain a mapping from track IDs to data.
# For example, audio_features.json might look like:
# { "track1": {"danceability": 0.8, "energy": 0.6, "tempo": 120, "valence": 0.7, "duration_ms": 210000}, ... }
with open('audio_features.json', 'r') as f:
    audio_features_cache = json.load(f)

# Similarly, track_details.json might map track IDs to metadata.
with open('track_details.json', 'r') as f:
    track_details_cache = json.load(f)

##########################################
# 3. Helper Functions
##########################################

def map_weather_to_code(weather_str):
    # Basic mapping; adjust as needed
    weather_map = {
        'clear': 0,
        'sunny': 0,
        'cloudy': 1,
        'overcast': 1,
        'rain': 2,
        'light rain': 2,
        'thunderstorm': 3,
    }
    return weather_map.get(weather_str.lower(), 0)

def get_audio_features_local(track_ids):
    """
    Instead of calling Spotify, look up track audio features in our local cache.
    """
    result = {}
    for tid in track_ids:
        if tid in audio_features_cache:
            result[tid] = audio_features_cache[tid]
    return result

def fetch_track_details_local(track_ids):
    """
    Instead of calling Spotify, fetch track metadata from our local cache.
    """
    details_map = {}
    for tid in track_ids:
        if tid in track_details_cache:
            details_map[tid] = track_details_cache[tid]
    return details_map

##########################################
# 4. /recommend Endpoint
##########################################

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json

        # Extract parameters from the POST request
        track_ids = data.get('trackIds', [])
        mood_str = data.get('mood', 'happy')  # e.g., "happy", "sad"
        percent_new = float(data.get('percentNew', 0.5))
        weather_str = data.get('weather', '')
        time_of_day = int(data.get('timeOfDay', 2))
        # Note: accessToken is no longer used because we're not calling Spotify endpoints.
        filter_tempo = float(data.get('filterTempo', 50))  # desired BPM
        min_duration = float(data.get('minDuration', 1))     # in minutes
        max_duration = float(data.get('maxDuration', 30))    # in minutes

        # Convert mood to a numeric code
        mood_map = {'happy': 1, 'sad': 2, 'energetic': 3, 'relaxed': 4}
        mood_numeric = mood_map.get(mood_str.lower(), 0)

        # Map weather string to a code
        weather_code = map_weather_to_code(weather_str)

        # 1) Get audio features from our local cache
        audio_features = get_audio_features_local(track_ids)

        # 2) Filter out tracks that don't match the tempo/duration criteria.
        final_candidates = []
        tempo_threshold = 15  # Allowed deviation in BPM
        for tid in track_ids:
            f = audio_features.get(tid)
            if not f:
                continue
            # Convert duration from ms to minutes.
            duration_mins = f["duration_ms"] / 60000.0
            if abs(f["tempo"] - filter_tempo) <= tempo_threshold and (min_duration <= duration_mins <= max_duration):
                final_candidates.append(tid)

        # 3) For each candidate, build an input vector and compute a score using the model.
        scored_tracks = []
        for tid in final_candidates:
            f = audio_features[tid]
            # Build the input vector with the following order:
            # [danceability, energy, tempo, valence, time_of_day, mood_numeric, weather_code, percent_new]
            input_data = np.array([[f["danceability"], f["energy"], f["tempo"], f["valence"],
                                     time_of_day, mood_numeric, weather_code, percent_new]])
            # Scale the input features
            input_scaled = scaler.transform(input_data)
            # Convert to a torch tensor
            input_tensor = torch.tensor(input_scaled, dtype=torch.float32)
            with torch.no_grad():
                prediction = model(input_tensor).item()
            scored_tracks.append((tid, prediction))

        # 4) Sort the tracks by descending predicted score
        scored_tracks.sort(key=lambda x: x[1], reverse=True)
        top_n = scored_tracks[:10]

        # 5) Fetch track metadata from the local cache
        details = fetch_track_details_local([tid for tid, _ in top_n])

        recommendations = []
        for tid, score in top_n:
            d = details.get(tid, {})
            recommendations.append({
                "id": tid,
                "name": d.get("name", "Unknown"),
                "artist": d.get("artist", "Unknown"),
                "albumCover": d.get("albumCover"),
                "score": score
            })

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
