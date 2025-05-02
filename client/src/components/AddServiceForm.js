import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addService, getServices, deleteService } from '../utils/api';
import Input from './Input';
import Button from './Button';
import Loader from './Loader';

const FormContainer = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 15px;
`;

const ServicesList = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const AddServiceForm = ({ onSuccess, onDeleteService }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !price || !duration) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await addService({
        name,
        price: parseFloat(price),
        duration
      });
      
      // Refresh services list
      const updatedServices = await getServices();
      setServices(updatedServices);
      
      // Clear form
      setName('');
      setPrice('');
      setDuration('');
      
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al agregar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Agregar nuevo servicio</h2>
      
      <Form onSubmit={handleSubmit}>
        <Input
          label="Nombre del servicio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Corte de cabello"
          required
        />
        
        <Input
          type="number"
          label="Precio ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ej: 50.00"
          required
        />
        
        <Input
          label="Duración"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Ej: 1 h 30 m"
          required
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonContainer>
          <Button 
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader text={null} /> : 'Agregar servicio'}
          </Button>
        </ButtonContainer>
      </Form>

      <ServicesList>
        <h3>Servicios existentes</h3>
        {loadingServices ? (
          <Loader text="Cargando servicios..." />
        ) : services.length === 0 ? (
          <p>No hay servicios registrados</p>
        ) : (
          services.map(service => (
            <ServiceItem key={service._id}>
              <ServiceInfo>
                <strong>{service.name}</strong> - ${service.price} ({service.duration})
              </ServiceInfo>
              <DeleteButton 
                onClick={() => onDeleteService(service._id)}
              >
                Eliminar
              </DeleteButton>
            </ServiceItem>
          ))
        )}
      </ServicesList>
    </FormContainer>
  );
};

export default AddServiceForm;