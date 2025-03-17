// MinusButton.js
import React from 'react';
import styled from 'styled-components';

const MinusButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <div tabIndex={0} className="iconButton" onClick={onClick}>
        <svg className="iconIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
          <g>
            {/* Path for a minus sign */}
            <path d="M6.25 13.75H23.75V16.25H6.25V13.75Z" />
          </g>
        </svg>
      </div>
    </StyledWrapper>
  );
};

export default MinusButton;

const StyledWrapper = styled.div`
  .iconButton {
    --sideLength: 2.5rem;
    --topRightTriangleSideLength: 0.9rem;

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid white;
    width: var(--sideLength);
    height: var(--sideLength);
    background-color: #000000;
    overflow: hidden;
  }

  .iconButton::before {
    position: absolute;
    content: "";
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-width: 0 var(--topRightTriangleSideLength) var(--topRightTriangleSideLength) 0;
    border-style: solid;
    border-color: transparent #F3343D transparent transparent;
    transition: 0.2s ease;
  }

  .iconButton:hover {
    cursor: pointer;
  }

  .iconButton:hover::before,
  .iconButton:focus-visible::before {
    --topRightTriangleSideLength: calc(var(--sideLength) * 2);
  }

  .iconIcon {
    fill: white;
    width: calc(var(--sideLength) * 0.7);
    height: calc(var(--sideLength) * 0.7);
    z-index: 1;
    transition: 0.2s ease;
  }

  .iconButton:hover .iconIcon,
  .iconButton:focus-visible .iconIcon {
    fill: black;
    transform: rotate(180deg);
  }
`;
