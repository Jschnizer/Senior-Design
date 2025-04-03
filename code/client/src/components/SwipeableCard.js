import React, { useState } from 'react';
import './SwipeableCard.css';

import { useDraggable } from '@dnd-kit/core';

function SwipeableCard({ track }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: track.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="swipe-card"
    >
      <img src={track.albumCover} alt={track.name} />
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
    </div>
  );
}

export default SwipeableCard;
