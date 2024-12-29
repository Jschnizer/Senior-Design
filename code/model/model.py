import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Example Data (replace with real Spotify + context data)
data = [
    {"danceability": 0.8, "energy": 0.7, "tempo": 120, "mood": 1, "time_of_day": 2, "liked": 1},
    {"danceability": 0.6, "energy": 0.5, "tempo": 90, "mood": 0, "time_of_day": 1, "liked": 0},
    {"danceability": 0.9, "energy": 0.8, "tempo": 130, "mood": 1, "time_of_day": 3, "liked": 1},
]

df = pd.DataFrame(data)

# Features and labels
X = df.drop(columns=["liked"])
y = df["liked"]

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')  # Binary output: liked or not liked
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train_scaled, y_train, epochs=10, validation_data=(X_test_scaled, y_test))

# Evaluate
loss, acc = model.evaluate(X_test_scaled, y_test)
print("Accuracy:", acc)

model.save("recommendation_model.keras")