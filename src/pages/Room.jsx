import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { socket, connectSocket, disconnectSocket } from '../utils/socket';

const Room = () => {
  const { roomCode } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  const userName = user?.email || 'Anonymous';

  useEffect(() => {
    console.log('🔌 Room component mounted, initializing connection...');
    
    let isComponentMounted = true;
    
    const initializeConnection = async () => {
      try {
        setIsJoining(true);
        setConnectionError(null);
        
        // Connect socket if not already connected
        if (!socket.connected) {
          await connectSocket(userName, roomCode);
        }
        
        // Set up socket event listeners
        setupSocketListeners();
        
        // Join room
        socket.emit('join-room', {
          roomCode,
          user: userName
        });
        
      } catch (error) {
        console.error('❌ Failed to initialize connection:', error);
        setConnectionError('Failed to connect to server');
      } finally {
        setIsJoining(false);
      }
    };

    const setupSocketListeners = () => {
      // Connection status listeners
      const onConnect = () => {
        console.log('✅ Connected to server');
        setIsConnected(true);
        setConnectionError(null);
      };
      
      const onDisconnect = (reason) => {
        console.log('❌ Disconnected from server, reason:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          setConnectionError('Disconnected by server');
        }
      };

      const onForceDisconnect = (data) => {
        console.log('🚨 Force disconnect:', data.reason);
        setConnectionError(data.reason);
        setTimeout(() => navigate('/dashboard'), 3000);
      };
      
      const onRoomState = (state) => {
        console.log('📊 Received room state:', state);
        setRoomData(state);
        setUsers(state.users || []);
        setMessages(state.messages || []);
        
        if (videoRef.current && state.currentTime !== undefined) {
          setIsSyncing(true);
          videoRef.current.currentTime = state.currentTime;
          if (state.isPlaying) {
            videoRef.current.play().catch(console.error);
          } else {
            videoRef.current.pause();
          }
          setIsPlaying(state.isPlaying);
          setTimeout(() => setIsSyncing(false), 500);
        }
      };

      const onUserJoined = (userData) => {
        console.log('👤 User joined:', userData);
        setUsers(prev => {
          const exists = prev.find(u => u.id === userData.user.id);
          return exists ? prev : [...prev, userData.user];
        });
      };

      const onUserLeft = (data) => {
        console.log('👋 User left:', data);
        setUsers(prev => prev.filter(u => u.id !== data.userId));
      };

      const onNewMessage = (message) => {
        console.log('💬 New message:', message);
        setMessages(prev => [...prev, message]);
      };

      const onVideoPlay = (data) => {
        console.log('▶️ Video play event:', data);
        if (videoRef.current && !isSyncing) {
          setIsSyncing(true);
          videoRef.current.currentTime = data.currentTime;
          videoRef.current.play().catch(console.error);
          setIsPlaying(true);
          setTimeout(() => setIsSyncing(false), 500);
        }
      };

      const onVideoPause = (data) => {
        console.log('⏸️ Video pause event:', data);
        if (videoRef.current && !isSyncing) {
          setIsSyncing(true);
          videoRef.current.currentTime = data.currentTime;
          videoRef.current.pause();
          setIsPlaying(false);
          setTimeout(() => setIsSyncing(false), 500);
        }
      };

      const onVideoSeek = (data) => {
        console.log('⏭️ Video seek event:', data);
        if (videoRef.current && !isSyncing) {
          setIsSyncing(true);
          videoRef.current.currentTime = data.currentTime;
          setTimeout(() => setIsSyncing(false), 500);
        }
      };

      const onError = (error) => {
        console.error('🔥 Socket error:', error);
        setConnectionError(error.message || 'Socket error occurred');
      };

      // Add event listeners
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('force-disconnect', onForceDisconnect);
      socket.on('room-state', onRoomState);
      socket.on('user-joined', onUserJoined);
      socket.on('user-left', onUserLeft);
      socket.on('new-message', onNewMessage);
      socket.on('video-play', onVideoPlay);
      socket.on('video-pause', onVideoPause);
      socket.on('video-seek', onVideoSeek);
      socket.on('error', onError);

      // Return cleanup function for this setup
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('force-disconnect', onForceDisconnect);
        socket.off('room-state', onRoomState);
        socket.off('user-joined', onUserJoined);
        socket.off('user-left', onUserLeft);
        socket.off('new-message', onNewMessage);
        socket.off('video-play', onVideoPlay);
        socket.off('video-pause', onVideoPause);
        socket.off('video-seek', onVideoSeek);
        socket.off('error', onError);
      };
    };

    // Initialize connection
    initializeConnection();
    const cleanupListeners = setupSocketListeners();

    // Component cleanup function
    return () => {
      console.log('🧹 Cleaning up room connections...');
      isComponentMounted = false;
      
      if (socket.connected) {
        socket.emit('leave-room', roomCode);
      }
      
      // Clean up listeners
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, [roomCode, userName, navigate]);  const handlePlay = () => {
    if (!isSyncing && videoRef.current) {
      socket.emit('video-play', {
        roomCode,
        currentTime: videoRef.current.currentTime
      });
    }
  };

  const handlePause = () => {
    if (!isSyncing && videoRef.current) {
      socket.emit('video-pause', {
        roomCode,
        currentTime: videoRef.current.currentTime
      });
    }
  };

  const handleSeek = () => {
    if (!isSyncing && videoRef.current) {
      socket.emit('video-seek', {
        roomCode,
        currentTime: videoRef.current.currentTime
      });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('send-message', {
        roomCode,
        message: newMessage,
        user: userName
      });
      setNewMessage('');
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Disable picture-in-picture to avoid the error
    if ('disablePictureInPicture' in video) {
      video.disablePictureInPicture = true;
    }

    // Set video properties for better network compatibility
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    // Handle video load errors
    const handleError = (e) => {
      console.error('Video error:', e);
      console.error('Video error details:', {
        error: video.error,
        networkState: video.networkState,
        readyState: video.readyState,
        currentSrc: video.currentSrc
      });
    };

    const handleLoadStart = () => {
      console.log('Video load started');
    };

    const handleCanPlay = () => {
      console.log('Video can play');
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Replace the video source handling
  useEffect(() => {
    if (videoRef.current && roomData?.videoUrl) {
      const video = videoRef.current;
      
      // Create full URL for video
      const getVideoUrl = () => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return `http://localhost:5000${roomData.videoUrl}`;
        }
        
        if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          return `${protocol}//${hostname}:5000${roomData.videoUrl}`;
        }
        
        return `http://localhost:5000${roomData.videoUrl}`;
      };
      
      const fullVideoUrl = getVideoUrl();
      console.log('Setting video source to:', fullVideoUrl);
      
      video.src = fullVideoUrl;
      video.load(); // Force reload
    }
  }, [roomData]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#1a1a1a', color: '#fff' }}>
      {/* Video Section */}
      <div style={{ flex: 2, padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Room: {roomCode}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ 
              color: isConnected ? '#4caf50' : '#f44336',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{ fontSize: '12px' }}>●</span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {isSyncing && (
              <span style={{ color: '#ff9800', fontSize: '14px' }}>
                🔄 Syncing...
              </span>
            )}
          </div>
        </div>
        
        {roomData?.videoUrl ? (
          <video
            ref={videoRef}
            width="100%"
            height="400px"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeek}
            style={{ borderRadius: '8px', backgroundColor: '#000' }}
          >
            <source src={`http://localhost:5000${roomData.videoUrl}`} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        ) : (
          <div style={{
            width: '100%',
            height: '400px',
            background: '#333',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '48px' }}>🎬</div>
            <div>No video uploaded for this room</div>
            <div style={{ fontSize: '14px', color: '#888' }}>
              Create a new room with a video file to start watching together
            </div>
          </div>
        )}
      </div>

      {/* Chat & Users Section */}
      <div style={{ 
        flex: 1, 
        background: '#2a2a2a', 
        display: 'flex', 
        flexDirection: 'column',
        borderLeft: '1px solid #444'
      }}>
        {/* Users List */}
        <div style={{ padding: '20px', borderBottom: '1px solid #444' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
            Online Users ({users.length})
          </h3>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {users.map((user, index) => (
              <div key={index} style={{ 
                color: '#ccc', 
                marginBottom: '8px',
                padding: '5px 8px',
                background: '#333',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <span style={{ color: '#4caf50', marginRight: '8px' }}>●</span>
                {user.name || user}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Chat</h3>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            marginBottom: '15px',
            minHeight: '200px'
          }}>
            {messages.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} style={{ 
                  marginBottom: '12px',
                  padding: '10px',
                  background: '#333',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <strong style={{ color: '#4caf50' }}>{msg.user}</strong>
                    <small style={{ color: '#888', fontSize: '12px' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                  <div style={{ lineHeight: '1.4' }}>{msg.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} style={{ 
          padding: '20px',
          borderTop: '1px solid #444',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              background: '#333',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button 
            type="submit" 
            disabled={!isConnected || !newMessage.trim()}
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              border: 'none',
              background: (!isConnected || !newMessage.trim()) ? '#666' : '#4caf50',
              color: '#fff',
              cursor: (!isConnected || !newMessage.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Room;
