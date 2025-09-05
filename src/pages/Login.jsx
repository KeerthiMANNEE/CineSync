import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { loginUser } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
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
      padding: '40px', 
      maxWidth: '400px', 
      margin: '0 auto',
      background: '#1a1a1a',
      color: '#fff',
      borderRadius: '10px',
      marginTop: '100px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login to CineSync</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#333',
              color: '#fff'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#333',
              color: '#fff'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isLoading ? '#666' : '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {message && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: message.includes('successful') ? '#4caf50' : '#f44336',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
