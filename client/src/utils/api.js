import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the token for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Client related API calls
export const checkClient = async (phone) => {
  try {
    const res = await api.get(`/clients/${phone}`);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null; // Client not found
    }
    throw err;
  }
};

export const createClient = async (clientData) => {
  const res = await api.post('/clients', clientData);
  return res.data;
};

// Services related API calls
export const getServices = async () => {
  const res = await api.get('/services');
  return res.data;
};

// Appointment related API calls
export const getAvailableTimeSlots = async (date) => {
  const formattedDate = date.toISOString().split('T')[0];
  const res = await api.get(`/appointments/available-slots/${formattedDate}`);
  return res.data;
};

export const createAppointment = async (appointmentData) => {
  const res = await api.post('/appointments', appointmentData);
  return res.data;
};

// Admin related API calls
export const adminLogin = async (credentials) => {
  const res = await api.post('/admin/login', credentials);
  return res.data;
};

export const getAppointments = async () => {
  const res = await api.get('/admin/appointments');
  return res.data;
};

export const addService = async (serviceData) => {
  const res = await api.post('/admin/services', serviceData);
  return res.data;
};

export default api;