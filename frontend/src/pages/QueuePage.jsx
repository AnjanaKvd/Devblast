import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  alpha, 
  Paper, 
  Button, 
  Chip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewListIcon from '@mui/icons-material/ViewList';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

// Mock data for testing - will be replaced with API calls
const mockTokens = [
  { id: 'A101', counter: 1, timeRemaining: 0, status: 'served', type: ['rice'], timestamp: new Date(Date.now() - 300000) },
  { id: 'A102', counter: 2, timeRemaining: 0, status: 'served', type: ['drinks', 'snacks'], timestamp: new Date(Date.now() - 180000) },
  { id: 'A103', counter: 1, timeRemaining: 0, status: 'active', type: ['rice', 'drinks'], timestamp: new Date(Date.now() - 120000) },
  { id: 'A104', counter: 2, timeRemaining: 3, status: 'queued', type: ['snacks'], timestamp: new Date(Date.now() - 60000) },
  { id: 'A105', counter: 1, timeRemaining: 6, status: 'queued', type: ['rice'], timestamp: new Date(Date.now() - 30000) },
  { id: 'A106', counter: 2, timeRemaining: 9, status: 'queued', type: ['rice', 'drinks'], timestamp: new Date(), isUser: true },
  { id: 'A107', counter: 1, timeRemaining: 12, status: 'queued', type: ['drinks'], timestamp: new Date(Date.now() + 30000) },
  { id: 'A108', counter: 2, timeRemaining: 15, status: 'queued', type: ['rice', 'snacks'], timestamp: new Date(Date.now() + 60000) },
];

// Styled components
const QueueTrack = styled(Box)({
  display: 'flex',
  position: 'relative',
  minHeight: '40vh',
  padding: '32px 8px',
  alignItems: 'center',
  overflow: 'hidden',
  background: `linear-gradient(135deg, 
    rgba(25, 118, 210, 0.05) 0%, 
    rgba(158, 158, 158, 0.05) 50%, 
    rgba(244, 67, 54, 0.05) 100%)`,
  borderRadius: '16px',
  boxShadow: `inset 0 0 20px rgba(0, 0, 0, 0.03)`,
});

const RadarView = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '60vh',
  margin: '0 auto',
  background: `radial-gradient(circle, 
    rgba(25, 118, 210, 0.03) 0%, 
    rgba(220, 0, 78, 0.05) 50%, 
    rgba(255, 152, 0, 0.07) 100%)`,
  borderRadius: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});

