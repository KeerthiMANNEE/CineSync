import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loginUser } from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        const loginSuccess = login(result.token);
        if (loginSuccess) {
          setMessage('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setMessage('Login failed. Please try again.');
        }
      } else {
        setMessage(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: colors.background,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '400px',
        padding: '48px',
        background: colors.card,
        border: `1px solid ${colors.border}`,
        textAlign: 'center'
      }}>
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="CineSync Logo" 
          style={{
            height: '80px',
            width: '80px',
            marginBottom: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        />
        
        <h1 style={{ 
          color: colors.text, 
          marginBottom: '8px',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Welcome Back
        </h1>
        
        <p style={{ 
          color: colors.textSecondary, 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Sign in to continue your movie experience
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{ textAlign: 'left' }}
            />
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{ textAlign: 'left' }}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              marginBottom: '24px',
              fontSize: '16px',
              padding: '16px'
            }}
          >
            {isLoading ? '🔄 Signing in...' : '🔑 Sign In'}
          </Button>
        </form>
        
        {message && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: message.includes('successful') ? '#10b981' : '#ef4444',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}
        
        <div style={{ 
          borderTop: `1px solid ${colors.border}`, 
          paddingTop: '24px',
          color: colors.textSecondary
        }}>
          <p style={{ marginBottom: '16px' }}>
            Don't have an account?
          </p>
          <Link to="/signup">
            <Button variant="secondary" style={{ width: '100%' }}>
              🚀 Create Account
            </Button>
          </Link>
        </div>
        
        <Link 
          to="/" 
          style={{ 
            display: 'inline-block',
            marginTop: '24px',
            color: colors.textSecondary,
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to Home
        </Link>
      </Card>
    </div>
  );
};

export default Login;
