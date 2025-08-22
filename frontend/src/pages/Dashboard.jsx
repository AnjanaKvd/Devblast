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
  Fade,
  Zoom,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

// --- Import Icons ---
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import QueueIcon from '@mui/icons-material/Queue';

// Import Navbar and Footer
import EnhancedNavbar from '../components/Navbar';
import Footer from '../components/Footer';

// A new component for the rounded category boxes
const CategoryCard = ({ title, icon, onClick, highlighted = false }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Paper
      onClick={onClick}
      elevation={highlighted ? 4 : 2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: '20px', // More rounded corners
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        },
        border: highlighted ? '2px solid rgba(25, 118, 210, 0.2)' : 'none',
        backgroundColor: highlighted ? 'rgba(25, 118, 210, 0.05)' : 'background.paper',
      }}
    >
      {icon}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
        {highlighted && (
          <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.5 }}>
            Try our new rice plate builder!
          </Typography>
        )}
      </Box>
    </Paper>
  </motion.div>
);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatingToMealBuilder, setAnimatingToMealBuilder] = useState(false);

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
  
  const handleNavigateToMealBuilder = () => {
    setAnimatingToMealBuilder(true);
    // Add a delay for the animation to complete before navigating
    setTimeout(() => {
      navigate('/meal-builder', { state: { from: 'dashboard', selectedOption: 'rice-curry' } });
    }, 500);
  };
  
  const handleNavigateToDrinksSnacks = () => {
    setAnimatingToMealBuilder(true); // Reuse the same animation state
    // Add a delay for the animation to complete before navigating
    setTimeout(() => {
      navigate('/drinks-snacks', { state: { from: 'dashboard', selectedOption: 'drinks-snacks' } });
    }, 500);
  };
  
  const handleNavigateToQueue = () => {
    setAnimatingToMealBuilder(true);
    setTimeout(() => {
      navigate('/queue');
    }, 500);
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
          <Skeleton variant="text" width={100} height={30} sx={{ mb: 1 }}/>
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '20px' }} />
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '20px' }} />
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '20px' }} />
        </Stack>
      );
    }
    
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (profile) {
      // The actual profile data and new category boxes
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
                Ready to order?
              </Typography>
            </Box>
          </Stack>

          {/* New Category Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
              Categories
            </Typography>
            <Stack spacing={2}>
              <Zoom in={!animatingToMealBuilder} timeout={500}>
                <Box>
                  <CategoryCard
                    title="Rice & Curry"
                    icon={<RestaurantMenuIcon sx={{ fontSize: 36, color: 'primary.main' }} />}
                    onClick={handleNavigateToMealBuilder}
                    highlighted={true}
                  />
                </Box>
              </Zoom>
              <Fade in={!animatingToMealBuilder} timeout={500}>
                <Box>
                  <CategoryCard
                    title="Drinks & Snacks"
                    icon={<LocalCafeIcon sx={{ fontSize: 36, color: 'secondary.main' }} />}
                    onClick={handleNavigateToDrinksSnacks}
                    highlighted={true}
                  />
                </Box>
              </Fade>
              <Fade in={!animatingToMealBuilder} timeout={500}>
                <Box>
                  <CategoryCard
                    title="Other"
                    icon={<FastfoodIcon sx={{ fontSize: 36, color: 'warning.main' }} />}
                    onClick={() => navigate('/menu/other')}
                  />
                </Box>
              </Fade>
              <Fade in={!animatingToMealBuilder} timeout={500}>
                <Box>
                  <CategoryCard
                    title="View Queue"
                    icon={<QueueIcon sx={{ fontSize: 36, color: 'info.main' }} />}
                    onClick={handleNavigateToQueue}
                    highlighted={true}
                  />
                </Box>
              </Fade>
            </Stack>
          </Box>
        </>
      );
    }
    
    return null;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      <EnhancedNavbar 
        onLogout={handleLogout} 
        userName={profile?.name}
      />
      {/* Changed maxWidth to "sm" for a more mobile-like feel */}
      <Container maxWidth="sm" sx={{ py: 4, flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: '24px',
            // A subtle background color to differentiate from the main page background
            bgcolor: 'background.paper',
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