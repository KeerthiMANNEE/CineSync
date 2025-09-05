import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ErrorBoundary from './components/ErrorBoundary';


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/room/:roomCode" element={<Room />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
