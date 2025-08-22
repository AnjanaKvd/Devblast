import React from 'react';
import { Box, Typography, IconButton, Card, CardContent, alpha, useTheme, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
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

const StyledCard = styled(motion(Card))(({ theme, status, type = [] }) => {
  let glowColor = theme.palette.primary.main;
  
  if (type.includes('rice')) {
    glowColor = theme.palette.warning.main; // Orange/Yellow
  } else if (type.includes('drinks')) {
    glowColor = theme.palette.info.main; // Teal/Blue
  } else if (type.includes('snacks')) {
    glowColor = theme.palette.secondary.main; // Pink/Purple
  }
  
  return {
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    backdropFilter: 'blur(8px)',
    background: alpha(theme.palette.background.paper, 0.7),
    boxShadow: status === 'active'
      ? `0 0 20px ${alpha(glowColor, 0.5)}`
      : `0 8px 16px ${alpha(theme.palette.common.black, 0.1)}`,
    border: status === 'active'
      ? `2px solid ${glowColor}`
      : `1px solid ${alpha(glowColor, 0.3)}`,
    height: '100%',
  };
});

const ProgressIndicator = styled(Box)(({ theme, progress = 0 }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 4,
  background: alpha(theme.palette.grey[300], 0.3),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: `${progress}%`,
    background: theme.palette.success.main,
    transition: 'width 1s ease-in-out',
  }
}));

const TokenCardAdmin = ({ token, onMarkReady }) => {
  const theme = useTheme();
  
  // Calculate progress percentage based on time remaining
  const maxTime = 15; // Assuming 15 minutes is the maximum time
  const progress = token.timeRemaining > 0 
    ? 100 - ((token.timeRemaining / maxTime) * 100)
    : 100;
  
  return (
    <StyledCard 
      status={token.status}
      type={token.type}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            #{token.id}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5, 
            p: 0.5, 
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.1)
          }}>
            {token.type.map(type => (
              <Typography key={type} variant="body1">
                {getTypeIcon(type)}
              </Typography>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            size="small"
            icon={<PlaceIcon fontSize="small" />}
            label={`Counter ${token.counter}`}
            color="primary"
            variant="outlined"
          />
          
          <Chip
            size="small"
            icon={<AccessTimeIcon fontSize="small" />}
            label={token.status === 'active' 
              ? 'Now Serving'
              : `${token.timeRemaining} min`
            }
            color={token.status === 'active'
              ? 'success'
              : token.timeRemaining <= 2
                ? 'error'
                : token.timeRemaining <= 5
                  ? 'warning'
                  : 'default'
            }
            variant="outlined"
          />
        </Box>
        
        {token.status === 'active' && (
          <Box 
            component={motion.div}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            sx={{ 
              p: 1, 
              mb: 2,
              textAlign: 'center',
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              Currently Being Prepared
            </Typography>
          </Box>
        )}
        
        <Box sx={{ 
          mt: 'auto', 
          display: 'flex', 
          justifyContent: 'center',
          pt: 1
        }}>
          <IconButton 
            color="success" 
            size="large" 
            onClick={() => onMarkReady(token.id)}
            sx={{
              '&:hover': {
                background: alpha(theme.palette.success.main, 0.1),
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircleIcon fontSize="large" />
          </IconButton>
        </Box>
      </CardContent>
      
      <ProgressIndicator progress={progress} />
    </StyledCard>
  );
};

export default TokenCardAdmin;
