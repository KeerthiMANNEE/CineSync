import { io } from 'socket.io-client';

// Dynamic socket URL detection with enhanced configuration
const getSocketUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const httpProtocol = window.location.protocol;
  
  // If it's localhost or an IP, use the same host with port 5000
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return `${httpProtocol}//${hostname}:5000`;
  }
  
  // If it's an ngrok URL, use the same host
  if (hostname.includes('ngrok')) {
    return `${httpProtocol}//${hostname}`;
  }
  
  // Fallback
  return 'http://localhost:5000';
};

// Enhanced socket configuration for connection stability
const socket = io(getSocketUrl(), {
  autoConnect: false, // Manual connection control
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  maxReconnectionAttempts: 5,
  timeout: 30000,
  transports: ['websocket', 'polling'],
  upgrade: true,
  rememberUpgrade: true,
  // Prevent multiple connections
  forceNew: false,
  // Connection management
  closeOnBeforeunload: false
});

// Connection state tracking
let isConnecting = false;
let currentRoom = null;
let currentUser = null;

// Enhanced connection methods
const connectSocket = (user, roomCode) => {
  if (isConnecting || socket.connected) {
    console.log('⚠️ Socket already connecting or connected');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    isConnecting = true;
    currentUser = user;
    currentRoom = roomCode;

    const onConnect = () => {
      console.log('✅ Socket connected successfully');
      isConnecting = false;
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      resolve();
    };

    const onError = (error) => {
      console.error('❌ Socket connection error:', error);
      isConnecting = false;
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      reject(error);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onError);
    
    socket.connect();
  });
};

const disconnectSocket = () => {
  if (currentRoom && currentUser) {
    socket.emit('leave-room', currentRoom);
  }
  socket.disconnect();
  isConnecting = false;
  currentRoom = null;
  currentUser = null;
};

// Prevent page unload issues
window.addEventListener('beforeunload', () => {
  if (socket.connected && currentRoom) {
    socket.emit('leave-room', currentRoom);
  }
});

export { socket, connectSocket, disconnectSocket };
