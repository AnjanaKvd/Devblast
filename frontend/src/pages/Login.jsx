import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
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
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', py: 4, px: 2 }}>
      <Paper elevation={0} sx={{ borderRadius: 6, maxWidth: 375, width: '100%', p: 4, boxShadow: 'none', background: '#fff' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mt: 6, mb: 6 }}>
          Welcome Back!
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 3, background: '#f5eaea', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, background: '#f5eaea' } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            sx={{ mb: 3, background: '#f5eaea', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, background: '#f5eaea' } }}
          />
          <Typography sx={{ textAlign: 'center', color: '#888', fontSize: 14, mb: 3 }}>
            Forgot Password? <span style={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>Click Here</span>
          </Typography>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              background: '#ff7a3e',
              color: '#fff',
              borderRadius: 3,
              height: 48,
              fontSize: 18,
              fontWeight: 700,
              mb: 2,
              boxShadow: 'none',
              '&:hover': { background: '#ff7a3e' }
            }}
          >
            Sign In
          </Button>
          <Typography sx={{ textAlign: 'center', color: '#888', fontSize: 15, mt: 2 }}>
            Don’t have an account?{' '}
            <Link to="/register" style={{ color: '#1976d2', fontWeight: 600 }}>
              Sign Up
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
