// Playlist.js
import React from 'react';
import SwipeableCard from '../components/SwipeableCard';
import Loader from '../components/Loader'; // Import your Loader component
import '../App.css';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTrack({ track, index, isDiscarded, isInPlaylist, onReshuffle }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: track.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="track-item">
      <img 
        src={track.albumCover || 'https://via.placeholder.com/150'} 
        alt={track.name} 
        className="album-cover" 
      />
      <div className="track-info">
        <span>{track.name}</span>
        <span className="artist">{track.artist}</span>
      </div>
      {(isDiscarded || isInPlaylist) && (
        <button className="reshuffle" onClick={() => onReshuffle(track)}>↩</button>
      )}
      {/* Drag Handle */}
      <div className="drag-handle" {...attributes} {...listeners}>
        &#9776;
      </div>
    </div>
  );
}

function Playlist({ recommendations, setRecommendations, playlist, setPlaylist, loading }) {
  const [discarded, setDiscarded] = React.useState([]);

  const handleAddToPlaylist = (track) => {
    setPlaylist((prev) => [...prev, track]);
    setRecommendations((prev) => prev.filter((t) => t.id !== track.id));
  };

  const handleDiscard = (track) => {
    setDiscarded((prev) => [...prev, track]);
    setRecommendations((prev) => prev.filter((t) => t.id !== track.id));
  };

  const handleReshuffle = (track) => {
    setRecommendations((prev) => [track, ...prev]);
    setPlaylist((prev) => prev.filter((t) => t.id !== track.id));
    setDiscarded((prev) => prev.filter((t) => t.id !== track.id));
  };

  const handleDragEnd = (event, list, setList) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.findIndex((item) => item.id === active.id);
    const newIndex = list.findIndex((item) => item.id === over.id);
    setList((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // If recommendations are still loading, show the Loader
  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="content">
      <div className="playlist-container">
        {/* Left Side: Discarded Songs */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, discarded, setDiscarded)}
        >
          <SortableContext items={discarded.map((track) => track.id)}>
            <div className="discard-list">
              <h3>Discarded Songs</h3>
              {discarded.length > 0 ? (
                discarded.map((track, index) => (
                  <SortableTrack key={track.id} track={track} index={index} isDiscarded={true} onReshuffle={handleReshuffle} />
                ))
              ) : (
                <p>No discarded songs yet.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* Center: Swipe Card */}
        <div className="swipe-container">
          <h2>Swipe Songs</h2>
          {recommendations.length > 0 ? (
            <div className="swipe-card-wrapper">
              <SwipeableCard track={recommendations[0]} />
              <div className="button-group">
                <button className="red" onClick={() => handleDiscard(recommendations[0])}>−</button>
                <button className="green" onClick={() => handleAddToPlaylist(recommendations[0])}>+</button>
              </div>
            </div>
          ) : (
            <p>No more songs to swipe.</p>
          )}
        </div>

        {/* Right Side: Playlist */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, playlist, setPlaylist)}
        >
          <SortableContext items={playlist.map((track) => track.id)}>
            <div className="playlist-list">
              <h3>Playlist</h3>
              {playlist.length > 0 ? (
                playlist.map((track, index) => (
                  <SortableTrack key={track.id} track={track} index={index} isInPlaylist={true} onReshuffle={handleReshuffle} />
                ))
              ) : (
                <p>Your playlist is empty.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default Playlist;
