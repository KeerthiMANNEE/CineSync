import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on component mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to get user info (simple JWT decode)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email, token });
        console.log('User loaded from token:', payload.email);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('token', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.email, token });
      console.log('User logged in:', payload.email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('User logged out');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
