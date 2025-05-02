import React from 'react';
import styled from 'styled-components';

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0f3460;
    box-shadow: 0 0 0 2px rgba(15, 52, 96, 0.2);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 0;
`;

const Input = ({ 
  type = 'text', 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  disabled = false,
  ...rest 
}) => {
  return (
    <InputGroup>
      {label && <Label htmlFor={name}>{label}</Label>}
      <StyledInput
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputGroup>
  );
};

export default Input;