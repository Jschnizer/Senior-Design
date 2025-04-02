// WeatherCard.js
import React from 'react';
import styled from 'styled-components';

const WeatherCard = ({ weatherData, iconUrl }) => {
  if (!weatherData) return null;

  // Extract data from weatherData
  const { main, name, weather } = weatherData;
  const temperature = main.temp.toFixed(0); // e.g. "79"
  const tempMax = main.temp_max.toFixed(0);
  const tempMin = main.temp_min.toFixed(0);
  const description = weather[0]?.description || "Unknown";
  // iconUrl could be a dynamic icon we compute (see below)

  return (
    <StyledWrapper>
      <div className="card">
        <svg
          fill="none"
          viewBox="0 0 342 175"
          height="175"
          width="342"
          xmlns="http://www.w3.org/2000/svg"
          className="background"
        >
          <path
            fill="url(#paint0_linear)"
            d="M0 66.4396C0 31.6455 0 14.2484 11.326 5.24044C22.6519 -3.76754 39.6026 0.147978 73.5041 7.97901L307.903 62.1238C324.259 65.9018 332.436 67.7909 337.218 73.8031C342 79.8154 342 88.2086 342 104.995V131C342 151.742 342 162.113 335.556 168.556C329.113 175 318.742 175 298 175H44C23.2582 175 12.8873 175 6.44365 168.556C0 162.113 0 151.742 0 131V66.4396Z"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1="128"
              x2="354.142"
              y2="128"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5936B4" />
              <stop offset="1" stopColor="#362A84" />
            </linearGradient>
          </defs>
        </svg>

        {/* Weather Icon */}
        <div className="cloud">
          {iconUrl ? (
            <img src={iconUrl} alt="weather-icon" className="weather-icon" />
          ) : (
            // fallback if no iconUrl
            <svg
              fill="#000000"
              preserveAspectRatio="xMidYMid meet"
              className="iconify"
              role="img"
              aria-hidden="true"
              viewBox="0 0 64 64"
            >
              {/* Simple fallback cloud icon */}
              <path d="M..." />
            </svg>
          )}
        </div>

        <p className="main-text">{temperature}°</p>

        <div className="info">
          <div className="info-left">
            <p className="text-gray">
              H:{tempMax}° L:{tempMin}°
            </p>
            <p>{name}</p>
          </div>
          <p className="info-right">{description}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 342px;
    height: 175px;
    position: relative;
    padding: 20px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden; /* ensures the shape is clipped */
  }

  .background {
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  .cloud {
    position: absolute;
    right: 0.5rem;
    top: -10px;
  }

  .weather-icon {
    width: 150px;
    height: 150px;
    object-fit: contain;
    margin-right: 30px;
    margin-top: -20px;
  }

  .main-text {
    font-size: 48px;
    font-weight: 600;
    margin: 0;
    line-height: 1;
    margin-right: 250px;
    margin-top: 20px;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .info-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: 7px;
    margin-bottom: 15px;
    font-size: 18px;
  }

  .text-gray {
    color: rgba(235, 235, 245, 0.6);
    font-size: 18px;
    margin-top: 10px;
    margin: 0;
  }

  .info-right {
    font-size: 16px;
    text-transform: capitalize; /* "overcast clouds" -> "Overcast clouds" */
    margin-bottom: 35px;
    margin-right: 45px;
  }
`;

export default WeatherCard;
