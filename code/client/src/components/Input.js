// Input.js
import React from 'react';
import styled from 'styled-components';

const Input = ({ value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="input-container">
        {/* 
          Use value={value} and onChange={onChange} 
          to make this a controlled input.
        */}
        <input
          type="text"
          id="input"
          required
          value={value}
          onChange={onChange}
        />
        <label htmlFor="input" className="label">
          Playlist Name
        </label>
        <div className="underline" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-container {
    position: relative;
    margin: 50px auto;
    width: 200px;
  }

  .input-container input[type="text"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
  }

  .input-container .label {
    position: absolute;
    top: 0;
    left: 0;
    color: #ccc;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .input-container input[type="text"]:focus ~ .label,
  .input-container input[type="text"]:valid ~ .label {
    top: -20px;
    font-size: 16px;
    color: #333;
  }

  .input-container .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #683FEA;
    transform: scaleX(0);
    transition: all 0.3s ease;
  }

  .input-container input[type="text"]:focus ~ .underline,
  .input-container input[type="text"]:valid ~ .underline {
    transform: scaleX(1);
  }
`;

export default Input;
