// LoginPage.js
import React from 'react';
import styled from 'styled-components';

const LoginPage = ({ handleLogin }) => {
  return (
    <Container>
      <Title>Welcome to SoundScape</Title>
      <Subtitle>Connect your Spotify account to get started</Subtitle>
      <LoginButton onClick={handleLogin}>Log in with Spotify</LoginButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: #fff;
  text-align: center;
  padding: 0 20px;
  font-family: 'Poppins', sans-serif; /* match your app’s font */
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const LoginButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #1db954, #00ffcc);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 255, 204, 0.6);
  text-transform: uppercase;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 0px 15px rgba(0, 255, 204, 0.9);
  }
`;

export default LoginPage;
