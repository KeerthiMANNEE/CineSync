const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const roomRoutes = require('./rooms');

// Network configuration
const LOCAL_IP = '192.168.1.10'; // Your WiFi IP
const PORT = 5000;

// Allow all origins for development (you can restrict this later)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  `http://${LOCAL_IP}:3000`,
  'http://192.168.1.10:3000', // Your specific IP
  /^http:\/\/192\.168\.\d+\.\d+:3000$/, // Any 192.168.x.x IP
  /^http:\/\/10\.\d+\.\d+\.\d+:3000$/, // Any 10.x.x.x IP
  /https:\/\/.*\.ngrok-free\.app/,
  /https:\/\/.*\.ngrok\.io/
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches pattern
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(null, true); // Allow all for now, remove this in production
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
    allowEIO3: true
  },
  allowEIO3: true,
  transports: ['websocket', 'polling']
});

const JWT_SECRET = 'supersecretkey';

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches ngrok pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File upload attempt:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Check both MIME type and file extension
    const allowedMimeTypes = [
      'video/mp4', 
      'video/webm', 
      'video/ogg', 
      'video/avi', 
      'video/mov',
      'video/quicktime',
      'video/x-msvideo',
      'application/octet-stream' // Some browsers send this for video files
    ];
    
    const allowedExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.mkv'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
    const isExtensionAllowed = allowedExtensions.includes(fileExtension);
    
    if (isMimeTypeAllowed || isExtensionAllowed) {
      console.log('File accepted:', file.originalname);
      cb(null, true);
    } else {
      console.log('File rejected:', {
        mimetype: file.mimetype,
        extension: fileExtension,
        allowedMimes: allowedMimeTypes,
        allowedExtensions: allowedExtensions
      });
      cb(new Error(`Invalid file type. Received: ${file.mimetype}, Extension: ${fileExtension}. Only video files are allowed.`));
    }
  }
});

// In-memory stores (will be replaced with MongoDB)
const users = [];
const rooms = [];
const roomStates = {}; // For real-time room state (users, messages, playback)

app.use('/api/rooms', roomRoutes);

// Auth endpoints
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users.push({ email, password, createdAt: new Date() });
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, message: 'User created successfully' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, message: 'Login successful' });
});

// Video upload endpoint with better error handling
app.post('/api/upload-video', (req, res) => {
  upload.single('video')(req, res, (err) => {
    if (err) {
      console.error('Video upload error:', err.message);
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File too large. Maximum size is 200MB.' 
          });
        }
        return res.status(400).json({ 
          error: `Upload error: ${err.message}` 
        });
      }
      
      // Custom file filter error
      return res.status(400).json({ 
        error: err.message || 'Invalid file type. Only video files are allowed.' 
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
      }
      
      const videoUrl = `/uploads/${req.file.filename}`;
      console.log(`Video uploaded successfully:`, {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: `${(req.file.size / 1024 / 1024).toFixed(2)}MB`,
        mimetype: req.file.mimetype
      });
      
      res.json({ 
        videoUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        message: 'Video uploaded successfully' 
      });
    } catch (error) {
      console.error('Video upload processing error:', error);
      res.status(500).json({ error: 'Video upload failed' });
    }
  });
});

