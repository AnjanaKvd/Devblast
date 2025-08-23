// src/components/ItemSelectorCard.js

import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

export default function ItemSelectorCard({ item, isSelected, onSelect }) {
  const handleClick = () => {
    console.log('ItemSelectorCard clicked:', item);
    if (onSelect && typeof onSelect === 'function') {
      onSelect(item);
    } else {
      console.error('Invalid onSelect prop passed to ItemSelectorCard');
    }
  };

  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }}
      transition={{ duration: 0.2 }}
    >
      <Box
        onClick={handleClick}
        sx={{
          position: 'relative',
          minWidth: 120,
          height: 120,
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '2px solid',
          borderColor: isSelected ? 'primary.main' : 'grey.300',
          boxShadow: isSelected ? '0 0 12px rgba(3, 169, 244, 0.7)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        <Box
          component="img"
          src={item.imageUrl}
          alt={item.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {item.name}
          </Typography>
        </Box>
        {isSelected && (
          <CheckCircleIcon
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'primary.main',
              borderRadius: '50%',
              fontSize: 24,
            }}
          />
        )}
      </Box>
    </motion.div>
  );
}