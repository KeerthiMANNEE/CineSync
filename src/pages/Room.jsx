import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../utils/socket';


const Room = () => {
  const location = useLocation();
  const { roomCode, roomName } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', { roomCode });

    socket.on('videoAction', ({ action, time }) => {
      if (videoRef.current) {
        if (action === 'play') {
          videoRef.current.currentTime = time;
          videoRef.current.play();
        } else if (action === 'pause') {
          videoRef.current.currentTime = time;
          videoRef.current.pause();
        }
      }
    });

    socket.on('chatMessage', ({ message }) => {
      setMessages((msgs) => [...msgs, { text: message, sender: 'Other' }]);
    });

    socket.on('reaction', ({ emoji }) => {
      setMessages((msgs) => [...msgs, { text: emoji, sender: 'Reaction' }]);
    });

    return () => {
      socket.disconnect();
      socket.off('videoAction');
      socket.off('chatMessage');
      socket.off('reaction');
    };
  }, [roomCode]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'You' }]);
      socket.emit('chatMessage', { roomCode, message: input });
      setInput('');
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      socket.emit('videoAction', { roomCode, action: 'play', time: videoRef.current.currentTime });
      videoRef.current.play();
    }
  };
  const handlePause = () => {
    if (videoRef.current) {
      socket.emit('videoAction', { roomCode, action: 'pause', time: videoRef.current.currentTime });
      videoRef.current.pause();
    }
  };

  const sendReaction = (emoji) => {
    setMessages([...messages, { text: emoji, sender: 'Reaction' }]);
    socket.emit('reaction', { roomCode, emoji });
  };

  return (
    <div className="room-container" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    }}>
      <div style={{ margin: '2rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: '700', marginBottom: '0.5rem' }}>Room: {roomName || 'Movie Night'}</h2>
        <div style={{ fontSize: '1.1rem', color: '#ffe082', marginBottom: '1rem' }}>Code: {roomCode || 'N/A'} <button style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem', borderRadius: '8px', background: '#ffe082', color: '#232526', fontWeight: '600', border: 'none', cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(roomCode)}>Copy</button></div>
      </div>
      <div style={{ display: 'flex', gap: '2.5rem', width: '90%', maxWidth: '1200px', justifyContent: 'center' }}>
        {/* Video Player */}
        <div style={{ flex: 2, background: 'rgba(255,255,255,0.07)', borderRadius: '18px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
          <video ref={videoRef} width="100%" height="auto" controls style={{ borderRadius: '12px', background: '#000' }}>
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handlePlay} style={{ fontSize: '1.2rem', padding: '0.7rem 1.5rem', borderRadius: '24px', background: '#ff512f', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Play</button>
            <button onClick={handlePause} style={{ fontSize: '1.2rem', padding: '0.7rem 1.5rem', borderRadius: '24px', background: '#dd2476', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Pause</button>
          </div>
        </div>
        {/* Chat & Reactions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.09)', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', minHeight: '300px', maxHeight: '350px', overflowY: 'auto' }}>
            <h3 style={{ color: '#fff', fontWeight: '600', marginBottom: '1rem' }}>Chat</h3>
            <div>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: '0.7rem', textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                  <span style={{
                    display: 'inline-block',
                    background: msg.sender === 'You' ? '#ff512f' : '#ffe082',
                    color: msg.sender === 'You' ? '#fff' : '#232526',
                    borderRadius: '16px',
                    padding: '0.5rem 1rem',
                    fontWeight: '500',
                    fontSize: '1rem',
                  }}>{msg.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '0.7rem', borderRadius: '12px', border: 'none', fontSize: '1rem', background: '#232526', color: '#fff' }} />
              <button type="submit" style={{ padding: '0.7rem 1.2rem', borderRadius: '12px', background: '#ffe082', color: '#232526', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Send</button>
            </form>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.09)', borderRadius: '18px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => sendReaction('👍')} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>👍</button>
            <button onClick={() => sendReaction('😂')} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>😂</button>
            <button onClick={() => sendReaction('😍')} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>😍</button>
            <button onClick={() => sendReaction('👏')} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>👏</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
