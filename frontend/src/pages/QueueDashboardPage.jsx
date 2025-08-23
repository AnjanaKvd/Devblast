import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  Tabs,
  Tab,
  Badge,
  alpha,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ViewListIcon from '@mui/icons-material/ViewList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EnhancedNavbar from '../components/Navbar';
import QueueManagement from '../components/admin/QueueManagement';
import QueueAnalytics from '../components/admin/QueueAnalytics';
import * as api from '../services/api';

// Helper function to get color based on queue status
const getStatusColor = (theme, status) => {
  switch (status) {
    case 'pending':
      return theme.palette.warning.main;
    case 'in-progress':
      return theme.palette.info.main;
    case 'completed':
      return theme.palette.success.main;
    case 'cancelled':
      return theme.palette.error.main;
    default:
      return theme.palette.grey[500];
  }
};

const QueueDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const refreshTimerRef = useRef(null);
  
  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.getOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial fetch and set up timers
  useEffect(() => {
    fetchOrders();
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Set up refresh interval for orders
    refreshTimerRef.current = setInterval(() => {
      fetchOrders();
    }, refreshInterval);
    
    return () => {
      clearInterval(timeInterval);
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [fetchOrders, refreshInterval]);
  
  // Calculate queue stats
  const getQueueStats = () => {
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const inProgressOrders = orders.filter(order => order.status === 'in-progress').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const totalOrders = orders.length;
    
    // Calculate average wait time
    const completedOrdersArray = orders.filter(order => order.status === 'completed');
    let avgWaitTime = 0;
    
    if (completedOrdersArray.length > 0) {
      const totalWaitTime = completedOrdersArray.reduce((sum, order) => {
        const createdAt = new Date(order.createdAt);
        const completedAt = new Date(order.updatedAt);
        const waitTimeMinutes = (completedAt - createdAt) / (1000 * 60);
        return sum + waitTimeMinutes;
      }, 0);
      
      avgWaitTime = Math.round(totalWaitTime / completedOrdersArray.length);
    }
    
    return {
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalOrders,
      avgWaitTime
    };
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const queueStats = getQueueStats();
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f8fa' }}>
      <EnhancedNavbar />
      
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              sx={{ mr: 2 }} 
              onClick={() => navigate('/admin-dashboard')}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Queue Dashboard
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              color="primary"
              variant="outlined"
            />
            
            <Tooltip title="Refresh Data">
              <IconButton onClick={fetchOrders}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Queue Notifications">
              <IconButton>
                <Badge badgeContent={queueStats.pendingOrders} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Queue Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                borderLeft: `4px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                {queueStats.totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All orders in the system
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                borderLeft: `4px solid ${theme.palette.warning.main}`
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Pending Orders
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                {queueStats.pendingOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Orders waiting to be processed
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                borderLeft: `4px solid ${theme.palette.info.main}`
              }}
            >
              <Typography variant="overline" color="text.secondary">
                In Progress
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                {queueStats.inProgressOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Orders currently being prepared
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                borderLeft: `4px solid ${theme.palette.success.main}`
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Avg. Processing Time
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                {queueStats.avgWaitTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Minutes from order to completion
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Tabs for Queue Management and Analytics */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="queue dashboard tabs"
          >
            <Tab 
              icon={<ViewListIcon />} 
              label="Queue Management" 
              iconPosition="start"
            />
            <Tab 
              icon={<DashboardIcon />} 
              label="Queue Analytics" 
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tabValue === 0 ? (
            <motion.div
              key="management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QueueManagement />
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QueueAnalytics 
                orders={orders}
                refreshData={fetchOrders}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default QueueDashboardPage;
