// TopArtistsSelector.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

function TopArtistsSelector({ token, selectedArtists, setSelectedArtists }) {
  const [topArtists, setTopArtists] = useState([]);

  // Fetch user's top artists from Spotify when the component mounts or token changes
  useEffect(() => {
    if (!token) return;
    axios
      .get('https://api.spotify.com/v1/me/top/artists', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 20 }, // adjust limit as needed
      })
      .then((res) => {
        setTopArtists(res.data.items || []);
      })
      .catch((err) => {
        console.error('Error fetching top artists:', err);
      });
  }, [token]);

  // Toggle selection when user clicks on an artist chip
  const handleClick = (artistId) => {
    if (selectedArtists.includes(artistId)) {
      // Remove if already selected
      setSelectedArtists((prev) => prev.filter((id) => id !== artistId));
    } else {
      // Add if not selected
      setSelectedArtists((prev) => [...prev, artistId]);
    }
  };

  return (
    <ChipsContainer>
      {topArtists.map((artist) => {
        const isSelected = selectedArtists.includes(artist.id);
        return (
          <ArtistChip
            key={artist.id}
            selected={isSelected}
            onClick={() => handleClick(artist.id)}
          >
            {artist.name}
          </ArtistChip>
        );
      })}
    </ChipsContainer>
  );
}

// Styled Components
const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ArtistChip = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background-color: ${({ selected }) => (selected ? '#683FEA' : '#333')};
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#845ef7' : '#4f4f4f')};
  }
`;

export default TopArtistsSelector;
