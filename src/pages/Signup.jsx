import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { signupUser } from '../utils/api';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = await signupUser(email, password);
      if (token) {
        login(token);
        setSuccess('Signup successful! You are now logged in.');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setError('Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
  {success && <p className="success">{success}</p>}
  {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Signup;
