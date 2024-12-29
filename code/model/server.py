from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Load the Keras model
model = tf.keras.models.load_model('recommendation_model.keras')

# Route to serve recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        # Get input data from the POST request
        data = request.json

        # Extract features
        features = [
            data['danceability'], 
            data['energy'], 
            data['tempo'], 
            data['mood'], 
            data['time_of_day']
        ]

        # Prepare input for the model
        input_data = np.array([features])  # Ensure it's a 2D array

        # Get prediction
        prediction = model.predict(input_data)
        liked = int(prediction[0][0] > 0.5)  # Binary classification threshold (0.5)

        # Return response
        return jsonify({"liked": liked, "confidence": float(prediction[0][0])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5001)
