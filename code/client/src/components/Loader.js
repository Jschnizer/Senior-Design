// Loader.js
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
    return (
      <StyledWrapper>
        <div className="loader" />
        <LoaderText>Loading recommendations...</LoaderText>
      </StyledWrapper>
    );
  };

const StyledWrapper = styled.div`
  position: fixed; /* Full-screen overlay */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;  /* Stack children vertically */
  justify-content: center; /* Center horizontally */
  align-items: center;     /* Center vertically */
  background: rgba(0, 0, 0, 0.6); /* Dark overlay background */

  .loader {
    width: 10em;  /* Increased size */
    height: 10em;
    background: linear-gradient(-45deg, #AE00D5 0%, #6CB1CF 100%);
    animation: spin 3s infinite;
    position: relative;

  }

  .loader::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #AE00D5 30%, #6CB1CF 50%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
    border-radius: 50%;
    z-index: -1;
  }

  @keyframes spin {
    0% {
      transform: rotate(-45deg);
    }
    50% {
      transform: rotate(-360deg);
      border-radius: 50%;
    }
    100% {
      transform: rotate(-45deg);
    }
  }
`;

const LoaderText = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-top: 3rem; /* Add some space below the loader */
  margin-bottom: 0;
`;

export default Loader;
