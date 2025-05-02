import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${props => props.secondary ? '#5c5c72' : '#0f3460'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.secondary ? '#4a4a5e' : '#0d2d53'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: ${props => props.iconOnly ? '0' : '8px'};
  }
`;

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  secondary = false,
  fullWidth = false,
  iconOnly = false
}) => {
  return (
    <StyledButton 
      type={type}
      onClick={onClick}
      disabled={disabled}
      secondary={secondary}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
    >
      {children}
    </StyledButton>
  );
};

export default Button;