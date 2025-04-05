import React from 'react';

const Button = ({ 
  children, 
  className = '', 
  type = 'button', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`rounded-md font-medium transition duration-150 ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;