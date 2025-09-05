import { io } from 'socket.io-client';

// Dynamic socket URL detection
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

const socket = io(getSocketUrl(), {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
});

export { socket };
