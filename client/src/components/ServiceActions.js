import React from 'react';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';

const ActionButton = styled.button`
  background: ${props => props.danger ? '#e74c3c' : '#3498db'};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

export const DeleteServiceButton = ({ onDelete }) => (
  <ActionButton danger onClick={onDelete}>
    <FaTrash /> Eliminar
  </ActionButton>
);