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
    indexNo: '',
    foodPreferences: []
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
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5dc', py: 4, px: 2 }}>
      <Paper elevation={3} className="form-container rounded-2xl" style={{ maxWidth: 400, width: '100%', padding: 32 ,background: '#f2f2f2ff' }}>
        <img src="..\src\assets\img1.jpg" alt="Food" style={{ width: '100%', borderRadius: 16, marginBottom: 24 }} />
        <Typography variant="h4" style={{ fontWeight: 700, marginBottom: 8 }}>
          Sign up Account
        </Typography>
        <Typography style={{ color: '#888', marginBottom: 24 }}>
          Hello, you must signup first to be able to use the application and enjoy all the features in grabGo
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            style={{ marginBottom: 16, borderRadius: 24 }}
            InputProps={{ style: { borderRadius: 24 } }}
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            style={{ marginBottom: 16, borderRadius: 24 }}
            InputProps={{ style: { borderRadius: 24 } }}
          />
          <TextField
            fullWidth
            label="Index Number"
            variant="outlined"
            value={formData.indexNo}
            onChange={e => setFormData({ ...formData, indexNo: e.target.value })}
            style={{ marginBottom: 16, borderRadius: 24 }}
            InputProps={{ style: { borderRadius: 24 } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            style={{ marginBottom: 16, borderRadius: 24 }}
            InputProps={{ style: { borderRadius: 24 } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleConfirmPassword}
            style={{ marginBottom: 8, borderRadius: 24 }}
            InputProps={{ style: { borderRadius: 24 } }}
          />
          <Typography align="right" style={{ color: '#F2994A', fontWeight: 500, marginBottom: 24, cursor: 'pointer' }}>
            Forgot Password?
          </Typography>
          {error && (
            <Typography color="error" style={{ marginBottom: 16 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            style={{
              background: '#f15835ff',
              color: '#fff',
              borderRadius: 32,
              height: 56,
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 16
            }}
          >
            Sign Up
          </Button>
          <Typography align="center" style={{ color: '#888' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'F15C2A', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}