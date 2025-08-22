import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  Container,
  Grid,
  Skeleton,
  Alert,
  Avatar,
  Stack,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
// Import Navbar and Footer
import EnhancedNavbar from '../components/Navbar';
import Footer from '../components/Footer';

// A small component for displaying profile items to keep the main component clean
const ProfileDetailItem = ({ label, value }) => (
  <Grid container item xs={12} alignItems="center">
    <Grid item xs={4} sm={3}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
        {label}
      </Typography>
    </Grid>
    <Grid item xs={8} sm={9}>
      <Typography variant="body1" sx={{ color: 'text.primary' }}>
        {value}
      </Typography>
    </Grid>
  </Grid>
);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.getProfile();
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const renderContent = () => {
    if (loading) {
      // Skeleton loader for a better UX while data is fetching
      return (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={60} height={60} />
            <Skeleton variant="text" width={200} height={40} />
          </Stack>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </Stack>
      );
    }
    
    if (error) {
      // Clear error message if the API call fails
      return <Alert severity="error">{error}</Alert>;
    }

    if (profile) {
      // The actual profile data
      return (
        <>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.light' }}>
              {profile.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Welcome, {profile.name}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={2}>
            <ProfileDetailItem label="Name: " value={profile.name} />
            <ProfileDetailItem label="Email: " value={profile.email} />
            <ProfileDetailItem label="Index Number: " value={profile.indexNo} />
            <ProfileDetailItem label="Role: " value={profile.role} />
          </Grid>
        </>
      );
    }
    
    return null; // Should not happen in normal flow
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      <EnhancedNavbar 
        onLogout={handleLogout} 
        userName={profile?.name} // Pass the name to the navbar
      />
      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 4 }, // Responsive padding
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          }}
        >
          {renderContent()}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}