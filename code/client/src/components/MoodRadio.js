// MoodRadio.js
import React from 'react';
import styled from 'styled-components';
import Checkbox from './Checkbox';

const availableMoods = ["Happy", "Sad", "Energetic", "Relaxed", "Angry", "Scared", "Optimistic", "Romantic", "Goofy", "Sentimental", "Lovesick", "Bitter"];

function moodSelector({ selectedMoods, setSelectedMoods }) {
  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      // remove from array
      setSelectedMoods(selectedMoods.filter((g) => g !== mood));
    } else {
      // add to array
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  return (
    <MoodsContainer>
      {availableMoods.map((mood) => {
        const isChecked = selectedMoods.includes(mood);
        return (
          <div key={mood} className="mood-item">
            <Checkbox
              id={`cbx-${mood}`}
              checked={isChecked}
              onChange={() => toggleMood(mood)}
            />
            <label htmlFor={`cbx-${mood}`} className="mood-label">
              {mood}
            </label>
          </div>
        );
      })}
    </MoodsContainer>
  );
}

// Some simple styling
const MoodsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  .mood-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mood-label {
    text-transform: capitalize;
    cursor: pointer;
    font-weight: 500;
    padding-top: 10px;
  }
`;

export default moodSelector;
