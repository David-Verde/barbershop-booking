import React from 'react';
import styled from 'styled-components';
import { FaClock, FaDollarSign } from 'react-icons/fa';

const Card = styled.div`
  background-color: ${props => props.selected ? '#e6f0ff' : '#fff'};
  border: 1px solid ${props => props.selected ? '#0f3460' : '#ddd'};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    border-color: #0f3460;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

const ServiceName = styled.h3`
  margin: 0 0 10px;
  color: #333;
  font-size: 18px;
`;

const ServiceMeta = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  margin-top: 5px;
  
  svg {
    margin-right: 5px;
  }
  
  span {
    margin-right: 15px;
  }
`;

const BookButton = styled.div`
  background-color: ${props => props.selected ? '#e74c3c' : '#0f3460'};
  color: white;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.selected ? '#c0392b' : '#0d2d53'};
  }
`;

const ServiceCard = ({ service, selected, onToggle }) => {
  return (
    <Card 
      selected={selected} 
      onClick={() => onToggle(service)}
    >
      <ServiceInfo>
        <ServiceName>{service.name}</ServiceName>
        <ServiceMeta>
          <FaClock />
          <span>{service.duration}</span>
          <FaDollarSign />
          <span>${service.price}</span>
        </ServiceMeta>
      </ServiceInfo>
      <BookButton selected={selected}>
        {selected ? 'Eliminar' : 'Agregar'}
      </BookButton>
    </Card>
  );
};

export default ServiceCard;