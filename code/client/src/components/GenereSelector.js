// GenreSelector.js
import React from 'react';
import styled from 'styled-components';
import Checkbox from './Checkbox';

const availableGenres = ["pop", "rock", "jazz", "classical", "hip-hop", "r&b", "country", "heavy metal", "electronic", "funk", "indie"];

function GenreSelector({ selectedGenres, setSelectedGenres }) {
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      // remove from array
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      // add to array
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <GenresContainer>
      {availableGenres.map((genre) => {
        const isChecked = selectedGenres.includes(genre);
        return (
          <div key={genre} className="genre-item">
            <Checkbox
              id={`cbx-${genre}`}
              checked={isChecked}
              onChange={() => toggleGenre(genre)}
            />
            <label htmlFor={`cbx-${genre}`} className="genre-label">
              {genre}
            </label>
          </div>
        );
      })}
    </GenresContainer>
  );
}

// Some simple styling
const GenresContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  .genre-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .genre-label {
    text-transform: capitalize;
    cursor: pointer;
    font-weight: 500;
    padding-top: 10px;
  }
`;

export default GenreSelector;
