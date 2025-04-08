import React, { useState } from 'react';
import SwipeableCard from '../components/SwipeableCard';
import Loader from '../components/Loader';
import ExportButton from '../components/ExportButton';
import Input from '../components/Input';
import BackButton from '../components/BackButton';
import Confirm from '../components/Confirm';
import Button from '../components/Button';
import PlusButton from '../components/PlusButton';
import MinusButton from '../components/MinusButton';
import GenerateButton from '../components/GenerateButton';
import '../App.css';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import axios from 'axios';
import styled from 'styled-components';

// Constants for API URLs
const RAILWAY_URL = 'https://senior-design-production.up.railway.app';
const LOCAL_BACKEND = 'http://localhost:5000';

function SortableTrack({ track, index, isDiscarded, isInPlaylist, onReshuffle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: track.id
  });

  const style = {
    transform: CSS.Transform.toString({
      ...transform,
      x: 0, // This forces horizontal position to stay at 0
    }),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 'auto',
    touchAction: 'none', // Prevent touch scrolling during drag
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="track-item"
    >
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
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
      >
        &#9776;
      </div>
    </div>
  );
}

// Drop Zone Components
const DiscardDropZone = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'discard-dropzone',
  });

  return (
    <div
      ref={setNodeRef}
      className="discard-list"
    >
      {children}
    </div>
  );
};

const PlaylistDropZone = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'playlist-dropzone',
  });

  return (
    <div ref={setNodeRef} className="playlist-list">
      {children}
    </div>
  );
};

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

function Playlist({ token, recommendations, setRecommendations, playlist, setPlaylist, discarded, setDiscarded, loading, fetchRecommendations, lastRequestParams }) {
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);

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

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const track = recommendations.find(t => t.id === active.id);
    setActiveTrack(track);

    // Highlight drop zones
    document.querySelectorAll('.discard-list, .playlist-list').forEach(el => {
      el.classList.add('dnd-active');
    });
  };

  const handleDragEndGlobal = (event) => {
    const { over, active } = event;

    // Remove highlight from drop zones
    document.querySelectorAll('.discard-list, .playlist-list').forEach(el => {
      el.classList.remove('dnd-active', 'dnd-highlight');
    });

    if (!activeTrack) {
      setActiveId(null);
      return;
    }

    // Get the viewport width
    const viewportWidth = window.innerWidth;

    // Get the final position of the dragged item
    const finalPosition = active.rect.current.translated?.left || 0;

    // Calculate the drop zones
    const leftThreshold = viewportWidth * 0.25;
    const rightThreshold = viewportWidth * 0.75;

    // Check where the item was dropped
    if (finalPosition < leftThreshold) {
      // Left 25% - discard
      handleDiscard(activeTrack);
    } else if (finalPosition > rightThreshold) {
      // Right 25% - add to playlist
      handleAddToPlaylist(activeTrack);
    } else if (over && ['discard-dropzone', 'playlist-dropzone'].includes(over.id)) {
      // If dropped on explicit drop zones
      if (over.id === 'playlist-dropzone') {
        handleAddToPlaylist(activeTrack);
      } else if (over.id === 'discard-dropzone') {
        handleDiscard(activeTrack);
      }
    }

    setActiveId(null);
    setActiveTrack(null);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    document.querySelectorAll('.discard-list, .playlist-list').forEach(el => {
      el.classList.remove('dnd-highlight');
    });

    if (over && ['discard-dropzone', 'playlist-dropzone'].includes(over.id)) {
      const dropZone = document.getElementById(over.id);
      if (dropZone) {
        dropZone.classList.add('dnd-highlight');
      }
    }
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
      const response = await axios.post(`${RAILWAY_URL}/export`, {
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduce the distance to make dragging easier
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Modify handleDragEnd to ensure we only move items vertically
  const handleDragEnd = (event, list, setList) => {
    const { active, over } = event;

    handleDragCancel();

    if (!over || active.id === over.id) return;

    // Force reset transform on all items
    document.querySelectorAll('.track-item').forEach(item => {
      item.style.transform = 'translate3d(0px, 0px, 0px)';
    });

    setList((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleDragCancel = () => {
    // Reset transform on all items
    document.querySelectorAll('.track-item').forEach(item => {
      item.style.transform = 'translate3d(0px, 0px, 0px)';
    });
    document.querySelectorAll('.discard-list, .playlist-list').forEach(el => {
      el.classList.remove('dnd-active', 'dnd-highlight');
    });
    setActiveId(null);
    setActiveTrack(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }
  
  // Handler for requesting more recommendations using the same parameters
  const handleGetMoreRecommendations = () => {
    console.log("Requesting more recommendations...");
    let discardedRecommenations = discarded.map((track) => track.id);
    if (fetchRecommendations && lastRequestParams) {
      console.log("Fetching more recommendations with the same parameters...");
      fetchRecommendations(
        lastRequestParams.mood,
        lastRequestParams.percentNew,
        lastRequestParams.genres,
        lastRequestParams.tempo,
        lastRequestParams.minDuration,
        lastRequestParams.maxDuration,
        lastRequestParams.useWeather,
        lastRequestParams.selectedArtists,
        false, // Don't clear previous recommendations
        lastRequestParams.specialInstructions,
        discardedRecommenations
      );
    }
  };

  return (
    <div className="content">
      {/* Main DndContext for swipe card dragging */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEndGlobal}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="playlist-container">
          {/* Left Side: Discarded Songs Drop Zone */}
          <DiscardDropZone>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, discarded, setDiscarded)}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={discarded.map((track) => track.id)}>
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
              </SortableContext>
            </DndContext>
          </DiscardDropZone>

          {/* Center: Swipe Card */}
          <div className="swipe-container">
            <h2>Swipe Songs</h2>
            {recommendations.length > 0 ? (
              <div className="swipe-card-wrapper">
                <SwipeableCard track={recommendations[0]} />
                <div className="button-group">
                  <MinusButton onClick={() => handleDiscard(recommendations[0])} />
                  <PlusButton onClick={() => handleAddToPlaylist(recommendations[0])} />
                </div>
                {/* Instead of absolutely positioning, we let the button be in the flow */}
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <GenerateButton onClick={handleGetMoreRecommendations} text="Get More Recommendations" />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <ExportButton onClick={() => setShowModal(true)} />
                <div style={{ marginTop: '1rem' }}>
                  <GenerateButton onClick={handleGetMoreRecommendations} text="Get More Recommendations" />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Playlist Drop Zone */}
          <PlaylistDropZone>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, playlist, setPlaylist)}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={playlist.map((track) => track.id)}>
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
              </SortableContext>
            </DndContext>
          </PlaylistDropZone>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <div style={{
                transform: 'scale(1.05)',
                opacity: 0.8,
                boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                zIndex: 1000
              }}>
                <SwipeableCard track={activeTrack} />
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>

      {/* Modal for Naming Playlist */}
      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Enter playlist name</ModalTitle>
            <Input
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <ModalButtons>
              <BackButton onClick={() => {
                setShowModal(false);
                setPlaylistName("");
              }
              }></BackButton>
              <Confirm onClick={() => {
                exportToSpotify(playlistName);
                setShowModal(false);
                setPlaylistName("");
              }
              }></Confirm>
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
            <Button
              text="Close"
              onClick={() => setShowSuccessModal(false)}
            ></Button>
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