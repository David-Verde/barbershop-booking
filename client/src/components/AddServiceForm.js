import React, { useState } from 'react';
import styled from 'styled-components';
import { addService } from '../utils/api';
import Input from './Input';
import Button from './Button';
import Loader from './Loader';

const Form = styled.form`
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 15px;
`;

const AddServiceForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al agregar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default AddServiceForm;