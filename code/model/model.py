import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import joblib

# Expanded example data
data = [
    {"danceability": 0.8, "energy": 0.7, "tempo": 120, "mood": 1, "time_of_day": 2, "percent_new": 0.7, "liked": 1},
    {"danceability": 0.6, "energy": 0.5, "tempo": 90, "mood": 0, "time_of_day": 1, "percent_new": 0.3, "liked": 0},
    {"danceability": 0.9, "energy": 0.8, "tempo": 130, "mood": 1, "time_of_day": 3, "percent_new": 0.9, "liked": 1},
    {"danceability": 0.4, "energy": 0.2, "tempo": 80, "mood": 0, "time_of_day": 0, "percent_new": 0.2, "liked": 0},
    {"danceability": 0.7, "energy": 0.6, "tempo": 110, "mood": 1, "time_of_day": 1, "percent_new": 0.8, "liked": 1},
]

df = pd.DataFrame(data)

# Features and labels
X = df.drop(columns=["liked"])
y = df["liked"]

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save the scaler for inference
joblib.dump(scaler, 'scaler.pkl')

# Build the model
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dropout(0.2),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model with early stopping
early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
model.fit(X_train_scaled, y_train, epochs=50, validation_data=(X_test_scaled, y_test), callbacks=[early_stopping])

# Evaluate
loss, acc = model.evaluate(X_test_scaled, y_test)
print("Accuracy:", acc)

# Save the model
model.save("recommendation_model.keras")
