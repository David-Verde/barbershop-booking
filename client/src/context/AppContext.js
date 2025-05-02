import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if admin is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Calculate total price and duration when selected services change
  useEffect(() => {
    if (selectedServices.length > 0) {
      // Calculate total price
      const price = selectedServices.reduce((sum, service) => sum + service.price, 0);
      setTotalPrice(price);

      // Calculate total duration in minutes for simplicity
      const durationParts = selectedServices.map(service => {
        const [value, unit] = service.duration.split(' ');
        return unit === 'h' ? parseInt(value) * 60 : parseInt(value);
      });
      
      const totalMinutes = durationParts.reduce((sum, minutes) => sum + minutes, 0);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      setTotalDuration(`${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`);
    } else {
      setTotalPrice(0);
      setTotalDuration('');
    }
  }, [selectedServices]);

  // Admin login
  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // Admin logout
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Reset booking data
  const resetBooking = () => {
    setClient(null);
    setSelectedServices([]);
    setSelectedDate(new Date());
    setSelectedTime('');
  };

  return (
    <AppContext.Provider value={{
      client,
      setClient,
      selectedServices,
      setSelectedServices,
      selectedDate,
      setSelectedDate,
      selectedTime,
      setSelectedTime,
      totalPrice,
      totalDuration,
      isAuthenticated,
      loading,
      setLoading,
      error,
      setError,
      login,
      logout,
      resetBooking
    }}>
      {children}
    </AppContext.Provider>
  );
};