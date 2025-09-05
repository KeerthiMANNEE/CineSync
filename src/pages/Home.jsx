import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';

const features = [
	{
		title: 'Host a Room',
		desc: 'Upload or stream a movie, create a private room, and share the invite link.',
	},
	{
		title: 'Join a Room',
		desc: 'Use a link to join your friends’ watch party instantly.',
	},
	{
		title: 'Sync Playback',
		desc: 'When the host plays, pauses, or skips, everyone’s screen updates in real time.',
	},
	{
		title: 'Chat & Reactions',
		desc: 'Send messages and react live to make the experience social and interactive.',
	},
	{
		title: 'Cross-device',
		desc: 'Works on any device and with any movie file—no OTT restrictions.',
	},
	{
		title: 'Profile & More',
		desc: 'Manage your profile, create or join multiple rooms, and enjoy virtual hangouts!',
	},
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
  const { user } = useContext(AuthContext);
  const { colors } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎬',
      title: 'Synchronized Playback',
      description: 'Watch movies together with perfect sync across all devices'
    },
    {
      icon: '💬',
      title: 'Real-time Chat',
      description: 'Discuss scenes and share reactions while watching'
    },
    {
      icon: '📱',
      title: 'Cross-Platform',
      description: 'Works seamlessly on desktop, tablet, and mobile devices'
    },
    {
      icon: '🌐',
      title: 'Global Access',
      description: 'Connect with friends anywhere in the world'
    }
  ];

  return (
    <div style={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <section style={{
        background: colors.primary,
        padding: '100px 24px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <img 
            src="/logo.png" 
            alt="CineSync Logo" 
            style={{
              height: '120px',
              width: '120px',
              marginBottom: '32px',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
          />
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)', 
            marginBottom: '24px', 
            fontWeight: '800',
            lineHeight: '1.1'
          }}>
            Watch Movies<br />Together Online
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
            marginBottom: '48px', 
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Synchronize your movie watching experience with friends and family in real-time
          </p>
          
          {user ? (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                size="large"
                onClick={() => navigate('/create-room')}
                style={{
                  background: '#fff',
                  color: '#ff6b6b',
                  fontSize: '18px',
                  padding: '18px 36px'
                }}
              >
                🎬 Create Room
              </Button>
              <Button 
                size="large"
                variant="secondary"
                onClick={() => navigate('/join-room')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: '18px',
                  padding: '18px 36px'
                }}
              >
                🚪 Join Room
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup">
                <Button 
                  size="large"
                  style={{
                    background: '#fff',
                    color: '#ff6b6b',
                    fontSize: '18px',
                    padding: '18px 36px'
                  }}
                >
                  🚀 Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="large"
                  variant="secondary"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.3)',
                    fontSize: '18px',
                    padding: '18px 36px'
                  }}
                >
                  🔑 Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 24px', backgroundColor: colors.background }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            textAlign: 'center',
            marginBottom: '64px',
            color: colors.text,
            fontWeight: '700'
          }}>
            Why Choose CineSync?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {features.map((feature, index) => (
              <Card 
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '40px 24px',
                  background: colors.card,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '24px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '16px',
                  color: colors.text,
                  fontWeight: '600'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section style={{ 
          padding: '100px 24px', 
          backgroundColor: colors.background,
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              marginBottom: '24px',
              color: colors.text,
              fontWeight: '700'
            }}>
              Ready to Start Watching Together?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '48px',
              color: colors.textSecondary,
              lineHeight: '1.6'
            }}>
              Join thousands of users already enjoying synchronized movie experiences
            </p>
            <Link to="/signup">
              <Button 
                size="large"
                style={{
                  fontSize: '18px',
                  padding: '18px 48px'
                }}
              >
                🎬 Start Watching Now
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;