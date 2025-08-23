import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  alpha,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import * as api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const QueueManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [counters, setCounters] = useState([1, 2, 3]); // Default counters
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute default
  const refreshTimerRef = useRef(null);
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

  // Update current time every minute and refresh orders
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

  // Update refresh interval when it changes
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = setInterval(() => {
        fetchOrders();
      }, refreshInterval);
    }
  }, [refreshInterval, fetchOrders]);

  // Handle marking an order as complete
  const handleCompleteOrder = async (id) => {
    try {
      await api.updateOrderStatus(id, 'completed');
      fetchOrders();
      setSnackbar({
        open: true,
        message: 'Order marked as completed',
        severity: 'success'
      });
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  // Handle changing an order's status
  const handleChangeStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      fetchOrders();
      setSnackbar({
        open: true,
        message: `Order status updated to ${status}`,
        severity: 'success'
      });
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  // Handle changing an order's counter
  const handleChangeCounter = async (id, counter) => {
    try {
      await api.updateOrder(id, { counter });
      fetchOrders();
      setSnackbar({
        open: true,
        message: `Order moved to counter ${counter}`,
        severity: 'success'
      });
    } catch (err) {
      setError('Failed to update order counter');
      console.error(err);
    }
  };

  // Handle prioritizing an order
  const handlePrioritizeOrder = async (id) => {
    try {
      // In a real system, you would have a priority field in the Order model
      // For now, we'll just mark it as in-progress as a simple way to prioritize
      await api.updateOrderStatus(id, 'in-progress');
      fetchOrders();
      setSnackbar({
        open: true,
        message: 'Order prioritized',
        severity: 'success'
      });
    } catch (err) {
      setError('Failed to prioritize order');
      console.error(err);
    }
  };

  // Calculate wait time in minutes
  const calculateWaitTime = (orderTime) => {
    const orderDate = new Date(orderTime);
    const diffMs = currentTime - orderDate;
    return Math.floor(diffMs / (1000 * 60));
  };

  // Filter and sort orders
  const getFilteredSortedOrders = () => {
    // Start with all orders
    let filteredOrders = [...orders];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
    }
    
    // Apply type filter (if implemented in your order model)
    if (filterType !== 'all') {
      filteredOrders = filteredOrders.filter(order => {
        // Assuming order has items with categories
        return order.items && order.items.some(item => item.category === filterType);
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order => {
        // Search by order ID, token, or items
        const searchLower = searchTerm.toLowerCase();
        return (
          (order.id && order.id.toString().toLowerCase().includes(searchLower)) ||
          (order.token && order.token.toLowerCase().includes(searchLower)) ||
          (order.items && order.items.some(item => item.name.toLowerCase().includes(searchLower)))
        );
      });
    }
    
    // Sort orders
    filteredOrders.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'waitTime':
          comparison = calculateWaitTime(a.createdAt) - calculateWaitTime(b.createdAt);
          break;
        case 'price':
          comparison = (a.totalAmount || 0) - (b.totalAmount || 0);
          break;
        case 'counter':
          comparison = (a.counter || 0) - (b.counter || 0);
          break;
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filteredOrders;
  };

  // Get orders for the queue
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

  // Calculate queue statistics
  const getQueueStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const inProgressOrders = orders.filter(order => order.status === 'in-progress').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    
    // Calculate average wait time for completed orders
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
    
    // Calculate orders by category
    const categoryCount = {
      rice: 0,
      drinks: 0,
      snacks: 0,
      other: 0
    };
    
    orders.forEach(order => {
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          if (item.category) {
            if (categoryCount[item.category] !== undefined) {
              categoryCount[item.category]++;
            } else {
              categoryCount.other++;
            }
          } else {
            categoryCount.other++;
          }
        });
      }
    });
    
    // Calculate counters workload
    const counterWorkload = {};
    
    counters.forEach(counter => {
      counterWorkload[counter] = orders.filter(
        order => order.counter === counter && 
        (order.status === 'pending' || order.status === 'in-progress')
      ).length;
    });
    
    return {
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      cancelledOrders,
      avgWaitTime,
      categoryCount,
      counterWorkload
    };
  };

  const queueOrders = getQueueOrders();
  const filteredSortedOrders = getFilteredSortedOrders();
  const queueStats = getQueueStats();

  return (
    <Box>
      {/* Header section with actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Digital Queue
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<SettingsIcon />}
            onClick={() => setShowSettings(!showSettings)}
            sx={{ mr: 1 }}
          >
            Settings
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EqualizerIcon />}
            onClick={() => setShowAnalytics(!showAnalytics)}
            sx={{ mr: 1 }}
          >
            Analytics
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
            sx={{ mr: 1 }}
          >
            Refresh
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
      
      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Queue Settings</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Auto-refresh Interval</InputLabel>
                    <Select
                      value={refreshInterval}
                      label="Auto-refresh Interval"
                      onChange={(e) => setRefreshInterval(e.target.value)}
                    >
                      <MenuItem value={30000}>30 seconds</MenuItem>
                      <MenuItem value={60000}>1 minute</MenuItem>
                      <MenuItem value={300000}>5 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ mr: 2 }}>Active Counters:</Typography>
                    <ToggleButtonGroup
                      value={counters}
                      onChange={(e, newCounters) => {
                        if (newCounters.length > 0) setCounters(newCounters);
                      }}
                      aria-label="active counters"
                      size="small"
                    >
                      {[1, 2, 3, 4, 5].map((counter) => (
                        <ToggleButton 
                          key={counter} 
                          value={counter} 
                          aria-label={`Counter ${counter}`}
                        >
                          {counter}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Analytics panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Queue Analytics</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(e, newValue) => setTabValue(newValue)}
                  aria-label="analytics tabs"
                >
                  <Tab label="Overview" icon={<StackedBarChartIcon />} iconPosition="start" />
                  <Tab label="Counter Workload" icon={<PieChartIcon />} iconPosition="start" />
                </Tabs>
              </Box>
              
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={2}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }}
                    >
                      <Typography variant="h3">{queueStats.totalOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.1)
                      }}
                    >
                      <Typography variant="h3">{queueStats.pendingOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">Pending</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.1)
                      }}
                    >
                      <Typography variant="h3">{queueStats.inProgressOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">In Progress</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1)
                      }}
                    >
                      <Typography variant="h3">{queueStats.completedOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">Completed</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.error.main, 0.1)
                      }}
                    >
                      <Typography variant="h3">{queueStats.cancelledOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">Cancelled</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.1)
                      }}
                    >
                      <Typography variant="h3">{queueStats.avgWaitTime}</Typography>
                      <Typography variant="body2" color="text.secondary">Avg. Wait (min)</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
              
              {tabValue === 1 && (
                <Grid container spacing={2}>
                  {counters.map(counter => (
                    <Grid item xs={6} sm={4} md={3} key={counter}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>Counter {counter}</Typography>
                        <Box sx={{ position: 'relative', height: 30, bgcolor: alpha(theme.palette.grey[500], 0.2), borderRadius: 1 }}>
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: `${(queueStats.counterWorkload[counter] / Math.max(...Object.values(queueStats.counterWorkload), 1)) * 100}%`,
                              bgcolor: theme.palette.primary.main,
                              borderRadius: 1,
                              transition: 'width 0.5s ease'
                            }}
                          />
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold" color="white">
                              {queueStats.counterWorkload[counter]} orders
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Search Orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order ID, token, or item"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="rice">Rice</MenuItem>
                <MenuItem value="drinks">Drinks</MenuItem>
                <MenuItem value="snacks">Snacks</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="createdAt">Order Time</MenuItem>
                <MenuItem value="waitTime">Wait Time</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="counter">Counter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button 
              variant="outlined" 
              startIcon={sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowUpwardIcon sx={{ transform: 'rotate(180deg)' }} />}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              fullWidth
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Queue Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Active Queue
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : queueOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            No Active Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The queue is currently empty
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {queueOrders.map((order) => {
            const waitTime = calculateWaitTime(order.createdAt);
            return (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card 
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
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
                          Token #{order.id || order.token}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            size="small"
                            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            sx={{ 
                              bgcolor: alpha(getStatusColor(order.status), 0.1),
                              color: getStatusColor(order.status),
                              borderRadius: 1
                            }}
                          />
                          <Chip 
                            size="small"
                            label={`Counter ${order.counter || 1}`}
                            sx={{ 
                              bgcolor: alpha(theme.palette.grey[500], 0.1),
                              color: theme.palette.grey[700],
                              borderRadius: 1
                            }}
                          />
                        </Box>
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
                        {order.items && order.items.map((item, idx) => (
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
                        Rs {order.totalAmount || order.totalPrice}
                      </Typography>
                      
                      <Box>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOrderDialogOpen(true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {order.status !== 'completed' && order.status !== 'cancelled' && waitTime > 15 && (
                          <Tooltip title="This order is delayed">
                            <IconButton size="small" color="error">
                              <PriorityHighIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <Box sx={{ display: 'flex', borderTop: `1px solid ${theme.palette.divider}` }}>
                      {order.status === 'pending' && (
                        <Button
                          size="small"
                          startIcon={<PriorityHighIcon />}
                          onClick={() => handlePrioritizeOrder(order._id)}
                          sx={{ flex: 1, py: 1, borderRadius: 0 }}
                        >
                          Prioritize
                        </Button>
                      )}
                      
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleCompleteOrder(order._id)}
                        sx={{ 
                          flex: 2,
                          py: 1, 
                          borderRadius: 0,
                          borderBottomLeftRadius: order.status === 'pending' ? 0 : 2,
                          borderBottomRightRadius: 2
                        }}
                      >
                        Complete
                      </Button>
                    </Box>
                  )}
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
                  <Paper 
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DoneIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Token #{order.id || order.token}
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
      
      {/* Order details dialog */}
      <Dialog 
        open={orderDialogOpen} 
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details - Token #{selectedOrder.id || selectedOrder.token}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    sx={{ 
                      bgcolor: alpha(getStatusColor(selectedOrder.status), 0.1),
                      color: getStatusColor(selectedOrder.status)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Counter</Typography>
                  <Typography variant="body1">{selectedOrder.counter || 1}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Order Time</Typography>
                  <Typography variant="body1">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Wait Time</Typography>
                  <Typography variant="body1">{calculateWaitTime(selectedOrder.createdAt)} minutes</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Items</Typography>
                  <List dense>
                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                      <ListItem key={idx}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            {getCategoryIcon(item.category)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={item.name} 
                          secondary={`Rs ${item.price || 0}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
                    <Typography variant="h6">Rs {selectedOrder.totalAmount || selectedOrder.totalPrice}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <>
                  <FormControl size="small" sx={{ mr: 2 }}>
                    <InputLabel>Assign Counter</InputLabel>
                    <Select
                      value={selectedOrder.counter || 1}
                      label="Assign Counter"
                      onChange={(e) => handleChangeCounter(selectedOrder._id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      {counters.map(counter => (
                        <MenuItem key={counter} value={counter}>Counter {counter}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      label="Status"
                      onChange={(e) => handleChangeStatus(selectedOrder._id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
              <Button onClick={() => setOrderDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
    </Box>
  );
};

export default QueueManagement;
