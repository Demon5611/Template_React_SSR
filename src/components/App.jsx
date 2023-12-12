import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import NavBar from './pages/NavBar';
import LoginPage from './pages/LoginPage';
import SignUpPages from './pages/SignUpPages';
import MainPage from './pages/MainPage';
import ChatPage from './pages/chat/ChatPage';

export default function App({ user, messages }) {
  return (
    <Container
      className="conteiner"
      style={{
        marginLeft: '5%',
        marginRight: '40%',
        marginTop: '5%',
      }}
    >
      <NavBar user={user} />
      <Routes>
        <Route path="/chat" element={<ChatPage messages={messages} />} />
        <Route path="/reg" element={<SignUpPages />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Container>
  );
}
