import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import GameLobby from './components/game/GameLobby';
import GameBoard from './components/game/GameBoard';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/lobby" element={<GameLobby />} />
        <Route path="/game" element={<ProtectedRoute component={GameBoard} />} />
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default App;
