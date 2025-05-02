import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAppContext();
  
  if (loading) {
    return <Loader fullPage />;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;