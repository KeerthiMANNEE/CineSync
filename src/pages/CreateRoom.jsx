import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../utils/api';
import AuthContext from '../context/AuthContext';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [movieFile, setMovieFile] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let host = 'Host';
    try {
      if (user && user.token) {
        // Try to decode JWT and get email
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        host = payload.email || 'Host';
      }
    } catch {
      host = 'Host';
    }
    if (!roomName) {
      setMessage('Please enter a room name.');
      return;
    }
    const roomCode = await createRoom(roomName, host);
    if (roomCode) {
      setMessage(`Room created! Share this code with friends: ${roomCode}`);
      setTimeout(() => navigate(`/room/${roomCode}`, { state: { roomCode, roomName } }), 1200);
    } else {
      setMessage('Room creation failed. Please check your backend and try again.');
    }
  };

  return (
    <div className="create-room-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
    }}>
      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: '700',
        marginBottom: '2rem',
        color: '#fff',
        letterSpacing: '1px',
      }}>Create a Room</h2>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.09)',
        borderRadius: '24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        padding: '2.5rem 3rem',
        minWidth: '350px',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
          style={{
            width: '90%',
            padding: '1rem',
            borderRadius: '12px',
            fontSize: '1.2rem',
            border: 'none',
            background: '#232526',
            color: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            outline: 'none',
          }}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setMovieFile(e.target.files[0])}
          style={{
            width: '90%',
            padding: '0.7rem',
            borderRadius: '12px',
            fontSize: '1.1rem',
            background: '#232526',
            color: '#fff',
            border: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            outline: 'none',
          }}
        />
        <button type="submit" style={{
          width: '95%',
          padding: '1.2rem',
          borderRadius: '32px',
          background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: '700',
          border: 'none',
          boxShadow: '0 4px 16px rgba(221,36,118,0.12)',
          cursor: 'pointer',
          marginTop: '1rem',
          transition: 'background 0.2s',
        }}>Create Room</button>
      </form>
      {message && <p className="success" style={{
        marginTop: '2rem',
        fontSize: '1.2rem',
        color: '#ffe082',
        fontWeight: '600',
        textAlign: 'center',
      }}>{message}</p>}
    </div>
  );
};

export default CreateRoom;
