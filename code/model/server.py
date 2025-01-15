from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained Keras model
model = tf.keras.models.load_model('recommendation_model.keras')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json

        # Extract input data
        top_tracks = data['topTracks']  # List of track IDs
        mood = data['mood']  # Numeric mood (e.g., happy = 1, sad = 2)
        percent_new = data['percentNew']  # Discovery percentage
        weather = data['weather']  # Weather condition
        time_of_day = data.get('timeOfDay', 2)  # Example: Default to 2 if not provided

        # Example: Average features for top tracks (replace with real Spotify features)
        avg_danceability = np.mean([0.8, 0.7, 0.9])  # Mock data
        avg_energy = np.mean([0.6, 0.7, 0.8])  # Mock data
        avg_tempo = np.mean([120, 130, 140])  # Mock data

        # Prepare input for the AI model (include time_of_day)
        input_data = np.array([[avg_danceability, avg_energy, avg_tempo, mood, time_of_day, percent_new]])

        # Make predictions
        prediction = model.predict(input_data)[0][0]
        liked = int(prediction > 0.5)
        confidence = float(prediction)

        # Mock recommendations (replace with actual recommendation logic)
        recommendations = [
            {"id": "1", "name": "Song A", "artist": "Artist A", "albumCover": "https://via.placeholder.com/150"},
            {"id": "2", "name": "Song B", "artist": "Artist B", "albumCover": "https://via.placeholder.com/150"},
            {"id": "3", "name": "Song C", "artist": "Artist C", "albumCover": "https://via.placeholder.com/150"},
            {"id": "4", "name": "Song D", "artist": "Artist D", "albumCover": "https://via.placeholder.com/150"},
            {"id": "5", "name": "Song E", "artist": "Artist E", "albumCover": "https://via.placeholder.com/150"},
        ]

        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5001)
