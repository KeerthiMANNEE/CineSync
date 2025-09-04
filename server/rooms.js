const express = require('express');
const router = express.Router();

// In-memory room store (for demo)
const rooms = [];

// Create Room
router.post('/create-room', (req, res) => {
  const { roomName, host } = req.body;
  if (!roomName || !host) {
    return res.status(400).json({ error: 'Room name and host required' });
  }
  const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  rooms.push({ roomName, host, roomCode });
  res.json({ roomCode });
});

// Join Room
router.post('/join-room', (req, res) => {
  const { roomCode } = req.body;
  const room = rooms.find(r => r.roomCode === roomCode);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({ room });
});

module.exports = router;