const TokenCard = styled(motion(Paper))(({ status, isUser, type }) => {
  let glowColor = '#1976d2'; // Default: Primary Blue
  
  if (type.includes('rice')) {
    glowColor = '#ff9800'; // Orange/Yellow for Warning
  } else if (type.includes('drinks')) {
    glowColor = '#2196f3'; // Teal/Blue for Info
  } else if (type.includes('snacks')) {
    glowColor = '#dc004e'; // Pink/Purple for Secondary
  }
  
  return {
    padding: '24px',
    borderRadius: '16px',
    backdropFilter: 'blur(8px)',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: isUser 
      ? `0 0 25px rgba(255, 152, 0, 0.6)`
      : status === 'active'
        ? `0 0 20px ${alpha(glowColor, 0.5)}`
        : `0 8px 16px rgba(0, 0, 0, 0.1)`,
    border: isUser 
      ? `2px solid #ff9800`
      : status === 'active'
        ? `2px solid ${glowColor}`
        : `1px solid ${alpha(glowColor, 0.3)}`,
    position: 'relative',
    width: 180,
    height: 200,
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

const ProgressBar = styled(Box)(({ progress }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: 4,
  width: `${progress}%`,
  background: `linear-gradient(to right, #1976d2, #ff9800)`,
  transition: 'width 1s ease-in-out',
}));

// Type icon mapping
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
  const [tokens, setTokens] = useState(mockTokens);
  const [viewMode, setViewMode] = useState('track'); // 'track' or 'radar'
  const [userToken, setUserToken] = useState(null);
  
  // Find the user's token
  useEffect(() => {
    const foundUserToken = tokens.find(token => token.isUser);
    if (foundUserToken) {
      setUserToken(foundUserToken);
    }
  }, [tokens]);
  
  // Update tokens every minute to simulate time passing
  useEffect(() => {
    const timer = setInterval(() => {
      setTokens(prevTokens => {
        const updated = prevTokens.map(token => ({
          ...token,
          timeRemaining: Math.max(0, token.timeRemaining - 1)
        }));
        
        // Move an active token to served and first queued token to active
        const activeIndex = updated.findIndex(t => t.status === 'active');
        if (activeIndex !== -1) {
          // 20% chance of serving the active token each minute
          if (Math.random() < 0.2) {
            updated[activeIndex].status = 'served';
            
            // Find the first queued token
            const nextActiveIndex = updated.findIndex(t => t.status === 'queued');
            if (nextActiveIndex !== -1) {
              updated[nextActiveIndex].status = 'active';
              updated[nextActiveIndex].timeRemaining = 0;
            }
          }
        }
        
        return updated;
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Effect to simulate notifications when user's token is approaching
  useEffect(() => {
    if (userToken && userToken.timeRemaining <= 15 && userToken.timeRemaining > 0) {
      // This would be a notification in a real app
      console.log('Your token will be ready soon! Time to walk to the canteen.');
      
      // In a real app, you'd use the Notification API:
      // if (Notification.permission === 'granted') {
      //   new Notification('Your food will be ready soon!', {
      //     body: 'Time to walk to the canteen.',
      //     icon: '/notification-icon.png'
      //   });
      // }
    }
  }, [userToken]);

  // Simulate tokens being added to the queue
  useEffect(() => {
    const addNewToken = setInterval(() => {
      const lastToken = tokens[tokens.length - 1];
      const newTokenId = 'A' + (parseInt(lastToken.id.substring(1)) + 1);
      
      setTokens(prev => [
        ...prev.filter(t => t.status !== 'served'), // Remove served tokens
        { 
          id: newTokenId, 
          counter: Math.random() > 0.5 ? 1 : 2,
          timeRemaining: 15 + Math.floor(Math.random() * 10),
          status: 'queued',
          type: ['rice', 'drinks', 'snacks'].filter(() => Math.random() > 0.5),
          timestamp: new Date(Date.now() + tokens.length * 30000)
        }
      ]);
    }, 120000); // Add new token every 2 minutes
    
    return () => clearInterval(addNewToken);
  }, [tokens]);

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Calculate positions for radar view
  const getRadarPosition = (token, index, total) => {
    // Calculate distance from center (0-100%)
    let distance;
    
    if (token.status === 'active') {
      distance = 0; // Center
    } else if (token.status === 'served') {
      return { x: 0, y: 0, opacity: 0, scale: 0 }; // Hidden
    } else {
      // Calculate based on time remaining - closer tokens are closer to center
      const maxTime = Math.max(...tokens.filter(t => t.status === 'queued').map(t => t.timeRemaining));
      distance = (token.timeRemaining / maxTime) * 40; // % of viewport width
    }
    
    // Calculate angle - distribute tokens in a circle
    const angle = (index * (360 / total)) * (Math.PI / 180);
    
    // Convert to x, y coordinates
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 1,
      scale: token.status === 'active' ? 1.2 : 1
    };
  };

  // Calculate the user's position in queue
  const getUserPosition = () => {
    if (!userToken) return null;
    
    const activeTokens = tokens.filter(t => t.status === 'active');
    const queuedTokensBefore = tokens.filter(
      t => t.status === 'queued' && 
      new Date(t.timestamp) < new Date(userToken.timestamp)
    );
    
    return queuedTokensBefore.length + activeTokens.length;
  };

  // Calculate estimated wait time
  const getEstimatedWaitTime = () => {
    if (!userToken) return 0;
    return userToken.timeRemaining;
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!userToken) return 0;
    
    const initialWaitTime = 15; // Assuming max wait time is 15 minutes
    const remainingTime = userToken.timeRemaining;
    
    return Math.max(0, Math.min(100, ((initialWaitTime - remainingTime) / initialWaitTime) * 100));
  };

  return (
    <Container maxWidth="lg" sx={{ py: '32px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '32px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mr: '16px' }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Digital Queue
          </Typography>
        </Box>
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
        >
          <ToggleButton value="track" aria-label="track view">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="radar" aria-label="radar view">
            <DonutLargeIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* User's current token info */}
      {userToken && (
        <UserTokenCard elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="overline" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                YOUR TOKEN
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: '8px' }}>
                #{userToken.id}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: '16px', mt: '16px' }}>
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label={`${getEstimatedWaitTime()} min wait`}
                  variant="outlined"
                  sx={{ borderColor: '#1976d2', color: '#1976d2', '& .MuiChip-icon': { color: '#1976d2' } }}
                />
                
                <Chip 
                  icon={<PlaceIcon />} 
                  label={`Counter ${userToken.counter}`}
                  variant="outlined"
                  sx={{ borderColor: '#dc004e', color: '#dc004e', '& .MuiChip-icon': { color: '#dc004e' } }}
                />
                
                <Chip 
                  icon={<LocalDiningIcon />} 
                  label={userToken.type.map(t => getTypeIcon(t)).join(' ')}
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center', p: '16px', bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {userToken.status === 'active' ? (
                  <Box component="span" sx={{ color: '#4caf50' }}>
                    NOW SERVING
                  </Box>
                ) : (
                  `Position: ${getUserPosition()}`
                )}
              </Typography>
              
              {userToken.timeRemaining <= 15 && userToken.status !== 'active' && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: '8px',
                  p: '8px',
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  borderRadius: '4px',
                  color: '#f57c00'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    🚶 Time to walk to canteen
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box sx={{ mt: '24px', position: 'relative', height: 8, bgcolor: 'rgba(224, 224, 224, 0.3)', borderRadius: '16px' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1 }}
              style={{
                height: '100%',
                borderRadius: '16px',
                background: `linear-gradient(to right, #1976d2, #ff9800)`,
                position: 'absolute',
                left: 0,
                top: 0
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '8px' }}>
            <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Order Placed</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Ready for Pickup</Typography>
          </Box>
          
          <ProgressBar progress={getProgressPercentage()} />
        </UserTokenCard>
      )}
      
      {/* Queue visualization */}
      {viewMode === 'track' ? (
        <QueueTrack>
          <Box sx={{ 
            display: 'flex', 
            gap: '24px', 
            alignItems: 'center', 
            width: '100%', 
            overflowX: 'auto',
            py: '24px',
            px: '16px',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(25, 118, 210, 0.2)',
              borderRadius: '10px',
            }
          }}>
            <AnimatePresence>
              {tokens
                .filter(token => token.status !== 'served')
                .map((token, index) => (
                  <TokenCard
                    key={token.id}
                    component={motion.div}
                    status={token.status}
                    isUser={token.isUser}
                    type={token.type}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: token.status === 'active' ? 1.1 : 1,
                    }}
                    exit={{ opacity: 0, x: -100, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Typography variant="h3" sx={{ mb: '8px', fontWeight: 'bold' }}>
                      #{token.id}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: '8px' }}>
                      Counter {token.counter}
                    </Typography>
                    
                    {token.status === 'active' ? (
                      <Box sx={{ 
                        p: '8px', 
                        bgcolor: 'rgba(76, 175, 80, 0.1)', 
                        color: '#4caf50',
                        borderRadius: '4px',
                        mb: '8px' 
                      }}>
                        <Typography variant="body2" fontWeight="bold">
                          ⚡ Now Serving
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ mb: '8px' }}>
                        {token.timeRemaining > 0 
                          ? `Ready in ${token.timeRemaining} min` 
                          : 'Processing...'}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: '8px', mt: '8px' }}>
                      {token.type.map(type => (
                        <Typography key={type} variant="h6">
                          {getTypeIcon(type)}
                        </Typography>
                      ))}
                    </Box>
                    
                    {token.isUser && token.timeRemaining <= 15 && token.status !== 'active' && (
                      <Box sx={{ 
                        position: 'absolute',
                        bottom: 10,
                        p: '4px', 
                        bgcolor: 'rgba(255, 152, 0, 0.2)',
                        color: '#ff9800',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        🚶 Walk to Canteen
                      </Box>
                    )}
                    
                    {/* Progress indicator */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '16px',
                      pointerEvents: 'none',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${(1 - (token.timeRemaining / 15)) * 100}%`,
                        background: `linear-gradient(to top, rgba(76, 175, 80, 0.1), transparent)`,
                        transition: 'height 1s ease-in-out'
                      }} />
                    </Box>
                    
                    {/* User indicator dot */}
                    {token.isUser && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#ff9800',
                        }}
                      />
                    )}
                  </TokenCard>
                ))}
            </AnimatePresence>
          </Box>
        </QueueTrack>
      ) : (
        <RadarView>
          {/* Radar background circles */}
          {[1, 2, 3].map((circle) => (
            <Box
              key={circle}
              component={motion.div}
              sx={{
                position: 'absolute',
                width: `${circle * 25}%`,
                height: `${circle * 25}%`,
                borderRadius: '50%',
                border: `1px solid rgba(25, 118, 210, 0.1)`,
                pointerEvents: 'none'
              }}
              animate={{ 
                rotate: [0, 360],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 20 + circle * 5, 
                ease: 'linear', 
                repeat: Infinity,
                repeatType: 'loop'
              }}
            />
          ))}
          
          {/* Center point */}
          <motion.div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(25, 118, 210, 0.8)',
              position: 'absolute',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold'
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            NOW
          </motion.div>
          
          {/* Token cards on the radar */}
          <AnimatePresence>
            {tokens
              .filter(token => token.status !== 'served')
              .map((token, index, array) => {
                const position = getRadarPosition(token, index, array.length);
                
                return (
                  <TokenCard
                    key={token.id}
                    component={motion.div}
                    status={token.status}
                    isUser={token.isUser}
                    type={token.type}
                    initial={{ opacity: 0 }}
                    animate={{
                      x: `${position.x}vw`,
                      y: `${position.y}vw`,
                      opacity: position.opacity,
                      scale: position.scale,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.8 }}
                    sx={{
                      position: 'absolute',
                      transform: 'translate(-50%, -50%)',
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Typography variant="h3" sx={{ mb: '8px', fontWeight: 'bold' }}>
                      #{token.id}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: '8px' }}>
                      Counter {token.counter}
                    </Typography>
                    
                    {token.status === 'active' ? (
                      <Box sx={{ 
                        p: '8px', 
                        bgcolor: 'rgba(76, 175, 80, 0.1)', 
                        color: '#4caf50',
                        borderRadius: '4px',
                        mb: '8px' 
                      }}>
                        <Typography variant="body2" fontWeight="bold">
                          ⚡ Now Serving
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ mb: '8px' }}>
                        {token.timeRemaining > 0 
                          ? `Ready in ${token.timeRemaining} min` 
                          : 'Processing...'}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: '8px', mt: '8px' }}>
                      {token.type.map(type => (
                        <Typography key={type} variant="h6">
                          {getTypeIcon(type)}
                        </Typography>
                      ))}
                    </Box>
                    
                    {token.isUser && token.timeRemaining <= 15 && (
                      <Box sx={{ 
                        position: 'absolute',
                        bottom: 10,
                        p: '4px', 
                        bgcolor: 'rgba(255, 152, 0, 0.2)',
                        color: '#ff9800',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        🚶 Walk to Canteen
                      </Box>
                    )}
                    
                    {token.isUser && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#ff9800',
                        }}
                      />
                    )}
                  </TokenCard>
                );
              })}
          </AnimatePresence>
          
          {/* Scanning line animation */}
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: 2,
              background: `linear-gradient(to right, transparent, rgba(25, 118, 210, 0.5), transparent)`,
              zIndex: 1
            }}
            animate={{ 
              y: ['-50%', '50%'],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, repeatType: 'reverse' },
              opacity: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
            }}
          />
        </RadarView>
      )}
      
      <Box sx={{ mt: '32px', p: '24px', bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px' }}>
        <Typography variant="body1" gutterBottom>
          <strong>How the Queue Works:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: '16px', color: 'rgba(0, 0, 0, 0.6)' }}>
          • Orders are processed based on their order time.
        </Typography>
        <Typography variant="body2" sx={{ mb: '16px', color: 'rgba(0, 0, 0, 0.6)' }}>
          • You'll receive a notification when your order is nearly ready.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
          • Your token will be highlighted when it's your turn to pick up your order.
        </Typography>
      </Box>
    </Container>
  );
};

export default QueuePage;