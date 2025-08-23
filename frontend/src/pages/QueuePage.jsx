import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  alpha,
  Paper,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewListIcon from '@mui/icons-material/ViewList';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import { getOrders } from '../services/api';

// Constants
const AVG_TIME_PER_ORDER_MIN = 3; // Average time to process one order
const REFRESH_INTERVAL_MS = 15000; // Refresh queue every 15 seconds

// Helper to determine order type from items
const getOrderTypes = (items) => {
  if (!items || items.length === 0) return ['meal']; // Default
  const types = new Set(items.map(item => item.category || 'meal'));
  return Array.from(types);
};

// Helper to format date and time for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Using Colombo, Sri Lanka timezone
  return date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Colombo',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};


// Styled components
const QueueTrack = styled(Box)({
  display: 'flex',
  position: 'relative',
  minHeight: '40vh',
  padding: '32px 8px',
  alignItems: 'center',
  overflow: 'hidden',
  background: `linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(158, 158, 158, 0.05) 50%, rgba(244, 67, 54, 0.05) 100%)`,
  borderRadius: '16px',
  boxShadow: `inset 0 0 20px rgba(0, 0, 0, 0.03)`,
});

const RadarView = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '60vh',
  margin: '0 auto',
  background: `radial-gradient(circle, rgba(25, 118, 210, 0.03) 0%, rgba(220, 0, 78, 0.05) 50%, rgba(255, 152, 0, 0.07) 100%)`,
  borderRadius: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});

const TokenCard = styled(motion(Paper))(({ status, isUser, orderType = [] }) => {
  let glowColor = '#1976d2'; // Default Blue
  if (orderType.includes('rice')) glowColor = '#ff9800'; // Orange
  else if (orderType.includes('drinks')) glowColor = '#2196f3'; // Blue
  else if (orderType.includes('snacks')) glowColor = '#dc004e'; // Pink

  return {
    padding: '16px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: isUser ? `0 0 25px rgba(255, 152, 0, 0.6)` : status === 'active' ? `0 0 20px ${alpha(glowColor, 0.5)}` : `0 8px 16px rgba(0, 0, 0, 0.1)`,
    border: isUser ? `2px solid #ff9800` : status === 'active' ? `2px solid ${glowColor}` : `1px solid ${alpha(glowColor, 0.3)}`,
    position: 'relative',
    width: 220,
    minHeight: 240,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: isUser ? 10 : status === 'active' ? 5 : 1,
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: `0 12px 20px rgba(0, 0, 0, 0.15)`,
    },
  };
});

const UserTokenCard = styled(Paper)({
  padding: '24px',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: `0 8px 32px rgba(255, 152, 0, 0.2)`,
  border: `2px solid #ff9800`,
  position: 'relative',
  marginBottom: '32px',
  overflow: 'hidden',
});

const getTypeIcon = (type) => {
  switch (type) {
    case 'rice': return '🍛';
    case 'drinks': return '🥤';
    case 'snacks': return '🥟';
    default: return '🍽️';
  }
};

const QueuePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('track');
  const [userOrder, setUserOrder] = useState(() => {
    try {
      const savedOrder = localStorage.getItem('userOrder');
      return savedOrder ? JSON.parse(savedOrder) : null;
    } catch (err) {
      return null;
    }
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getOrders();
      const sortedData = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const processedOrders = sortedData.map((order, index) => ({
        ...order,
        id: order.token,
        status: order.status || 'queued',
        type: getOrderTypes(order.items),
        position: index + 1,
      }));

      setOrders(processedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load queue. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userOrder]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    if (location.state?.newOrder) {
      const newOrderData = location.state.newOrder;
      const orderToStore = { orderId: newOrderData._id, token: newOrderData.token };
      localStorage.setItem('userOrder', JSON.stringify(orderToStore));
      setUserOrder(orderToStore);
      setSnackbar({
        open: true,
        message: `Order placed successfully! Your token is #${newOrderData.token}`,
        severity: 'success',
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const activeUserOrder = useMemo(() => {
    if (!userOrder) return null;
    const foundOrder = orders.find(order => order._id === userOrder.orderId);
    return foundOrder || { ...userOrder, id: userOrder.token, status: 'served', type: [] };
  }, [orders, userOrder]);

  const estimatedWaitTime = useMemo(() => {
    if (!activeUserOrder || activeUserOrder.status !== 'queued') return 0;
    return (activeUserOrder.position - 1) * AVG_TIME_PER_ORDER_MIN;
  }, [activeUserOrder]);
  
  const progressPercentage = useMemo(() => {
      if (!activeUserOrder) return 0;
      if (activeUserOrder.status === 'active' || activeUserOrder.status === 'served') return 100;

      const activeOrderIndex = orders.findIndex(o => o.status === 'active');
      if (activeOrderIndex === -1) return 0; // No active order yet

      const totalQueued = orders.length - (activeOrderIndex + 1);
      const userQueuedPosition = activeUserOrder.position - (activeOrderIndex + 1);

      if (totalQueued <= 0) return 100;
      
      return ((totalQueued - userQueuedPosition) / totalQueued) * 100;

  }, [activeUserOrder, orders]);


  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) setViewMode(newMode);
  };
  
  const getRadarPosition = (order, index, total) => {
    let distance = 0;
    if (order.status === 'active') {
        distance = 0;
    } else if (order.status === 'queued') {
        const activeCount = orders.filter(o => o.status === 'active').length;
        const maxPosition = total - activeCount;
        distance = ((order.position - activeCount) / maxPosition) * 40;
    } else {
        return { x: 0, y: 0, opacity: 0, scale: 0 };
    }
    
    const angle = (index * (360 / total)) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 1,
      scale: order.status === 'active' ? 1.2 : 1,
    };
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (loading && orders.length === 0) {
    return (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>);
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: '32px', textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={fetchOrders} sx={{ mt: 2 }}>Retry</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: '32px' }}>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '32px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: '16px' }}>Back</Button>
          <Typography variant="h4" component="h1">Digital Queue</Typography>
        </Box>
        <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewModeChange}>
          <ToggleButton value="track" aria-label="track view"><ViewListIcon /></ToggleButton>
          <ToggleButton value="radar" aria-label="radar view"><DonutLargeIcon /></ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {activeUserOrder && (
        <UserTokenCard elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="overline" color="text.secondary">YOUR TOKEN</Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: '8px' }}>#{activeUserOrder.id}</Typography>
              <Box sx={{ display: 'flex', gap: '16px', mt: '16px', flexWrap: 'wrap' }}>
                <Chip icon={<AccessTimeIcon />} label={`${estimatedWaitTime} min wait`} variant="outlined" sx={{ borderColor: '#1976d2', color: '#1976d2', '& .MuiChip-icon': { color: '#1976d2' } }}/>
                <Chip icon={<PlaceIcon />} label={`Counter ${activeUserOrder.counter || 1}`} variant="outlined" sx={{ borderColor: '#dc004e', color: '#dc004e', '& .MuiChip-icon': { color: '#dc004e' } }}/>
                {activeUserOrder.type.length > 0 && <Chip icon={<LocalDiningIcon />} label={activeUserOrder.type.map(t => getTypeIcon(t)).join(' ')} variant="outlined"/>}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', p: '16px', bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {activeUserOrder.status === 'active' ? (<Box component="span" sx={{ color: '#4caf50' }}>NOW SERVING</Box>) 
                : activeUserOrder.status === 'served' ? (<Box component="span" sx={{ color: '#9e9e9e' }}>SERVED</Box>)
                : `Position: ${activeUserOrder.position}`}
              </Typography>
              {estimatedWaitTime > 0 && estimatedWaitTime <= 5 && (
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '8px', p: '8px', bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: '4px', color: '#f57c00' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>🚶 Time to head over</Typography>
                 </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ mt: '24px', position: 'relative', height: 8, bgcolor: 'rgba(224, 224, 224, 0.3)', borderRadius: '16px' }}>
             <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
              style={{ height: '100%', borderRadius: '16px', background: `linear-gradient(to right, #1976d2, #ff9800)`, position: 'absolute', left: 0, top: 0 }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '8px' }}>
            <Typography variant="caption" color="text.secondary">Order Placed</Typography>
            <Typography variant="caption" color="text.secondary">Ready for Pickup</Typography>
          </Box>
        </UserTokenCard>
      )}
      
      {viewMode === 'track' ? (
        <QueueTrack>
          <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center', width: '100%', overflowX: 'auto', py: '24px', px: '16px', '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-track': { background: 'rgba(0, 0, 0, 0.05)', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(25, 118, 210, 0.2)', borderRadius: '10px' } }}>
            <AnimatePresence>
              {orders.map((order, index) => (
                <TokenCard key={order._id} status={order.status} isUser={order.isUser} orderType={order.type} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0, scale: order.status === 'active' ? 1.1 : 1 }} exit={{ opacity: 0, x: -100, scale: 0.5 }} transition={{ duration: 0.5, delay: index * 0.05 }} whileHover={{ y: -10, scale: 1.05 }}>
                  <Typography variant="h3" sx={{ mb: '4px', fontWeight: 'bold', fontSize: '1.8rem' }}>#{order.id}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><PlaceIcon color="action" fontSize="small" /><Typography variant="body2" color="text.secondary">Counter {order.counter}</Typography></Box>
                  <Box sx={{ p: '6px 8px', bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: '6px', mb: '8px', borderLeft: '3px solid #1976d2' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon color="primary" fontSize="small" />
                      <Box><Typography variant="caption" color="text.secondary" display="block">Pickup Time</Typography><Typography variant="body2" fontWeight="medium">{order.scheduledTime ? formatDate(order.scheduledTime) : 'ASAP'}</Typography></Box>
                    </Box>
                  </Box>
                  {order.status === 'active' ? (
                    <Chip icon={<motion.div animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }} />} label="Now Serving" color="success" size="small" sx={{ mb: '8px' }} />
                  ) : (
                    <Chip label={`Position: ${order.position}`} variant="outlined" size="small" sx={{ mb: '8px' }} />
                  )}
                  <Box sx={{ display: 'flex', gap: '6px', mt: 'auto', pt: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {order.type.map(t => (<Chip key={t} label={t} size="small" sx={{ fontSize: '0.7rem', height: 24, '& .MuiChip-label': { px: 1 } }} />))}
                  </Box>
                  {order.isUser && (<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: '50%', background: '#ff9800' }}/>)}
                </TokenCard>
              ))}
            </AnimatePresence>
          </Box>
        </QueueTrack>
      ) : (
        <RadarView>
          {[1, 2, 3].map((circle) => (<Box key={circle} component={motion.div} sx={{ position: 'absolute', width: `${circle * 25}%`, height: `${circle * 25}%`, borderRadius: '50%', border: `1px solid rgba(25, 118, 210, 0.1)`, pointerEvents: 'none' }} animate={{ rotate: 360 }} transition={{ duration: 20 + circle * 10, ease: 'linear', repeat: Infinity }}/>))}
          <motion.div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(25, 118, 210, 0.8)', position: 'absolute', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }} animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>NOW</motion.div>
          <AnimatePresence>
            {orders.map((order, index) => {
              const position = getRadarPosition(order, index, orders.length);
              return (
                <TokenCard key={order._id} status={order.status} isUser={order.isUser} orderType={order.type} initial={{ opacity: 0 }} animate={{ x: `${position.x}vw`, y: `${position.y}vw`, opacity: position.opacity, scale: position.scale }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.8 }} sx={{ position: 'absolute', transform: 'translate(-50%, -50%)', width: 160, minHeight: 180 }}>
                    <Typography variant="h4" sx={{ mb: '8px', fontWeight: 'bold' }}>#{order.id}</Typography>
                    <Typography variant="body1" sx={{ mb: '8px' }}>Counter {order.counter}</Typography>
                    {order.status === 'active' && (<Chip label="Serving" color="success" size="small" />)}
                    <Box sx={{ display: 'flex', gap: '8px', mt: '8px' }}>
                        {order.type.map(t => <Typography key={t} variant="h6">{getTypeIcon(t)}</Typography>)}
                    </Box>
                    {order.isUser && (<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: '50%', background: '#ff9800' }}/>)}
                </TokenCard>
              );
            })}
          </AnimatePresence>
        </RadarView>
      )}
      
      <Box sx={{ mt: '32px', p: '24px', bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px' }}>
        <Typography variant="body1" gutterBottom><strong>How the Queue Works:</strong></Typography>
        <Typography variant="body2" sx={{ mb: '16px', color: 'rgba(0, 0, 0, 0.6)' }}>• Orders are processed on a first-come, first-served basis unless a specific pickup time is scheduled.</Typography>
        <Typography variant="body2" sx={{ mb: '16px', color: 'rgba(0, 0, 0, 0.6)' }}>• Your estimated wait time is based on your position in the queue for immediate ("ASAP") orders.</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>• Keep an eye on your token! It will be highlighted when your order is being prepared.</Typography>
      </Box>
    </Container>
  );
};

export default QueuePage;