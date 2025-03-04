# recommend.py
import torch
import torch.nn as nn
import torch.nn.functional as F
import json

##########################################
# Model & Utility Functions
##########################################

class RecommendationNet(nn.Module):
    """
    A simple feed-forward network that fuses user, song, and context embeddings
    to compute a compatibility score.
    """
    def __init__(self, user_dim, song_dim, context_dim, hidden_dim=64):
        super(RecommendationNet, self).__init__()
        input_dim = user_dim + song_dim + context_dim
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, 1)

    def forward(self, user_embedding, song_embedding, context_vector):
        # Concatenate embeddings along the last dimension.
        x = torch.cat((user_embedding, song_embedding, context_vector), dim=-1)
        x = F.relu(self.fc1(x))
        score = self.fc2(x)
        return score

def novelty_function(song_embedding, user_embedding):
    """
    Computes a novelty score based on cosine dissimilarity.
    Higher values indicate more dissimilarity (more novel).
    """
    cosine_sim = F.cosine_similarity(song_embedding, user_embedding, dim=-1)
    novelty_score = 1 - cosine_sim  # Higher novelty means less similar.
    return novelty_score

def rank_songs(model, user_embedding, song_embeddings, context_vector, novelty_weight=0.5):
    """
    Ranks songs based on a computed score that includes a novelty adjustment.
    """
    scores = {}
    # Add batch dimension.
    user_tensor = user_embedding.unsqueeze(0)      # (1, user_dim)
    context_tensor = context_vector.unsqueeze(0)     # (1, context_dim)

    for song_id, song_embedding in song_embeddings.items():
        song_tensor = song_embedding.unsqueeze(0)   # (1, song_dim)
        base_score = model(user_tensor, song_tensor, context_tensor)
        base_score = base_score.item()
        novelty_adjust = novelty_weight * novelty_function(song_tensor, user_tensor).item()
        scores[song_id] = base_score + novelty_adjust

    # Return song IDs sorted by descending score.
    ranked_songs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [song_id for song_id, score in ranked_songs]

##########################################
# Main: Generate Recommendations
##########################################

if __name__ == "__main__":
    # Define embedding dimensions (replace with your actual dimensions)
    user_dim = 16
    song_dim = 32
    context_dim = 8

    # Instantiate the model. (In production, load your trained model weights.)
    model = RecommendationNet(user_dim, song_dim, context_dim)
    # For example: model.load_state_dict(torch.load('model_weights.pt'))

    # Dummy embeddings (replace with real data in production)
    current_user_embedding = torch.randn(user_dim)
    current_context_vector = torch.randn(context_dim)
    song_embeddings = {
        "song1": torch.randn(song_dim),
        "song2": torch.randn(song_dim),
        "song3": torch.randn(song_dim),
        "song4": torch.randn(song_dim),
        "song5": torch.randn(song_dim)
    }

    # Get ranked song IDs based on current user and context.
    ranked_song_ids = rank_songs(model, current_user_embedding, song_embeddings, current_context_vector, novelty_weight=0.5)

    # Map song IDs to human-readable song titles.
    dummy_track_name_mapping = {
        "song1": "Song Title 1",
        "song2": "Song Title 2",
        "song3": "Song Title 3",
        "song4": "Song Title 4",
        "song5": "Song Title 5"
    }
    ranked_track_names = [dummy_track_name_mapping[song_id] for song_id in ranked_song_ids]

    # Output recommendations as JSON.
    output = {
        "recommendations": ranked_track_names
    }
    print(json.dumps(output))
