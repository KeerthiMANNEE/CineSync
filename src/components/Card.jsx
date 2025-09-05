import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Card = ({ 
  children, 
  title, 
  subtitle,
  padding = '24px',
  hover = true,
  style = {},
  ...props 
}) => {
  const { colors } = useTheme();

  const cardStyle = {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    padding,
    ...style
  };

  return (
    <div 
      className={hover ? 'card' : ''}
      style={cardStyle}
      {...props}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '20px' }}>
          {title && (
            <h2 style={{
              color: colors.text,
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: subtitle ? '8px' : '0'
            }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{
              color: colors.textSecondary,
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;