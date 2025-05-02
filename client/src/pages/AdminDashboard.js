import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaSignOutAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { getAppointments, deleteAppointment, deleteService } from '../utils/api';
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
  position: relative;
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
  font-size: 14px;
  
  &:hover {
    opacity: 0.9;
  }
  
  svg {
    margin-right: 5px;
  }
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

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('¿Estás seguro de cancelar esta cita? Se notificará al cliente.')) {
      try {
        await deleteAppointment(appointmentId);
        // Actualiza el estado local filtrando la cita eliminada
        setAppointments(prev => prev.filter(app => app._id !== appointmentId));
      } catch (err) {
        console.error('Error al cancelar cita:', err);
      }
    }
  };
  
  const handleDeleteService = async (serviceId) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio? Esto no afectará citas existentes.')) {
      try {
        await deleteService(serviceId);
      
        fetchAppointments(); 
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
      }
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <AppointmentDate>
                    <FaCalendarAlt />
                    {formatDate(appointment.date)} a las {appointment.time}
                  </AppointmentDate>
                  <ActionButton 
                    danger 
                    onClick={() => handleDeleteAppointment(appointment._id)}
                  >
                    <FaTrash /> Cancelar
                  </ActionButton>
                </div>
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
              fetchAppointments();
            }}
            onDeleteService={handleDeleteService}
          />
        </Modal>
      )}
    </Container>
  );
};

export default AdminDashboard;