import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { getAppointments } from '../utils/api';
import Header from '../components/Header';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import AddServiceForm from '../components/AddServiceForm';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

const AppointmentsContainer = styled.div`
  margin-top: 30px;
`;

const AppointmentCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const ClientInfo = styled.div`
  font-weight: bold;
`;

const AppointmentDate = styled.div`
  color: #666;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const ServicesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const ServiceItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const AppointmentTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
`;

const NoAppointments = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
`;

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  
  const { logout } = useAppContext();
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Container>
      <Header subtitle="Panel de administración" />
      
      <Toolbar>
        <Button 
          onClick={() => setShowAddServiceModal(true)}
          icon={<FaPlus />}
        >
          Agregar servicio
        </Button>
        
        <Button 
          onClick={logout}
          secondary
          icon={<FaSignOutAlt />}
        >
          Cerrar sesión
        </Button>
      </Toolbar>
      
      <AppointmentsContainer>
        {loading ? (
          <Loader text="Cargando citas..." />
        ) : appointments.length === 0 ? (
          <NoAppointments>No hay citas agendadas</NoAppointments>
        ) : (
          appointments.map(appointment => (
            <AppointmentCard key={appointment._id}>
              <AppointmentHeader>
                <ClientInfo>
                  {appointment.client.name} ({appointment.client.phone})
                </ClientInfo>
                <AppointmentDate>
                  <FaCalendarAlt />
                  {formatDate(appointment.date)} a las {appointment.time}
                </AppointmentDate>
              </AppointmentHeader>
              
              <ServicesList>
                {appointment.services.map(service => (
                  <ServiceItem key={service._id}>
                    <span>{service.name}</span>
                    <span>${service.price}</span>
                  </ServiceItem>
                ))}
              </ServicesList>
              
              <AppointmentTotal>
                <span>Total ({appointment.totalDuration})</span>
                <span>${appointment.totalPrice}</span>
              </AppointmentTotal>
            </AppointmentCard>
          ))
        )}
      </AppointmentsContainer>
      
      {showAddServiceModal && (
        <Modal onClose={() => setShowAddServiceModal(false)}>
          <AddServiceForm 
            onSuccess={() => {
              setShowAddServiceModal(false);
              // Aquí podrías actualizar la lista de servicios si es necesario
            }} 
          />
        </Modal>
      )}
    </Container>
  );
};

export default AdminDashboard;