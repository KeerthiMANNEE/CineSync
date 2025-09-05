import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  style = {},
  ...props 
}) => {
  const { colors } = useTheme();

  const variants = {
    primary: {
      background: colors.primary,
      color: '#ffffff',
      border: 'none'
    },
    secondary: {
      background: colors.card,
      color: colors.text,
      border: `2px solid ${colors.border}`
    },
    outline: {
      background: 'transparent',
      color: colors.text,
      border: `2px solid ${colors.text}`
    },
    danger: {
      background: colors.error,
      color: '#ffffff',
      border: 'none'
    },
    success: {
      background: colors.success,
      color: '#ffffff',
      border: 'none'
    }
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '18px' }
  };

  const buttonStyle = {
    ...variants[variant],
    ...sizes[size],
    opacity: disabled || loading ? 0.6 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    position: 'relative',
    ...style
  };

  return (
    <button
      className="btn"
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <div 
          className="loading"
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            marginRight: '8px'
          }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;