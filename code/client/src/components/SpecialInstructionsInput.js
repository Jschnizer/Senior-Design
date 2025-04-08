// SpecialInstructionsInput.js
import React from 'react';
import styled from 'styled-components';

const SpecialInstructionsInput = ({ value, onChange }) => {
  return (
    <StyledWrapper>
      <input
        placeholder="Enter special instructions here..."
        className="input"
        name="text"
        type="text"
        value={value}
        onChange={onChange}
      />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input {
    background-color: #212121;
    height: 40px;
    padding: 10px;
    border: 2px solid white;
    border-radius: 5px;
    justify-content: center;
    width: 100%;
    max-width: 800px;
    color: white;
    font-family: 'Poppins', sans-serif;
  }

  .input:focus {
    color: white;
    background-color: #212121;
    outline-color: #683FEA;
    box-shadow: -3px -3px 30px #683FEA;
    transition: 0.1s;
    transition-property: box-shadow;
    border: 2px solid #683FEA;
    font-family: 'Poppins', sans-serif;
  }
`;

export default SpecialInstructionsInput;
