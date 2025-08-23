import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/users/profile');
export const changeName = (data) => api.post('/users/change-name', data);
export const changeEmail = (data) => api.post('/users/change-email', data);
export const changePassword = (data) => api.post('/users/change-password', data);

export const addRiceAndCurry = (data) => api.post('/meals/riceandcurry', data);
export const uploadImage = (formData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  
  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }
  
  return axios.post(`${API_URL}/upload`, formData, {
    headers,
  });
};
export const getRiceAndCurry = () => api.get('/meals/riceandcurry');
