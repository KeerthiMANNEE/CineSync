import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: colors.primary,
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: `0 2px 20px ${colors.shadow}`
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none',
          color: '#fff'
        }}>
          <img 
            src="/logo.png" 
            alt="CineSync Logo" 
            style={{ 
              height: '40px', 
              width: '40px', 
              marginRight: '12px',
              borderRadius: '8px'
            }} 
          />
          <span style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#fff'
          }}>
            CineSync
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          alignItems: 'center',
          '@media (max-width: 768px)': { display: 'none' }
        }}>
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none',
                  fontWeight: isActive('/dashboard') ? '600' : '400',
                  opacity: isActive('/dashboard') ? 1 : 0.8
                }}
              >
                Dashboard
              </Link>
              <Link 
                to="/create-room" 
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none',
                  fontWeight: isActive('/create-room') ? '600' : '400',
                  opacity: isActive('/create-room') ? 1 : 0.8
                }}
              >
                Create Room
              </Link>
              <Link 
                to="/join-room" 
                style={{ 
                  color: '#fff', 
                  textDecoration: 'none',
                  fontWeight: isActive('/join-room') ? '600' : '400',
                  opacity: isActive('/join-room') ? 1 : 0.8
                }}
              >
                Join Room
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={toggleTheme}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#fff',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </button>
                
                <span style={{ color: '#fff', fontSize: '14px' }}>
                  {user.email}
                </span>
                
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#fff'
                  }}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button 
                onClick={toggleTheme}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#fff',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              
              <Link to="/login">
                <Button 
                  variant="secondary" 
                  size="small"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#fff'
                  }}
                >
                  Login
                </Button>
              </Link>
              
              <Link to="/signup">
                <Button 
                  size="small"
                  style={{
                    background: '#fff',
                    color: '#ff6b6b'
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            '@media (max-width: 768px)': { display: 'block' },
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#fff',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          margin: '8px 0',
          padding: '16px',
          display: 'block',
          '@media (min-width: 769px)': { display: 'none' }
        }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" style={{ width: '100%' }}>Dashboard</Button>
              </Link>
              <Link to="/create-room" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" style={{ width: '100%' }}>Create Room</Button>
              </Link>
              <Link to="/join-room" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" style={{ width: '100%' }}>Join Room</Button>
              </Link>
              <Button variant="danger" onClick={handleLogout} style={{ width: '100%' }}>
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" style={{ width: '100%' }}>Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" style={{ width: '100%' }}>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
