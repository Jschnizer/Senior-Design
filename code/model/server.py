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

        # Example: Average features for top tracks (replace with real Spotify features)
        avg_danceability = np.mean([0.8, 0.7, 0.9])  # Mock data
        avg_energy = np.mean([0.6, 0.7, 0.8])  # Mock data
        avg_tempo = np.mean([120, 130, 140])  # Mock data

        # Prepare input for the AI model
        input_data = np.array([[avg_danceability, avg_energy, avg_tempo, mood, percent_new]])

        # Make predictions
        prediction = model.predict(input_data)[0][0]
        liked = int(prediction > 0.5)
        confidence = float(prediction)

        # Return recommendations
        recommendations = {
            "liked": liked,
            "confidence": confidence,
            "message": "Tracks tailored to your preferences"
        }

        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
