import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPhone, FaUser } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { checkClient, createClient } from '../utils/api';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
  flex: 1;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const PhonePrefix = styled.div`
  padding: 12px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 4px 0 0 4px;
  height: 45px;
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const PhoneVerification = () => {
  const [phone, setPhone] = useState('+593');
  const [name, setName] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setClient } = useAppContext();
  const navigate = useNavigate();
  
  const handlePhoneCheck = async (e) => {
    e.preventDefault();
    
    if (phone.length < 13) { // +593 + 9 dígitos
      setError('El número debe tener 9 dígitos después de +593');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const existingClient = await checkClient(phone);
      
      if (existingClient) {
        setClient(existingClient);
        navigate('/book');
      } else {
        setIsNewClient(true);
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (phone.length < 13) {
      setError('El número debe tener 9 dígitos después de +593');
      return;
    }
    
    if (isNewClient && !name) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      if (isNewClient) {
        const newClient = await createClient({ phone, name });
        setClient(newClient);
      }
      
      navigate('/book');
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header subtitle="Gomez rendon entre la 18 y la 19" />
      
      <Form onSubmit={isNewClient ? handleSubmit : handlePhoneCheck}>
        <Title>Bienvenido a La Barbería</Title>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
            Número de teléfono
          </label>
          <PhoneInputContainer>
            <PhonePrefix>+593</PhonePrefix>
            <Input
              type="tel"
              name="phone"
              value={phone.replace('+593', '')}
              onChange={(e) => {
                // Permite solo números y limita a 9 dígitos
                const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                setPhone('+593' + value);
              }}
              placeholder="991234567"
              required
              icon={<FaPhone />}
              disabled={loading}
              style={{ 
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                flex: 1 
              }}
            />
          </PhoneInputContainer>
        </div>
        
        {isNewClient && (
          <Input
            type="text"
            label="Nombre completo"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            required
            icon={<FaUser />}
            disabled={loading}
          />
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonContainer>
          <Button 
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? <Loader text={null} /> : isNewClient ? 'Continuar' : 'Verificar'}
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default PhoneVerification;