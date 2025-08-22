import React, { useEffect } from 'react';
import { Box, Typography, Paper, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';

// Type icon mapping
const getTypeIcon = (type) => {
  switch (type) {
    case 'rice': return '🍛';
    case 'drinks': return '🥤';
    case 'snacks': return '🥟';
    default: return '🍽️';
  }
};

const StyledTokenCard = styled(motion(Paper))(({ theme, status, isUser, type = [] }) => {
  let glowColor = theme.palette.primary.main;
  
  if (type.includes('rice')) {
    glowColor = theme.palette.warning.main; // Orange/Yellow
  } else if (type.includes('drinks')) {
    glowColor = theme.palette.info.main; // Teal/Blue
  } else if (type.includes('snacks')) {
    glowColor = theme.palette.secondary.main; // Pink/Purple
  }
  
  return {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(8px)',
    background: alpha(theme.palette.background.paper, 0.7),
    boxShadow: isUser 
      ? `0 0 25px ${alpha(theme.palette.warning.main, 0.6)}`
      : status === 'active'
        ? `0 0 20px ${alpha(glowColor, 0.5)}`
        : `0 8px 16px ${alpha(theme.palette.common.black, 0.1)}`,
    border: isUser 
      ? `2px solid ${theme.palette.warning.main}`
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
  };
});

const TokenCard = ({ token, index }) => {
  const theme = useTheme();
  
  // Pulse effect for user token when close to being served
  useEffect(() => {
    if (token.isUser && token.timeRemaining <= 5) {
      // In a real app, this would be a notification
      console.log('Your token is almost ready!');
    }
  }, [token]);

  return (
    <StyledTokenCard
      status={token.status}
      isUser={token.isUser}
      type={token.type}
      whileHover={{ y: -5, scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: token.status === 'active' ? 1.1 : 1,
        transition: { delay: index * 0.1 }
      }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
    >
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
        #{token.id}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 1 }}>
        Counter {token.counter}
      </Typography>
      
      {token.status === 'active' ? (
        <Box sx={{ 
          p: 1, 
          bgcolor: alpha(theme.palette.success.main, 0.1), 
          color: theme.palette.success.main,
          borderRadius: 1,
          mb: 1 
        }}>
          <Typography variant="body2" fontWeight="bold">
            ⚡ Now Serving
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {token.timeRemaining > 0 
            ? `Ready in ${token.timeRemaining} min` 
            : 'Processing...'}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
          p: 0.5, 
          bgcolor: alpha(theme.palette.warning.main, 0.2),
          color: theme.palette.warning.main,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          🚶 Walk to Canteen
        </Box>
      )}
      
      {/* Circular progress indicator */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: theme.shape.borderRadius * 2,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${(1 - (token.timeRemaining / 15)) * 100}%`,
          background: `linear-gradient(to top, ${alpha(theme.palette.success.main, 0.1)}, transparent)`,
          transition: 'height 1s ease-in-out'
        }} />
      </Box>
      
      {token.isUser && (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: theme.palette.warning.main,
          }}
        />
      )}
    </StyledTokenCard>
  );
};

export default TokenCard;
