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

// Response interceptor for logging and debugging
api.interceptors.response.use(
  response => {
    console.log(`API Response [${response.config.method.toUpperCase()} ${response.config.url}]:`, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProfile = () => api.get('/users/profile');
export const changeName = (data) => api.post('/users/change-name', data);
export const changeEmail = (data) => api.post('/users/change-email', data);
export const changePassword = (data) => api.post('/users/change-password', data);

// Drinks API
export const getDrinks = () => api.get('/drinks');
export const getDrinkById = (id) => api.get(`/drinks/${id}`);
export const createDrink = (drinkData) => api.post('/add-drink', drinkData);
export const updateDrink = (id, drinkData) => api.post('/update-drink', { id, ...drinkData });
export const deleteDrink = (id) => api.post('/delete-drink', { id });

// Rice Curry API
export const getRiceCurries = () => api.get('/rice-curries');
export const addRiceCurry = (riceCurryData) => api.post('/add-rice-curry', riceCurryData);
export const updateRiceCurry = (id, riceCurryData) => api.post('/update-rice-curry', { id, ...riceCurryData });
export const deleteRiceCurry = (id) => api.post('/delete-rice-curry', { id });

// Orders API
export const submitOrder = (orderData) => api.post('/orders', orderData);
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.post('/update-order-status', { id, status });

// Users API (Admin Only)
export const getAllUsers = () => api.get('/users');
export const updateUserRole = (id, role) => api.post('/update-user-role', { id, role });
export const deleteUser = (id) => api.delete(`/users/${id}`);
