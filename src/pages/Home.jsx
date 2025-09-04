import React, { useState, useEffect } from 'react';

const features = [
  {
    title: 'Host a Room',
    desc: 'Upload or stream a movie, create a private room, and share the invite link.'
  },
  {
    title: 'Join a Room',
    desc: 'Use a link to join your friends’ watch party instantly.'
  },
  {
    title: 'Sync Playback',
    desc: 'When the host plays, pauses, or skips, everyone’s screen updates in real time.'
  },
  {
    title: 'Chat & Reactions',
    desc: 'Send messages and react live to make the experience social and interactive.'
  },
  {
    title: 'Cross-device',
    desc: 'Works on any device and with any movie file—no OTT restrictions.'
  },
  {
    title: 'Profile & More',
    desc: 'Manage your profile, create or join multiple rooms, and enjoy virtual hangouts!'
  }
];

const fontStyle = {
  fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif',
  fontWeight: 700,
  fontSize: '2rem',
  letterSpacing: '1px',
  color: '#fff',
  marginBottom: '1rem',
};

const descStyle = {
  fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif',
  fontWeight: 500,
  fontSize: '1.25rem',
  color: '#fff',
  opacity: 0.93,
  marginBottom: '0.5rem',
  minHeight: '60px',
};

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container" style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
    }}>
      <h1 style={fontStyle}>Welcome to CineSync!</h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40vh',
        width: '100vw',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.09)',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          padding: '3.5rem 4rem',
          minWidth: '480px',
          maxWidth: '700px',
          width: '60vw',
          textAlign: 'center',
          transition: 'all 0.5s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={fontStyle}>{features[current].title}</div>
          <div style={descStyle}>{features[current].desc}</div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '1.2rem', gap: '0.5rem'}}>
        {features.map((_, idx) => (
          <span key={idx} style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: idx === current ? '#ff512f' : '#ffe082',
            opacity: idx === current ? 1 : 0.5,
            transition: 'background 0.3s',
            display: 'inline-block',
          }}></span>
        ))}
      </div>
      <p style={{marginTop: '2.2rem', fontSize: '1.15rem', opacity: 0.85}}>
        Get started by signing up or logging in, then create or join a room to begin your movie night!
      </p>
    </div>
  );
};

export default Home;
