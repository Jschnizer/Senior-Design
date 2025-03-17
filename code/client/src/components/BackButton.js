// BackButton.js
import React from 'react';
import styled from 'styled-components';

const BackButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <div className="styled-wrapper">
        <button className="button" onClick={onClick}>
          <div className="button-box">
            <span className="button-elem">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                <path fill="black" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </span>
            <span className="button-elem">
              <svg fill="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </span>
          </div>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .styled-wrapper .button {
    display: block;
    position: relative;
    width: 50px;    /* Smaller width */
    height: 50px;   /* Smaller height */
    margin: 0;
    overflow: hidden;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    border: 0;
  }

  .styled-wrapper .button:before {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 5px;       /* Slightly smaller inset */
    border: 2px solid black; 
    transition:
      opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
  }

  .styled-wrapper .button:after {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 5px;
    border: 3px solid #683FEA;
    transform: scale(1.2);
    transition:
      opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0;
  }

  .styled-wrapper .button:hover:before,
  .styled-wrapper .button:focus:before {
    opacity: 0;
    transform: scale(0.7);
    transition:
      opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .styled-wrapper .button:hover:after,
  .styled-wrapper .button:focus:after {
    opacity: 1;
    transform: scale(1);
    transition:
      opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
  }

  .styled-wrapper .button-box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
  }

  .styled-wrapper .button-elem {
    display: block;
    width: 20px;  /* arrow icon width */
    height: 20px; /* arrow icon height */
    margin: 15px 5px 0 15px; 
    /* ^ Adjust the 5px/10px as needed to shift arrow horizontally */
    transform: rotate(360deg);
    fill: #f0eeef;
  }

  /* On hover, shift the arrows slightly left */
  .styled-wrapper .button:hover .button-box,
  .styled-wrapper .button:focus .button-box {
    transition: 0.4s;
    transform: translateX(-40px); 
    /* ^ Smaller shift than -69px to keep the arrow more centered */
  }
`;

export default BackButton;