// Room management endpoints
app.post('/api/rooms', (req, res) => {
  try {
    const { name, host, videoUrl } = req.body;
    if (!name || !host) {
      return res.status(400).json({ error: 'Room name and host required' });
    }
    
    const roomCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    const room = { 
      roomCode,
      roomName: name, 
      host, 
      videoUrl: videoUrl || null,
      createdAt: new Date(),
      isActive: true
    };
    
    rooms.push(room);
    
    // Initialize room state for real-time features
    roomStates[roomCode] = {
      users: [],
      messages: [],
      isPlaying: false,
      currentTime: 0,
      videoUrl: videoUrl || null
    };
    
    console.log(`Room created: ${roomCode} by ${host}`);
    res.json({ roomCode, room });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

app.get('/api/rooms/:roomCode', (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = rooms.find(r => r.roomCode === roomCode);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    // Merge static room data with real-time state
    const roomData = {
      ...room,
      ...roomStates[roomCode]
    };
    
    res.json(roomData);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Failed to get room data' });
  }
});

app.post('/api/rooms/:roomCode/join', (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = rooms.find(r => r.roomCode === roomCode && r.isActive);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found or inactive' });
    }
    
    res.json({ 
      roomName: room.roomName, 
      host: room.host,
      videoUrl: room.videoUrl 
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    rooms: rooms.length,
    activeRooms: Object.keys(roomStates).length,
    serverIP: LOCAL_IP
  });
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomCode, user }) => {
    try {
      const room = rooms.find(r => r.roomCode === roomCode);
      if (!room) {
        socket.emit('error', 'Room not found');
        return;
      }

      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.userName = user;

      // Initialize room state if not exists
      if (!roomStates[roomCode]) {
        roomStates[roomCode] = {
          users: [],
          messages: [],
          isPlaying: false,
          currentTime: 0,
          videoUrl: room.videoUrl
        };
      }

      // Add user to room state
      const userData = { id: socket.id, name: user, joinedAt: new Date() };
      roomStates[roomCode].users = roomStates[roomCode].users.filter(u => u.id !== socket.id);
      roomStates[roomCode].users.push(userData);

      // Send current room state to joining user
      socket.emit('room-state', roomStates[roomCode]);

      // Notify others about new user
      socket.to(roomCode).emit('user-joined', userData);

      console.log(`${user} joined room ${roomCode}. Total users: ${roomStates[roomCode].users.length}`);
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  socket.on('leave-room', (roomCode) => {
    handleUserLeave(socket, roomCode);
  });

  socket.on('send-message', ({ roomCode, message, user }) => {
    try {
      if (!roomStates[roomCode]) return;

      const messageData = {
        id: Date.now(),
        user,
        message,
        timestamp: new Date().toISOString()
      };

      roomStates[roomCode].messages.push(messageData);
      
      // Keep only last 100 messages
      if (roomStates[roomCode].messages.length > 100) {
        roomStates[roomCode].messages = roomStates[roomCode].messages.slice(-100);
      }

      io.to(roomCode).emit('new-message', messageData);
      console.log(`Message in ${roomCode} from ${user}: ${message}`);
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  socket.on('video-play', ({ roomCode, currentTime }) => {
    try {
      if (!roomStates[roomCode]) return;

      roomStates[roomCode].isPlaying = true;
      roomStates[roomCode].currentTime = currentTime;

      socket.to(roomCode).emit('video-play', { currentTime });
      console.log(`Video play in ${roomCode} at ${currentTime}s`);
    } catch (error) {
      console.error('Video play error:', error);
    }
  });

  socket.on('video-pause', ({ roomCode, currentTime }) => {
    try {
      if (!roomStates[roomCode]) return;

      roomStates[roomCode].isPlaying = false;
      roomStates[roomCode].currentTime = currentTime;

      socket.to(roomCode).emit('video-pause', { currentTime });
      console.log(`Video pause in ${roomCode} at ${currentTime}s`);
    } catch (error) {
      console.error('Video pause error:', error);
    }
  });

  socket.on('video-seek', ({ roomCode, currentTime }) => {
    try {
      if (!roomStates[roomCode]) return;

      roomStates[roomCode].currentTime = currentTime;

      socket.to(roomCode).emit('video-seek', { currentTime });
      console.log(`Video seek in ${roomCode} to ${currentTime}s`);
    } catch (error) {
      console.error('Video seek error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.roomCode) {
      handleUserLeave(socket, socket.roomCode);
    }
  });
});

function handleUserLeave(socket, roomCode) {
  try {
    if (roomStates[roomCode]) {
      roomStates[roomCode].users = roomStates[roomCode].users.filter(u => u.id !== socket.id);
      socket.to(roomCode).emit('user-left', socket.id);

      console.log(`${socket.userName || socket.id} left room ${roomCode}. Remaining: ${roomStates[roomCode].users.length}`);

      // Clean up empty rooms after 5 minutes of inactivity
      if (roomStates[roomCode].users.length === 0) {
        setTimeout(() => {
          if (roomStates[roomCode] && roomStates[roomCode].users.length === 0) {
            delete roomStates[roomCode];
            console.log(`Cleaned up empty room: ${roomCode}`);
          }
        }, 300000); // 5 minutes
      }
    }
    socket.leave(roomCode);
  } catch (error) {
    console.error('Handle user leave error:', error);
  }
}

// Listen on all network interfaces
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CineSync server running on:`);
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://${LOCAL_IP}:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🔌 Socket.IO ready for connections`);
  console.log(`📱 Network devices can access at: http://${LOCAL_IP}:3000`);
  console.log(`🌐 For internet access, run: ngrok http ${PORT}`);
});
