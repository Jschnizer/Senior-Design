import React, { useState } from 'react';
import './SwipeableCard.css';

function SwipeableCard({ track, onSwipe }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const handleMouseDown = (e) => {
    setIsSwiping(true);
  };

  const handleMouseMove = (e) => {
    if (isSwiping) {
      const x = e.movementX + position.x;
      const y = e.movementY + position.y;
      setPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsSwiping(false);

    // Check if the card has been swiped far enough
    if (position.x > 150) {
      onSwipe('right', track); // Swiped right
    } else if (position.x < -150) {
      onSwipe('left', track); // Swiped left
    } else {
      setPosition({ x: 0, y: 0 }); // Reset position
    }
  };

  return (
    <div
      className="swipeable-card"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={isSwiping ? handleMouseMove : null}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Handle mouse leaving the card area
    >
      <img src={track.albumCover} alt={track.name} />
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
    </div>
  );
}

export default SwipeableCard;
