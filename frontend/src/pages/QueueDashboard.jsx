import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Tabs, 
  Tab, 
  alpha, 
  useTheme,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TokenCardAdmin from '../components/TokenCardAdmin';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock data for testing - will be replaced with API calls
const initialTokens = [
  { id: 'A101', counter: 1, timeRemaining: 0, status: 'served', type: ['rice'], timestamp: new Date(Date.now() - 300000) },
  { id: 'A102', counter: 2, timeRemaining: 0, status: 'served', type: ['drinks', 'snacks'], timestamp: new Date(Date.now() - 180000) },
  { id: 'A103', counter: 1, timeRemaining: 0, status: 'active', type: ['rice', 'drinks'], timestamp: new Date(Date.now() - 120000) },
  { id: 'A104', counter: 2, timeRemaining: 3, status: 'queued', type: ['snacks'], timestamp: new Date(Date.now() - 60000) },
  { id: 'A105', counter: 1, timeRemaining: 6, status: 'queued', type: ['rice'], timestamp: new Date(Date.now() - 30000) },
  { id: 'A106', counter: 2, timeRemaining: 9, status: 'queued', type: ['rice', 'drinks'], timestamp: new Date() },
  { id: 'A107', counter: 1, timeRemaining: 12, status: 'queued', type: ['drinks'], timestamp: new Date(Date.now() + 30000) },
  { id: 'A108', counter: 2, timeRemaining: 15, status: 'queued', type: ['rice', 'snacks'], timestamp: new Date(Date.now() + 60000) },
];

const QueueDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(initialTokens);
  const [tabValue, setTabValue] = useState(0);
  const [counters, setCounters] = useState([1, 2]); // Available counters
  const [stats, setStats] = useState({
    totalServed: 0,
    avgWaitTime: 0,
    pendingOrders: 0
  });
  
  // Filter tokens based on selected tab
  const getFilteredTokens = () => {
    switch (tabValue) {
      case 0: // All
        return tokens.filter(t => t.status !== 'served');
      case 1: // Active
        return tokens.filter(t => t.status === 'active');
      case 2: // Upcoming
        return tokens.filter(t => t.status === 'queued');
      case 3: // Completed
        return tokens.filter(t => t.status === 'served').slice(0, 10); // Show only last 10 served
      default:
        return tokens;
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle marking a token as ready/served
  const handleMarkReady = (tokenId) => {
    setTokens(prev => {
      const updated = prev.map(token => {
        if (token.id === tokenId) {
          return { ...token, status: 'served' };
        }
        return token;
      });
      
      // Find next token to make active
      const nextInQueue = updated.find(t => t.status === 'queued');
      if (nextInQueue) {
        return updated.map(token => {
          if (token.id === nextInQueue.id) {
            return { ...token, status: 'active', timeRemaining: 0 };
          }
          return token;
        });
      }
      
      return updated;
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalServed: prev.totalServed + 1
    }));
  };
  
  // Update tokens every minute to simulate time passing
  useEffect(() => {
    const timer = setInterval(() => {
      setTokens(prevTokens => {
        return prevTokens.map(token => {
          if (token.status === 'queued') {
            return {
              ...token,
              timeRemaining: Math.max(0, token.timeRemaining - 1)
            };
          }
          return token;
        });
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Simulate new orders coming in
  useEffect(() => {
    const addNewToken = setInterval(() => {
      const lastToken = tokens[tokens.length - 1];
      const newTokenId = 'A' + (parseInt(lastToken.id.substring(1)) + 1);
      
      // Add new token to queue
      setTokens(prev => [
        ...prev,
        { 
          id: newTokenId, 
          counter: Math.random() > 0.5 ? 1 : 2,
          timeRemaining: 15 + Math.floor(Math.random() * 10),
          status: 'queued',
          type: ['rice', 'drinks', 'snacks'].filter(() => Math.random() > 0.5),
          timestamp: new Date()
        }
      ]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingOrders: prev.pendingOrders + 1
      }));
    }, 120000); // Add new token every 2 minutes
    
    return () => clearInterval(addNewToken);
  }, [tokens]);
  
  // Update stats
  useEffect(() => {
    const served = tokens.filter(t => t.status === 'served');
    const pending = tokens.filter(t => t.status !== 'served');
    
    // Calculate average wait time
    const waitTimes = served.map(token => {
      const orderTime = token.timestamp.getTime();
      const now = Date.now();
      return Math.floor((now - orderTime) / 60000); // In minutes
    });
    
    const avgWait = waitTimes.length > 0
      ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length
      : 0;
    
    setStats({
      totalServed: served.length,
      avgWaitTime: Math.round(avgWait),
      pendingOrders: pending.length
    });
  }, [tokens]);
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Canteen Queue Dashboard
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/queue')}
        >
          View Customer Queue
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage token orders and view real-time queue status
      </Typography>
      
      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card 
            component={motion.div}
            whileHover={{ y: -5 }}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Orders
              </Typography>
              <Typography variant="h3" component="div">
                {stats.pendingOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Orders in queue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card 
            component={motion.div}
            whileHover={{ y: -5 }}
            sx={{ 
              bgcolor: alpha(theme.palette.success.main, 0.05),
              borderLeft: `4px solid ${theme.palette.success.main}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completed Today
              </Typography>
              <Typography variant="h3" component="div">
                {stats.totalServed}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Orders served
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card 
            component={motion.div}
            whileHover={{ y: -5 }}
            sx={{ 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              borderLeft: `4px solid ${theme.palette.info.main}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Wait Time
              </Typography>
              <Typography variant="h3" component="div">
                {stats.avgWaitTime} min
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                From order to pickup
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filter tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="queue tabs">
          <Tab label="All Orders" />
          <Tab label="Active" />
          <Tab label="Upcoming" />
          <Tab label="Completed" />
        </Tabs>
      </Box>
      
      {/* Token grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {getFilteredTokens().map(token => (
            <Grid 
              item 
              key={token.id} 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3}
              component={motion.div}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <TokenCardAdmin 
                token={token} 
                onMarkReady={handleMarkReady} 
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
      
      {/* Empty state */}
      {getFilteredTokens().length === 0 && (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            borderRadius: theme.shape.borderRadius * 2,
            mt: 2
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tabValue === 3 
              ? 'No completed orders to display' 
              : 'The queue is currently empty'}
          </Typography>
        </Box>
      )}
      
      {/* Counter management */}
      <Box sx={{ mt: 6, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Counter Management
        </Typography>
        <Grid container spacing={2}>
          {counters.map(counter => (
            <Grid item key={counter}>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mr: 1 }}
              >
                Counter {counter}
              </Button>
            </Grid>
          ))}
          <Grid item>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => setCounters(prev => [...prev, prev.length + 1])}
            >
              + Add Counter
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default QueueDashboard;
