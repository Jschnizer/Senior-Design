import React from 'react';
import SwipeableCard from '../components/SwipeableCard';
import '../App.css';

function Playlist({ recommendations, setRecommendations, playlist, setPlaylist }) {
  const handleSwipe = (direction, track) => {
    if (direction === 'right') {
      setPlaylist((prev) => [...prev, track]);
    }
    // Remove the swiped track from the recommendations list
    setRecommendations((prev) => prev.filter((t) => t.id !== track.id));
  };

  return (
    <div className="content">
      <h2>My Playlist</h2>
      {playlist && playlist.length > 0 ? (
        <div className="playlist">
          <ul>
            {playlist.map((track) => (
              <li key={track.id}>
                <img
                  src={track.albumCover}
                  alt={`${track.name} cover`}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
                <span>
                  {track.name} by {track.artist}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Your playlist is empty.</p>
      )}

      <h2>Swipe Songs</h2>
      <div className="swipe-container">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((track) => (
            <SwipeableCard key={track.id} track={track} onSwipe={handleSwipe} />
          ))
        ) : (
          <p>No more songs to swipe.</p>
        )}
      </div>
    </div>
  );
}

export default Playlist;
