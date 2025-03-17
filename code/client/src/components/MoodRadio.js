// MoodRadio.js
import React from 'react';
import styled from 'styled-components';

// Example array of moods
const moods = [
  { id: 'mood-happy', label: 'Happy', value: 'happy' },
  { id: 'mood-sad', label: 'Sad', value: 'sad' },
  { id: 'mood-energetic', label: 'Energetic', value: 'energetic' },
  { id: 'mood-relaxed', label: 'Relaxed', value: 'relaxed' },
];

function MoodRadio({ mood, setMood }) {
  return (
    <StyledWrapper>
      <div className="radio-input">
        {moods.map(({ id, label, value }) => (
          <label className="label" key={id}>
            <input
              type="radio"
              id={id}
              name="mood-radio"
              value={value}
              checked={mood === value}
              onChange={() => setMood(value)}
            />
            <p className="text">{label}</p>
          </label>
        ))}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Use a horizontal layout */
  .radio-input {
    display: flex;
    flex-direction: row;
    gap: 1rem; /* space between mood options */
    justify-content: center; /* center them horizontally */
    align-items: center;
  }

  .label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.3rem 1rem;
    cursor: pointer;
    height: auto;
    position: relative;
    border-radius: 10px;
    transition: background-color 0.2s ease, border 0.2s ease;
    font-family: 'Poppins', sans-serif; /* match your app’s font */
  }

  /* Hover effect for each label */
  .label:hover {
    background-color: #2a2e3c;
  }

  /* Selected (checked) style */
  .label:has(input:checked) {
    background-color: #2d3750;
    border: 2px solid #435dd8;
  }

  .text {
    color: #fff;
    font-size: 0.95rem;
    margin: 0;
  }

  /* Hide the default radio appearance */
  .label input[type="radio"] {
    background-color: #202030;
    appearance: none;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  /* Show a dot when checked */
  .label input[type="radio"]:checked {
    background-color: #435dd8;
    animation: pulse 0.7s forwards;
  }

  .label input[type="radio"]::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    transition: all 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
    background-color: #fff;
    transform: scale(0);
  }

  .label input[type="radio"]:checked::before {
    transform: scale(1);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }
`;

export default MoodRadio;
