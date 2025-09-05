import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Input = ({ 
  label, 
  error, 
  icon, 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  style = {},
  ...props 
}) => {
  const { colors } = useTheme();

  const inputStyle = {
    backgroundColor: colors.card,
    color: colors.text,
    border: `2px solid ${error ? colors.error : colors.border}`,
    ...style
  };

  return (
    <div style={{ width: '100%', marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: colors.text,
          fontWeight: '600',
          fontSize: '14px'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.textSecondary,
            zIndex: 1
          }}>
            {icon}
          </div>
        )}
        <input
          className="input"
          style={{
            ...inputStyle,
            paddingLeft: icon ? '44px' : '16px'
          }}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <div style={{
          color: colors.error,
          fontSize: '12px',
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default Input;