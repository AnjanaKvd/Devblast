import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Badge,
  useTheme,
  Stack,
  Tooltip,
  alpha
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import DoneIcon from '@mui/icons-material/Done';
import ViewListIcon from '@mui/icons-material/ViewList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import * as api from '../../services/api';

const QueueManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const theme = useTheme();

  // Fetch orders data
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

  // Update current time every minute
  useEffect(() => {
    fetchOrders();
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute
    
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Handle marking an order as complete
  const handleCompleteOrder = async (id) => {
    try {
      await api.updateOrderStatus(id, 'completed');
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  // Calculate wait time in minutes
  const calculateWaitTime = (orderTime) => {
    const orderDate = new Date(orderTime);
    const diffMs = currentTime - orderDate;
    return Math.floor(diffMs / (1000 * 60));
  };

  // Sort orders for the queue
  const getQueueOrders = () => {
    // Filter out completed/cancelled orders
    const activeOrders = orders.filter(order => 
      order.status !== 'completed' && order.status !== 'cancelled'
    );
    
    // Sort by creation time (FCFS)
    return activeOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA - dateB;
    });
  };

  // Get background color based on wait time
  const getWaitTimeColor = (minutes) => {
    if (minutes < 5) return theme.palette.success.light;
    if (minutes < 15) return theme.palette.warning.light;
    return theme.palette.error.light;
  };

  const getStatusColor = (status) => {
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'rice':
        return <LocalDiningIcon />;
      case 'drinks':
        return <LocalDrinkIcon />;
      case 'snacks':
        return <FastfoodIcon />;
      default:
        return <FastfoodIcon />;
    }
  };

  const queueOrders = getQueueOrders();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Digital Queue
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ViewListIcon />}
            onClick={fetchOrders}
            sx={{ mr: 1 }}
          >
            Refresh Queue
          </Button>
          <Chip 
            icon={<AccessTimeIcon />} 
            label={`Current Time: ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : queueOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Queue is Empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no active orders in the queue
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {queueOrders.map((order) => {
            const waitTime = calculateWaitTime(order.createdAt);
            return (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: 2,
                    borderLeft: `4px solid ${getStatusColor(order.status)}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Token #{order.id}
                        </Typography>
                        <Chip 
                          size="small"
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          sx={{ 
                            bgcolor: alpha(getStatusColor(order.status), 0.1),
                            color: getStatusColor(order.status),
                            borderRadius: 1
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        bgcolor: getWaitTimeColor(waitTime), 
                        color: 'white',
                        borderRadius: '50%',
                        width: 45,
                        height: 45,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {waitTime}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                          min
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Order Time: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 'medium' }}>
                        Items:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {order.items.map((item, idx) => (
                          <Chip
                            key={idx}
                            size="small"
                            icon={getCategoryIcon(item.category)}
                            label={item.name}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Rs {order.totalPrice}
                      </Typography>
                      {waitTime > 15 && (
                        <Tooltip title="This order is delayed">
                          <IconButton size="small" color="error">
                            <PriorityHighIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                  
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleCompleteOrder(order._id)}
                    sx={{ 
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      py: 1.5
                    }}
                  >
                    Mark as Complete
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Completed Orders Section */}
      {orders.filter(order => order.status === 'completed').length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recently Completed
          </Typography>
          <Grid container spacing={2}>
            {orders
              .filter(order => order.status === 'completed')
              .slice(0, 4) // Show only the last 4 completed orders
              .map((order) => (
                <Grid item xs={12} sm={6} md={3} key={order._id}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DoneIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Token #{order.id}
                      </Typography>
                    </Box>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Completed at: {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Grid>
              ))
            }
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default QueueManagement;
