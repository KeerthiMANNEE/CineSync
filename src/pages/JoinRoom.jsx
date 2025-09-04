import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../utils/api';

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const room = await joinRoom(roomCode);
    if (room) {
      setMessage(`Joined room: ${room.roomName}. Enjoy the movie!`);
      setTimeout(() => navigate(`/room/${roomCode}`, { state: { roomCode, roomName: room.roomName } }), 1200);
    } else {
      setMessage('Room not found.');
    }
  };

  return (
    <div className="join-room-container">
      <h2>Join a Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room Code or Link"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          required
        />
        <button type="submit">Join Room</button>
      </form>
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default JoinRoom;
