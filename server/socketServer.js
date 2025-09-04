const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const roomRoutes = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 5000;
const JWT_SECRET = 'supersecretkey';

app.use(cors());
app.use(bodyParser.json());
app.use('/api/rooms', roomRoutes);

// In-memory user store (for demo)
const users = [];

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users.push({ email, password });
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Socket.IO logic for room sync
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomCode }) => {
    socket.join(roomCode);
  });

  socket.on('videoAction', ({ roomCode, action, time }) => {
    // Broadcast to all clients in the room except sender
    socket.to(roomCode).emit('videoAction', { action, time });
  });

  socket.on('chatMessage', ({ roomCode, message }) => {
    io.to(roomCode).emit('chatMessage', { message });
  });

  socket.on('reaction', ({ roomCode, emoji }) => {
    io.to(roomCode).emit('reaction', { emoji });
  });
});

server.listen(PORT, () => {
  console.log(`CineSync server running with Socket.IO on http://localhost:${PORT}`);
});
