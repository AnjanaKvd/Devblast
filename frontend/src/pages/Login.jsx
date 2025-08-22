import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.login(formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Box className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      <Paper elevation={3} className="form-container rounded-2xl">
        <Typography variant="h4" className="form-title">
          Welcome Back
        </Typography>
        
        {error && (
          <Box className="mb-6 p-4 bg-red-50 rounded-lg">
            <Typography color="error" className="text-center text-sm">
              {error}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-group">
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              className="form-field"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                },
                '& .MuiInputLabel-root': {
                  transform: 'translate(14px, 16px) scale(1)'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)'
                }
              }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className="input-group">
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              className="form-field"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                },
                '& .MuiInputLabel-root': {
                  transform: 'translate(14px, 16px) scale(1)'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)'
                }
              }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="mt-8">
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              className="btn-primary h-14 text-base"
            >
              Sign In
            </Button>
          </div>

          <Typography className="text-center text-gray-500 text-sm pt-4">
            Don't have an account? {' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Create Account
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
