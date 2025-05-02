import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaCheck } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from '../context/AppContext';
import { getServices, getAvailableTimeSlots, createAppointment } from '../utils/api';
import Header from '../components/Header';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const Welcome = styled.div`
  background-color: #f7f7f7;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const WelcomeText = styled.p`
  margin: 0;
  font-size: 18px;
  color: #333;

  span {
    font-weight: bold;
  }
`;

const SectionTitle = styled.h2`
  margin: 30px 0 20px;
  color: #333;
  font-size: 20px;
  position: relative;
  padding-left: 15px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: #0f3460;
    border-radius: 2px;
  }
`;

const ServicesContainer = styled.div`
  margin-bottom: 30px;
`;

const DateTimeContainer = styled.div`
  margin-bottom: 30px;
`;

const CustomDatePicker = styled.div`
  margin-bottom: 20px;
  
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .react-datepicker {
    font-family: inherit;
  }
`;

const TimeSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TimeSlot = styled.div`
  background-color: ${props => props.selected ? '#0f3460' : '#f7f7f7'};
  color: ${props => props.selected ? '#fff' : '#333'};
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.selected ? '#0d2d53' : '#eaeaea'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SummaryContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid #ddd;
  font-weight: bold;
  font-size: 18px;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 15px;
  text-align: center;
`;

const BookAppointment = () => {
  const [services, setServices] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    client, 
    selectedServices, 
    setSelectedServices,
    selectedDate, 
    setSelectedDate,
    selectedTime, 
    setSelectedTime,
    totalPrice,
    totalDuration
  } = useAppContext();
  
  const navigate = useNavigate();
  
  // Redirect if no client is selected
  useEffect(() => {
    if (!client) {
      navigate('/');
    }
  }, [client, navigate]);
  
  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los servicios. Por favor intenta de nuevo.');
      } finally {
        setIsLoadingServices(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setIsLoadingTimeSlots(true);
        const slots = await getAvailableTimeSlots(selectedDate);
        setAvailableTimeSlots(slots);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los horarios disponibles.');
      } finally {
        setIsLoadingTimeSlots(false);
      }
    };
    
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);
  
  const handleServiceToggle = (service) => {
    setSelectedServices(prevServices => {
      const isSelected = prevServices.some(s => s._id === service._id);
      
      if (isSelected) {
        return prevServices.filter(s => s._id !== service._id);
      } else {
        return [...prevServices, service];
      }
    });
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  
  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      setError('Por favor selecciona al menos un servicio.');
      return;
    }
    
    if (!selectedDate) {
      setError('Por favor selecciona una fecha.');
      return;
    }
    
    if (!selectedTime) {
      setError('Por favor selecciona una hora.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const appointmentData = {
        phone: client.phone,
        name: client.name,
        services: selectedServices.map(service => service._id),
        date: selectedDate,
        time: selectedTime
      };
      
      await createAppointment(appointmentData);
      navigate('/confirmation');
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al agendar tu cita. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };
  
  if (isLoadingServices) {
    return <Loader fullPage text="Cargando servicios..." />;
  }

  return (
    <Container>
      <Header subtitle="Reserva tu cita" />
      
      {client && (
        <Welcome>
          <WelcomeText>¡Hola <span>{client.name}</span>! ¿Qué servicios te gustaría agendar hoy?</WelcomeText>
        </Welcome>
      )}
      
      <SectionTitle>Selecciona los servicios</SectionTitle>
      <ServicesContainer>
        {services.map(service => (
          <ServiceCard
            key={service._id}
            service={service}
            selected={selectedServices.some(s => s._id === service._id)}
            onToggle={handleServiceToggle}
          />
        ))}
      </ServicesContainer>
      
      <SectionTitle>Selecciona fecha y hora</SectionTitle>
      <DateTimeContainer>
        <CustomDatePicker>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona una fecha"
            inline
          />
        </CustomDatePicker>
        
        {isLoadingTimeSlots ? (
          <Loader text="Cargando horarios disponibles..." />
        ) : (
          <TimeSlots>
            {availableTimeSlots.map(time => (
              <TimeSlot
                key={time}
                selected={time === selectedTime}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </TimeSlot>
            ))}
          </TimeSlots>
        )}
      </DateTimeContainer>
      
      {selectedServices.length > 0 && (
        <>
          <SectionTitle>Resumen de servicios</SectionTitle>
          <SummaryContainer>
            {selectedServices.map(service => (
              <SummaryItem key={service._id}>
                <span>{service.name}</span>
                <span>${service.price}</span>
              </SummaryItem>
            ))}
            <SummaryTotal>
              <span>Total ({totalDuration})</span>
              <span>${totalPrice}</span>
            </SummaryTotal>
          </SummaryContainer>
        </>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Button
        fullWidth
        onClick={handleSubmit}
        disabled={isSubmitting || selectedServices.length === 0 || !selectedTime}
      >
        {isSubmitting ? (
          <Loader text={null} />
        ) : (
          <>
            <FaCheck /> Confirmar Cita
          </>
        )}
      </Button>
    </Container>
  );
};

export default BookAppointment;