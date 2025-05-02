import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaUser } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { adminLogin } from '../utils/api';
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

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAppContext();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { token } = await adminLogin({ username, password });
      login(token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header subtitle="Acceso administrador" />
      
      <Form onSubmit={handleSubmit}>
        <Title>Iniciar sesión</Title>
        
        <Input
          type="text"
          label="Usuario"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          required
          icon={<FaUser />}
          disabled={loading}
        />
        
        <Input
          type="password"
          label="Contraseña"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
          icon={<FaLock />}
          disabled={loading}
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonContainer>
          <Button 
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? <Loader text={null} /> : 'Iniciar sesión'}
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default AdminLogin;