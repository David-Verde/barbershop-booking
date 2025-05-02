import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCalendarAlt, FaClock, FaDollarSign, FaUserAlt, FaCheck } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const ConfirmationCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 30px 0;
`;

const SuccessIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  
  svg {
    background-color: #27ae60;
    color: white;
    border-radius: 50%;
    padding: 15px;
    width: 80px;
    height: 80px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const InfoSection = styled.div`
  margin-bottom: 25px;
`;

const InfoTitle = styled.h3`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const InfoContent = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  font-size: 16px;
`;

const ServicesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ServiceItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding-top: 15px;
  border-top: 1px solid #ddd;
  margin-top: 15px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

const Confirmation = () => {
  const { 
    client, 
    selectedServices, 
    selectedDate, 
    selectedTime, 
    totalPrice,
    totalDuration,
    resetBooking
  } = useAppContext();
  
  const navigate = useNavigate();
  
  // Redirect if no appointment data
  useEffect(() => {
    if (!client || !selectedDate || !selectedTime || selectedServices.length === 0) {
      navigate('/');
    }
  }, [client, selectedDate, selectedTime, selectedServices, navigate]);
  
  const handleNewAppointment = () => {
    resetBooking();
    navigate('/');
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };
  
  if (!client || !selectedDate || !selectedTime || selectedServices.length === 0) {
    return null;
  }

  return (
    <Container>
      <Header subtitle="Confirmación de cita" />
      
      <ConfirmationCard>
        <SuccessIcon>
          <FaCheck />
        </SuccessIcon>
        <Title>¡Cita agendada con éxito!</Title>
        
        <InfoSection>
          <InfoTitle>
            <FaUserAlt /> Cliente
          </InfoTitle>
          <InfoContent>
            {client.name} ({client.phone})
          </InfoContent>
        </InfoSection>
        
        <InfoSection>
          <InfoTitle>
            <FaCalendarAlt /> Fecha y hora
          </InfoTitle>
          <InfoContent>
            {formatDate(selectedDate)} a las {selectedTime}
          </InfoContent>
        </InfoSection>
        
        <InfoSection>
          <InfoTitle>
            <FaClock /> Servicios
          </InfoTitle>
          <InfoContent>
            <ServicesList>
              {selectedServices.map(service => (
                <ServiceItem key={service._id}>
                  <span>{service.name}</span>
                  <span>${service.price}</span>
                </ServiceItem>
              ))}
              <Total>
                <span>Total ({totalDuration})</span>
                <span>${totalPrice}</span>
              </Total>
            </ServicesList>
          </InfoContent>
        </InfoSection>
      </ConfirmationCard>
      
      <ButtonContainer>
        <Button 
          onClick={handleNewAppointment}
          secondary
        >
          Agendar nueva cita
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default Confirmation;