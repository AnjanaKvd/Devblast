import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    indexNo: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleConfirmPassword = (e) => {
    const { value } = e.target;
    if (value !== formData.password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.register(formData);
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
          Create Account
        </Typography>
        
        {error && (
          <Box className="mb-6 p-4 bg-red-50 rounded-lg">
            <Typography color="error" className="text-center text-sm">
              {error}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          {['name', 'email', 'indexNo', 'password', 'confirmPassword'].map((field) => (
            <div key={field} className="input-group">
              <TextField
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1).replace('No', ' Number')}
                type={field === 'password' || field === 'confirmPassword' ? 'password' : field === 'email' ? 'email' : 'text'}
                onChange={field === 'confirmPassword' ? handleConfirmPassword : (e) => setFormData({ ...formData, [field]: e.target.value })}
                required
                variant="outlined"
                className="form-field"
                value={formData[field]}
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
              />
            </div>
          ))}

          <div className="mt-8">
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              className="btn-primary h-14 text-base"
            >
              Create Account
            </Button>
          </div>

          <Typography className="text-center text-gray-500 text-sm pt-4">
            Already have an account? {' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}