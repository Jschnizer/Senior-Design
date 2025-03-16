// Playlist.js
import React, { useState } from 'react';
import SwipeableCard from '../components/SwipeableCard';
import Loader from '../components/Loader';
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
import axios from 'axios';
import styled from 'styled-components';

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
      <div className="drag-handle" {...attributes} {...listeners}>
        &#9776;
      </div>
    </div>
  );
}

// Styled Components for Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: #333;
  font-family: 'Arial', sans-serif;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  margin: 0.5rem 0 1rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
`;

const ModalButtons = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ModalButton = styled.button`
  background-color: ${props => props.variant === 'cancel' ? '#f0f0f0' : '#2c8fff'};
  color: ${props => props.variant === 'cancel' ? '#333' : '#fff'};
  border: none;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Arial', sans-serif;

  &:hover {
    background-color: ${props => props.variant === 'cancel' ? '#e0e0e0' : '#1a6bb8'};
  }
`;

const ExportButton = styled.button`
  background-color: #00cc7a;
  color: #fff;
  border: none;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border-radius: 4px;
  margin-top: 2rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Arial', sans-serif;

  &:hover {
    background-color: #009f5c;
  }
`;

const SuccessMessage = styled.p`
  color: #333;
  font-size: 1rem;
  margin: 1rem 0;
  font-family: 'Arial', sans-serif;
`;

const ErrorMessageText = styled.p`
  color: #333;
  font-size: 1rem;
  margin: 1rem 0;
  font-family: 'Arial', sans-serif;
`;

function Playlist({ token, recommendations, setRecommendations, playlist, setPlaylist, loading }) {
  const [discarded, setDiscarded] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  
  // States for success and error modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Function to export current playlist to Spotify
  const exportToSpotify = async (name) => {
    if (!token) {
      alert("Please log in first.");
      return;
    }
    if (playlist.length === 0) {
      alert("Your playlist is empty.");
      return;
    }
    const trackIds = playlist.map((track) => track.id);
    try {
      const response = await axios.post('http://localhost:5000/export', {
        access_token: token,
        trackIds,
        playlistName: name || "My SoundScape Playlist"
      });
      
      setSuccessMessage(`Playlist "${name || "My SoundScape Playlist"}" exported successfully! Check your Spotify account.`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error exporting playlist:", error);
      setErrorMessage("Error exporting playlist. Please try again later.");
      setShowErrorModal(true);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
                  <SortableTrack
                    key={track.id}
                    track={track}
                    index={index}
                    isDiscarded={true}
                    onReshuffle={handleReshuffle}
                  />
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
                  <SortableTrack
                    key={track.id}
                    track={track}
                    index={index}
                    isInPlaylist={true}
                    onReshuffle={handleReshuffle}
                  />
                ))
              ) : (
                <p>Your playlist is empty.</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      
      {/* Export Button - Positioned below the Playlist section */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <ExportButton onClick={() => setShowModal(true)}>
          Export to Spotify
        </ExportButton>
      </div>

      {/* Modal for Naming Playlist */}
      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Enter playlist name</ModalTitle>
            <ModalInput
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="My Awesome Playlist"
            />
            <ModalButtons>
              <ModalButton
                variant="cancel"
                onClick={() => {
                  setShowModal(false);
                  setPlaylistName("");
                }}
              >
                Cancel
              </ModalButton>
              <ModalButton
                onClick={() => {
                  exportToSpotify(playlistName);
                  setShowModal(false);
                  setPlaylistName("");
                }}
              >
                Create Playlist
              </ModalButton>
            </ModalButtons>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Playlist Exported</ModalTitle>
            <SuccessMessage>{successMessage}</SuccessMessage>
            <ModalButton onClick={() => setShowSuccessModal(false)}>
              Close
            </ModalButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Error Exporting Playlist</ModalTitle>
            <ErrorMessageText>{errorMessage}</ErrorMessageText>
            <ModalButton onClick={() => setShowErrorModal(false)}>
              Close
            </ModalButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </div>
  );
}

export default Playlist;
