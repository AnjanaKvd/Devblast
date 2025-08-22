import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Typography, Container, Skeleton, Alert, IconButton, Paper, Button,
  Tabs, Tab, Chip, Fade, Tooltip, Badge, Divider, Grid,
  Stack, TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CasinoIcon from '@mui/icons-material/Casino';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import IcecreamIcon from '@mui/icons-material/Icecream';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import AirIcon from '@mui/icons-material/Air';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import * as api from '../services/api';

// Import Components
import EnhancedNavbar from '../components/Navbar';
import ItemSelectorCard from '../components/ItemSelectorCard';

// Floating bubble animations
const Bubble = ({ size, delay, duration, left }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ 
      y: -100, 
      opacity: [0, 0.7, 0],
      x: left % 2 === 0 ? [0, 10, -5, 0] : [0, -10, 5, 0]
    }}
    transition={{ 
      repeat: Infinity, 
      duration: duration, 
      delay: delay,
      ease: "easeOut" 
    }}
    style={{
      position: 'absolute',
      left: `${left}%`,
      bottom: '20%',
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.4)',
      filter: 'blur(1px)'
    }}
  />
);

// Drink visualization component
const DrinkVisualizer = ({ selectedDrink, addons = [] }) => {
  const drinkRef = useRef(null);
  const controls = useAnimation();

  // Ice cube animation
  const IceCube = ({ index }) => (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        rotate: [0, 10, -5, 0],
      }}
      transition={{ 
        delay: index * 0.2,
        duration: 0.5 + (index * 0.2),
        type: "spring"
      }}
      style={{
        position: 'absolute',
        width: 15 + (index * 3),
        height: 15 + (index * 3),
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '3px',
        boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)',
        top: 40 + (index * 15),
        left: 35 + (index * 8),
        transform: 'rotate(' + (index * 20) + 'deg)',
        zIndex: 5
      }}
    />
  );

  // Straw animation
  const Straw = () => (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
      style={{
        position: 'absolute',
        top: -40,
        right: 50,
        width: 12,
        height: 160,
        borderRadius: 10,
        background: 'linear-gradient(90deg, #ff7070, #ff9090)',
        transform: 'rotate(-20deg)',
        transformOrigin: 'bottom center',
        zIndex: 20
      }}
    />
  );

  // Animation for filling the glass
  useEffect(() => {
    if (selectedDrink) {
      controls.start({
        height: '80%',
        transition: { duration: 1.5, ease: "easeOut" }
      });
    } else {
      controls.start({
        height: '0%',
        transition: { duration: 0.5 }
      });
    }
  }, [selectedDrink, controls]);

  if (!selectedDrink) {
    return (
      <Box 
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography 
          variant="h5" 
          color="rgba(255,255,255,0.7)"
          sx={{ textAlign: 'center' }}
        >
          Select a drink to visualize
        </Typography>
      </Box>
    );
  }

  // Determine drink type and appearance
  const isDarkDrink = selectedDrink.type === 'soda' || selectedDrink.type === 'coffee';
  const isMilkshake = selectedDrink.type === 'milkshake';
  const isIceCream = selectedDrink.type === 'icecream';
  const hasIce = addons.some(addon => addon.name.toLowerCase().includes('ice'));
  const hasStraw = !isIceCream;

  return (
    <Box 
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Glass container */}
      <Box
        ref={drinkRef}
        sx={{
          width: 180,
          height: 250,
          position: 'relative',
          borderRadius: isIceCream ? '30px 30px 80px 80px' : '20px 20px 60px 60px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          zIndex: 10
        }}
      >
        {/* Liquid inside the glass */}
        <motion.div
          animate={controls}
          initial={{ height: '0%' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: isDarkDrink 
              ? 'linear-gradient(180deg, rgba(60, 30, 20, 0.9), rgba(40, 20, 10, 0.95))'
              : isMilkshake
                ? 'linear-gradient(180deg, rgba(240, 200, 180, 0.9), rgba(220, 180, 160, 0.95))'
                : isIceCream
                  ? 'linear-gradient(180deg, rgba(255, 240, 200, 0.9), rgba(250, 230, 180, 0.95))'
                  : 'linear-gradient(180deg, rgba(200, 240, 255, 0.8), rgba(180, 220, 240, 0.9))',
            borderRadius: isIceCream ? '0 0 80px 80px' : '0 0 60px 60px',
            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.2)',
            zIndex: 5
          }}
        >
          {/* Bubbles in soda */}
          {selectedDrink.type === 'soda' && (
            <>
              <Bubble size={8} delay={0.5} duration={2.5} left={20} />
              <Bubble size={12} delay={1.2} duration={3} left={50} />
              <Bubble size={6} delay={0.8} duration={2} left={80} />
              <Bubble size={10} delay={1.5} duration={2.8} left={35} />
              <Bubble size={7} delay={2} duration={2.2} left={65} />
            </>
          )}
        </motion.div>

        {/* Ice cubes */}
        {hasIce && !isIceCream && (
          <>
            <IceCube index={0} />
            <IceCube index={1} />
            <IceCube index={2} />
          </>
        )}

        {/* Ice cream scoops */}
        {isIceCream && (
          <>
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              style={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: selectedDrink.name.toLowerCase().includes('chocolate') 
                  ? 'linear-gradient(135deg, #8B4513, #5C3317)'
                  : selectedDrink.name.toLowerCase().includes('strawberry') 
                    ? 'linear-gradient(135deg, #FF7F7F, #FF5252)'
                    : 'linear-gradient(135deg, #FFFACD, #F5DEB3)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                zIndex: 15
              }}
            />
            {addons.some(addon => addon.name.toLowerCase().includes('extra scoop')) && (
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: -40, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
                style={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #A7C7E7, #87CEEB)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  zIndex: 16
                }}
              />
            )}
          </>
        )}

        {/* Straw */}
        {hasStraw && !isIceCream && <Straw />}
      </Box>

      {/* Price tag bubble */}
      {selectedDrink && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          style={{
            position: 'absolute',
            top: 30,
            right: 30,
            zIndex: 20
          }}
        >
          <Chip
            label={`Rs ${selectedDrink.price}`}
            sx={{
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 15px rgba(120,180,255,0.6)',
            }}
          />
        </motion.div>
      )}

      {/* Addon price bubbles */}
      {addons.map((addon, index) => (
        <motion.div
          key={addon.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 + (index * 0.2), type: "spring" }}
          style={{
            position: 'absolute',
            top: 70 + (index * 40),
            right: 40,
            zIndex: 20
          }}
        >
          <Chip
            size="small"
            label={`+${addon.price} (${addon.name})`}
            sx={{
              bgcolor: 'rgba(50,50,50,0.7)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.7rem',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 10px rgba(120,180,255,0.3)',
            }}
          />
        </motion.div>
      ))}
    </Box>
  );
};

// Snack visualization component
const SnackVisualizer = ({ selectedSnacks = [] }) => {
  const plateRef = useRef(null);
  const plateControls = useAnimation();

  // Effect for plate animation
  useEffect(() => {
    if (selectedSnacks.length > 0) {
      plateControls.start({
        rotate: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.5 }
      });
    }
  }, [selectedSnacks.length, plateControls]);

  if (selectedSnacks.length === 0) {
    return (
      <Box 
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography 
          variant="h5" 
          color="rgba(255,255,255,0.7)"
          sx={{ textAlign: 'center' }}
        >
          Select snacks to visualize
        </Typography>
      </Box>
    );
  }

  // Calculate positions on the plate based on the number of snacks
  const getPositionStyle = (index, total) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = total > 3 ? 60 : 40;
    
    return {
      top: `calc(50% + ${Math.sin(angle) * radius}px)`,
      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
      transform: 'translate(-50%, -50%) rotate(' + (index * 30) + 'deg)',
    };
  };

  return (
    <Box 
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Plate */}
      <motion.div
        ref={plateRef}
        animate={plateControls}
        style={{
          position: 'relative',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
          zIndex: 5
        }}
      >
        {/* Plate rim */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            borderRadius: '50%',
            border: '5px solid rgba(255,255,255,0.3)',
            zIndex: 6
          }}
        />

        {/* Snacks on the plate */}
        <AnimatePresence>
          {selectedSnacks.map((snack, index) => (
            <motion.div
              key={snack.id}
              initial={{ y: -100, opacity: 0, rotate: -180 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                rotate: 0,
                ...getPositionStyle(index, selectedSnacks.length)
              }}
              exit={{ y: 100, opacity: 0, rotate: 180 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20, 
                delay: index * 0.1
              }}
              style={{
                position: 'absolute',
                zIndex: 10 + index
              }}
            >
              <Box
                component="img"
                src={snack.imageUrl}
                alt={snack.name}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: snack.type === 'roll' ? '20px' : '50%',
                  border: '2px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                }}
              />
              
              {/* Price tag */}
              <Chip
                size="small"
                label={`Rs ${snack.price}`}
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -20,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  height: 20,
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 0 10px rgba(255,200,100,0.5)',
                  zIndex: 20
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Box>
  );
};

// Category tab panel
const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    sx={{ width: '100%', height: '100%' }}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 1, height: '100%' }}>
        {children}
      </Box>
    )}
  </Box>
);

export default function DrinksAndSnacksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for menu options
  const [options, setOptions] = useState({
    drinks: {
      sodas: [],
      milkshakes: [],
      icecreams: []
    },
    snacks: {
      savory: [],
      sweet: [],
      other: []
    },
    addons: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selections
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedTimeObj, setSelectedTimeObj] = useState(null);
  const [timeError, setTimeError] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderToken, setOrderToken] = useState(null);
  
  // Calculate available pickup times (current time + 10min to +2 hours in 5min increments)
  const getAvailableTimeRange = () => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 10 * 60000); // current time + 10 minutes
    const maxTime = new Date(now.getTime() + 120 * 60000); // current time + 2 hours
    
    // Round minutes to nearest 5
    minTime.setMinutes(Math.ceil(minTime.getMinutes() / 5) * 5);
    minTime.setSeconds(0);
    minTime.setMilliseconds(0);
    
    return { minTime, maxTime };
  };
  
  const { minTime, maxTime } = getAvailableTimeRange();
  
  // Format time for display
  const formatTimeForDisplay = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Parse time string to Date object
  const parseTimeString = (timeString) => {
    if (!timeString) return null;
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const timeObj = new Date();
      timeObj.setHours(hours, minutes, 0, 0);
      return timeObj;
    } catch (err) {
      return null;
    }
  };
  
  // Handle time change
  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    if (!timeValue) {
      setSelectedTimeObj(null);
      setTimeError(true);
      return;
    }
    
    try {
      const timeObj = parseTimeString(timeValue);
      
      // Validate time is within allowed range
      if (!timeObj || timeObj < minTime || timeObj > maxTime) {
        setTimeError(true);
        return;
      }
      
      setSelectedTimeObj(timeObj);
      setTimeError(false);
    } catch (err) {
      setTimeError(true);
    }
  };
  
  // Check if we're coming from the dashboard or meal builder
  const fromDashboard = location.state?.from === 'dashboard' && location.state?.selectedOption === 'drinks-snacks';
  const fromMealBuilder = location.state?.from === 'mealbuilder';
  const [entryAnimationComplete, setEntryAnimationComplete] = useState(!fromDashboard && !fromMealBuilder);

  // Animation controls
  const drinkTrayControls = useAnimation();
  const snackTrayControls = useAnimation();

  // Mock data for testing (replace with API call in production)
  useEffect(() => {
    const mockData = {
      drinks: {
        sodas: [
          { id: 1, name: 'Cola', price: 150, type: 'soda', imageUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=150&auto=format&fit=crop&q=60' },
          { id: 2, name: 'Sprite', price: 150, type: 'soda', imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=150&auto=format&fit=crop&q=60' },
          { id: 3, name: 'Fanta', price: 150, type: 'soda', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60' }
        ],
        milkshakes: [
          { id: 4, name: 'Chocolate Shake', price: 300, type: 'milkshake', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=150&auto=format&fit=crop&q=60' },
          { id: 5, name: 'Strawberry Shake', price: 300, type: 'milkshake', imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=150&auto=format&fit=crop&q=60' },
          { id: 6, name: 'Vanilla Shake', price: 280, type: 'milkshake', imageUrl: 'https://images.unsplash.com/photo-1568901839119-631418a3910d?w=150&auto=format&fit=crop&q=60' }
        ],
        icecreams: [
          { id: 7, name: 'Chocolate Ice Cream', price: 250, type: 'icecream', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=150&auto=format&fit=crop&q=60' },
          { id: 8, name: 'Vanilla Ice Cream', price: 220, type: 'icecream', imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=150&auto=format&fit=crop&q=60' },
          { id: 9, name: 'Strawberry Ice Cream', price: 250, type: 'icecream', imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=150&auto=format&fit=crop&q=60' }
        ]
      },
      snacks: {
        savory: [
          { id: 10, name: 'Samosa', price: 100, type: 'savory', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=150&auto=format&fit=crop&q=60' },
          { id: 11, name: 'Fish Cutlet', price: 120, type: 'savory', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=150&auto=format&fit=crop&q=60' },
          { id: 12, name: 'Chinese Roll', price: 150, type: 'roll', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=150&auto=format&fit=crop&q=60' },
          { id: 13, name: 'Vegetable Patty', price: 100, type: 'savory', imageUrl: 'https://images.unsplash.com/photo-1625938145744-535dab16e475?w=150&auto=format&fit=crop&q=60' }
        ],
        sweet: [
          { id: 14, name: 'Chocolate Muffin', price: 180, type: 'sweet', imageUrl: 'https://images.unsplash.com/photo-1604882406385-9edda82767a7?w=150&auto=format&fit=crop&q=60' },
          { id: 15, name: 'Donut', price: 150, type: 'sweet', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=60' },
          { id: 16, name: 'Cupcake', price: 170, type: 'sweet', imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=150&auto=format&fit=crop&q=60' }
        ],
        other: [
          { id: 17, name: 'Sandwich', price: 200, type: 'other', imageUrl: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=150&auto=format&fit=crop&q=60' },
          { id: 18, name: 'Vegetable Puff', price: 130, type: 'other', imageUrl: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=150&auto=format&fit=crop&q=60' }
        ]
      },
      addons: [
        { id: 19, name: 'Extra Ice', price: 20, type: 'addon', imageUrl: 'https://images.unsplash.com/photo-1570526427001-040b19dd574f?w=150&auto=format&fit=crop&q=60' },
        { id: 20, name: 'Whipped Cream', price: 50, type: 'addon', imageUrl: 'https://images.unsplash.com/photo-1635451321975-d9a2ad49c587?w=150&auto=format&fit=crop&q=60' },
        { id: 21, name: 'Extra Scoop', price: 80, type: 'addon', imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=150&auto=format&fit=crop&q=60' },
        { id: 22, name: 'Chocolate Sauce', price: 40, type: 'addon', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=150&auto=format&fit=crop&q=60' }
      ]
    };
    
    setOptions(mockData);
    setLoading(false);
    
    // If coming from dashboard or meal builder, trigger entry animation
    if (fromDashboard || fromMealBuilder) {
      // Set a delay to complete the entry animation
      setTimeout(() => {
        setEntryAnimationComplete(true);
      }, 1000);
    }
  }, [fromDashboard, fromMealBuilder]);

  // Calculate total price
  useEffect(() => {
    const drinkPrice = selectedDrink ? selectedDrink.price : 0;
    const snacksPrice = selectedSnacks.reduce((sum, snack) => sum + snack.price, 0);
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    
    // Check if we have a meal price passed from MealBuilderPage
    const mealPrice = location.state?.mealPrice || 0;
    
    setTotalPrice(drinkPrice + snacksPrice + addonsPrice + mealPrice);
  }, [selectedDrink, selectedSnacks, selectedAddons, location.state?.mealPrice]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
  };

  // Handle drink selection
  const handleDrinkSelect = (drink) => {
    setSelectedDrink(prev => prev?.id === drink.id ? null : drink);
    
    // Animate the drink tray
    drinkTrayControls.start({
      rotate: [0, -3, 3, -2, 2, 0],
      transition: { duration: 0.5 }
    });
  };

  // Handle snack selection
  const handleSnackSelect = (snack) => {
    setSelectedSnacks(prev => 
      prev.find(s => s.id === snack.id)
        ? prev.filter(s => s.id !== snack.id)
        : [...prev, snack]
    );
    
    // Animate the snack tray
    snackTrayControls.start({
      rotate: [0, -3, 3, -2, 2, 0],
      transition: { duration: 0.5 }
    });
  };

  // Handle addon selection
  const handleAddonSelect = (addon) => {
    setSelectedAddons(prev => 
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  // Handle random selection
  const handleRandomSelection = () => {
    // Get a random drink
    const drinkCategories = ['sodas', 'milkshakes', 'icecreams'];
    const randomDrinkCategory = drinkCategories[Math.floor(Math.random() * drinkCategories.length)];
    const randomDrink = options.drinks[randomDrinkCategory][
      Math.floor(Math.random() * options.drinks[randomDrinkCategory].length)
    ];
    
    // Get 1-2 random snacks
    const snackCategories = ['savory', 'sweet', 'other'];
    const randomSnackCategory = snackCategories[Math.floor(Math.random() * snackCategories.length)];
    const snacksCount = Math.floor(Math.random() * 2) + 1;
    
    const allSnacks = [
      ...options.snacks.savory,
      ...options.snacks.sweet,
      ...options.snacks.other
    ];
    
    const shuffledSnacks = [...allSnacks].sort(() => 0.5 - Math.random());
    const randomSnacks = shuffledSnacks.slice(0, snacksCount);
    
    // Maybe add an addon
    const randomAddons = [];
    if (Math.random() > 0.5) {
      const randomAddon = options.addons[Math.floor(Math.random() * options.addons.length)];
      randomAddons.push(randomAddon);
    }
    
    // Update selections
    setSelectedDrink(randomDrink);
    setSelectedSnacks(randomSnacks);
    setSelectedAddons(randomAddons);
    
    // Animate trays
    drinkTrayControls.start({
      rotate: [0, -5, 5, -3, 3, 0],
      transition: { duration: 0.8 }
    });
    
    snackTrayControls.start({
      rotate: [0, 5, -5, 3, -3, 0],
      transition: { duration: 0.8 }
    });
  };

  // Handle confirmation
  const handleConfirm = () => {
    // Check if we have a time selection from MealBuilderPage or our own selection
    const hasSelectedTime = location.state?.selectedTime || (selectedTimeObj && !timeError);
    
    // Ensure we have a valid time
    if (!hasSelectedTime) {
      // In a real app, you would show an error message here
      return;
    }
    
    // Generate a random token (in a real app, this would come from the backend)
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    setOrderToken(token);
    setShowConfirmation(true);
  };

  // Get active category items
  const getActiveCategoryItems = () => {
    if (activeTab === 0) { // Drinks tab
      switch (activeCategory) {
        case 0: return options.drinks.sodas;
        case 1: return options.drinks.milkshakes;
        case 2: return options.drinks.icecreams;
        default: return [];
      }
    } else if (activeTab === 1) { // Snacks tab
      switch (activeCategory) {
        case 0: return options.snacks.savory;
        case 1: return options.snacks.sweet;
        case 2: return options.snacks.other;
        default: return [];
      }
    } else { // Addons tab
      return options.addons;
    }
  };

  // Get selection handler based on active tab
  const getSelectionHandler = () => {
    switch (activeTab) {
      case 0: return handleDrinkSelect;
      case 1: return handleSnackSelect;
      case 2: return handleAddonSelect;
      default: return () => {};
    }
  };

  // Check if an item is selected
  const isItemSelected = (item) => {
    switch (activeTab) {
      case 0: return selectedDrink?.id === item.id;
      case 1: return selectedSnacks.some(s => s.id === item.id);
      case 2: return selectedAddons.some(a => a.id === item.id);
      default: return false;
    }
  };

  // All selected items for summary
  const allSelectedItems = [
    ...(selectedDrink ? [selectedDrink] : []),
    ...selectedSnacks,
    ...selectedAddons
  ];

  return (
    <Box
      component={motion.div}
      initial={(fromDashboard || fromMealBuilder) ? { scale: 0.9, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: '#101020',
        color: 'white',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #16213e 50%, #0f0f0f 100%)',
      }}
    >
      <EnhancedNavbar />
      
      {/* Futuristic Background Effects */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.4
      }}>
        {/* Background gradient that changes based on category */}
        <Box 
          component={motion.div}
          animate={{ 
            background: activeTab === 0 
              ? 'radial-gradient(circle at 50% 50%, rgba(0, 180, 255, 0.1) 0%, rgba(0, 50, 120, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
              : activeTab === 1
                ? 'radial-gradient(circle at 50% 50%, rgba(255, 180, 0, 0.1) 0%, rgba(120, 50, 0, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
                : 'radial-gradient(circle at 50% 50%, rgba(180, 0, 255, 0.1) 0%, rgba(50, 0, 120, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
          }}
          transition={{ duration: 1 }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        
        {/* Grid lines */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(100, 100, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          perspective: '1000px',
          transform: 'rotateX(60deg) scale(3)',
          transformOrigin: 'center bottom',
          opacity: 0.2
        }} />
        
        {/* Floating orbs */}
        {[...Array(3)].map((_, i) => (
          <Box 
            key={i}
            component={motion.div}
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 10 + i * 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            sx={{
              position: 'absolute',
              width: 200 + i * 50,
              height: 200 + i * 50,
              borderRadius: '50%',
              background: activeTab === 0
                ? 'radial-gradient(circle, rgba(0, 180, 255, 0.15) 0%, rgba(0, 70, 210, 0) 70%)'
                : activeTab === 1
                  ? 'radial-gradient(circle, rgba(255, 180, 0, 0.15) 0%, rgba(210, 70, 0, 0) 70%)'
                  : 'radial-gradient(circle, rgba(180, 0, 255, 0.15) 0%, rgba(70, 0, 210, 0) 70%)',
              filter: 'blur(30px)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </Box>
      
      <Container maxWidth="lg" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative', 
        py: 2,
        zIndex: 1
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/dashboard', { state: { from: 'drinks-snacks' } })}
              sx={{ color: 'white', mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold',
              background: activeTab === 0
                ? 'linear-gradient(90deg, #ffffff, #80d0ff)'
                : activeTab === 1
                  ? 'linear-gradient(90deg, #ffffff, #ffd080)'
                  : 'linear-gradient(90deg, #ffffff, #d080ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {activeTab === 0 ? 'Customize Your Drink ✨' : 
               activeTab === 1 ? 'Choose Your Snacks 🍽️' : 
               'Add Extras to Your Order 🎉'}
            </Typography>
          </Box>
          
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 'medium',
                transition: 'all 0.3s',
                '&.Mui-selected': {
                  color: 'white',
                  fontWeight: 'bold'
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px',
                background: activeTab === 0
                  ? 'linear-gradient(90deg, #40a0ff, #80d0ff)'
                  : activeTab === 1
                    ? 'linear-gradient(90deg, #ffa040, #ffd080)'
                    : 'linear-gradient(90deg, #a040ff, #d080ff)',
              }
            }}
          >
            <Tab 
              icon={<LocalBarIcon />} 
              label="Drinks" 
              iconPosition="start"
            />
            <Tab 
              icon={<RestaurantIcon />} 
              label="Snacks" 
              iconPosition="start" 
            />
            <Tab 
              icon={<AirIcon />} 
              label="Add-ons" 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        {/* Main content area */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Skeleton 
              variant="rectangular" 
              width={300} 
              height={300} 
              sx={{ borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} 
            />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : showConfirmation ? (
          // Confirmation Screen
          <Box 
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            sx={{ 
              flexGrow: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              gap: 4
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Your Digital Token is Ready
            </Typography>
            
            <Box sx={{ 
              position: 'relative',
              width: 350,
              height: 350,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Box
                component={motion.div}
                animate={{ 
                  rotate: 360,
                  boxShadow: [
                    '0 0 20px rgba(120, 180, 255, 0.5)',
                    '0 0 40px rgba(120, 180, 255, 0.7)',
                    '0 0 20px rgba(120, 180, 255, 0.5)'
                  ]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid rgba(100, 180, 255, 0.3)',
                  boxShadow: '0 0 30px rgba(120, 180, 255, 0.6)',
                }}
              />
              
              <Box
                component="img"
                src={selectedDrink?.imageUrl || selectedSnacks[0]?.imageUrl}
                alt="Your Order"
                sx={{
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '10px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}
              />
              
              {/* Digital token display */}
              <Box
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  padding: '10px 30px',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(100,180,255,0.3)',
                  boxShadow: '0 0 20px rgba(100,180,255,0.5)',
                  zIndex: 20
                }}
              >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                    #{orderToken}
                  </Typography>
                </Box>
              </Box>
              
              {/* Show pickup time */}
              <Box
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                sx={{
                  position: 'absolute',
                  top: -30,
                  padding: '8px 20px',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(100,180,255,0.3)',
                  boxShadow: '0 0 20px rgba(100,180,255,0.5)',
                  zIndex: 20
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>
                  Pickup Time:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedTimeObj ? 
                    `${formatTimeForDisplay(selectedTimeObj)} - ${formatTimeForDisplay(new Date(selectedTimeObj.getTime() + 5 * 60000))}` : 
                    location.state?.selectedTime ? 
                      `${location.state.selectedTime} - ${(() => {
                        const timeObj = parseTimeString(location.state.selectedTime);
                        if (timeObj) {
                          const endTime = new Date(timeObj.getTime() + 5 * 60000);
                          return formatTimeForDisplay(endTime);
                        }
                        return '';
                      })()}` : 
                      'Not specified'}
                </Typography>
              </Box>            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 500, mx: 'auto', color: 'rgba(255,255,255,0.7)' }}>
                {location.state?.from === 'mealbuilder' 
                  ? "Your complete meal with drinks and snacks is ready! Show this token at the counter."
                  : "Your order has been prepared! Show this token at the counter to collect your items."}
              </Typography>
              
              {/* Show total amount if coming from meal builder */}
              {location.state?.from === 'mealbuilder' && (
                <Typography variant="h6" sx={{ mb: 3, color: 'rgba(100,180,255,0.9)' }}>
                  Total Amount: Rs {totalPrice.toFixed(2)}
                </Typography>
              )}
              
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/dashboard', { state: { from: 'drinks-snacks', completed: true } })}
                sx={{
                  borderRadius: '30px',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(90deg, #40a0ff, #a050a0)',
                  boxShadow: '0 10px 20px rgba(100,180,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #50b0ff, #b060b0)',
                    boxShadow: '0 10px 20px rgba(100,180,255,0.5)',
                  }
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Box>
        ) : (
          // Main selection interface
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Left: Visualization Area */}
            <Box 
              sx={{ 
                flex: { xs: '1 1 auto', md: '0 0 50%' },
                height: { xs: 350, md: 'auto' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* Tray visualization changes based on active tab */}
              <motion.div 
                animate={activeTab === 0 ? drinkTrayControls : snackTrayControls}
                style={{ 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <TabPanel value={activeTab} index={0}>
                  <DrinkVisualizer selectedDrink={selectedDrink} addons={selectedAddons} />
                </TabPanel>
                
                <TabPanel value={activeTab} index={1}>
                  <SnackVisualizer selectedSnacks={selectedSnacks} />
                </TabPanel>
                
                <TabPanel value={activeTab} index={2}>
                  {selectedDrink ? (
                    <DrinkVisualizer selectedDrink={selectedDrink} addons={selectedAddons} />
                  ) : selectedSnacks.length > 0 ? (
                    <SnackVisualizer selectedSnacks={selectedSnacks} />
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: '100%' 
                    }}>
                      <Typography color="rgba(255,255,255,0.7)" variant="h6" sx={{ textAlign: 'center' }}>
                        First select a drink or snack, <br />then choose your add-ons
                      </Typography>
                    </Box>
                  )}
                </TabPanel>
              </motion.div>
              
              {/* Randomizer Button */}
              <Tooltip title="Generate a random combination">
                <IconButton
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRandomSelection}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: '#f5f5f5',
                    border: '2px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: activeTab === 0
                      ? '0 0 15px rgba(100,180,255,0.5)'
                      : activeTab === 1
                        ? '0 0 15px rgba(255,180,100,0.5)'
                        : '0 0 15px rgba(180,100,255,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(70,70,255,0.2)',
                    }
                  }}
                >
                  <CasinoIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* Right: Selection Interface */}
            <Box 
              sx={{ 
                flex: { xs: '1 1 auto', md: '0 0 50%' },
                display: 'flex', 
                flexDirection: 'column'
              }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: '24px',
                  bgcolor: 'rgba(20, 20, 40, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(100, 100, 255, 0.1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Sub-category tabs */}
                {activeTab < 2 && (
                  <Tabs
                    value={activeCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      mb: 2,
                      '& .MuiTab-root': {
                        color: 'rgba(255,255,255,0.5)',
                        '&.Mui-selected': {
                          color: 'white'
                        }
                      },
                      '& .MuiTabs-indicator': {
                        height: 2,
                        borderRadius: '2px',
                        background: activeTab === 0
                          ? 'linear-gradient(90deg, #40a0ff, #80d0ff)'
                          : 'linear-gradient(90deg, #ffa040, #ffd080)',
                      }
                    }}
                  >
                    {activeTab === 0 ? (
                      // Drink categories
                      <>
                        <Tab 
                          icon={<LocalBarIcon fontSize="small" />} 
                          label="Soft Drinks" 
                          iconPosition="start"
                        />
                        <Tab 
                          icon={<LocalCafeIcon fontSize="small" />} 
                          label="Milkshakes" 
                          iconPosition="start"
                        />
                        <Tab 
                          icon={<IcecreamIcon fontSize="small" />} 
                          label="Ice Cream" 
                          iconPosition="start"
                        />
                      </>
                    ) : (
                      // Snack categories
                      <>
                        <Tab 
                          icon={<LunchDiningIcon fontSize="small" />} 
                          label="Savory" 
                          iconPosition="start"
                        />
                        <Tab 
                          icon={<RestaurantIcon fontSize="small" />} 
                          label="Sweet" 
                          iconPosition="start"
                        />
                        <Tab 
                          icon={<LocalBarIcon fontSize="small" />} 
                          label="Other" 
                          iconPosition="start"
                        />
                      </>
                    )}
                  </Tabs>
                )}
                
                {/* Item selection grid */}
                <Box sx={{ overflow: 'auto', flex: 1 }}>
                  <Grid container spacing={2}>
                    {getActiveCategoryItems().map(item => (
                      <Grid item xs={6} sm={4} key={item.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 300,
                            damping: 20,
                            delay: item.id * 0.05 % 0.5 // Staggered animation
                          }}
                        >
                          <ItemSelectorCard 
                            item={item} 
                            isSelected={isItemSelected(item)}
                            onSelect={getSelectionHandler()}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                {/* Selection Summary */}
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    Your Selection
                  </Typography>
                  
                  {/* Display meal items from MealBuilderPage if coming from there */}
                  {location.state?.from === 'mealbuilder' && location.state?.mealItems && location.state.mealItems.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(100,180,255,0.8)', mb: 0.5 }}>
                        Rice Plate Items:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {location.state.mealItems.map((item, index) => (
                          <Chip 
                            key={`meal-${item.id || index}`}
                            label={`${item.name} - Rs ${item.price}`}
                            sx={{ 
                              bgcolor: 'rgba(100,180,255,0.1)', 
                              color: 'white',
                              border: '1px solid rgba(100,180,255,0.3)',
                            }}
                          />
                        ))}
                      </Box>
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {allSelectedItems.length > 0 ? (
                      allSelectedItems.map(item => (
                        <Chip 
                          key={item.id}
                          label={`${item.name} - Rs ${item.price}`}
                          onDelete={() => {
                            if (selectedDrink?.id === item.id) {
                              handleDrinkSelect(item);
                            } else if (selectedSnacks.some(s => s.id === item.id)) {
                              handleSnackSelect(item);
                            } else {
                              handleAddonSelect(item);
                            }
                          }}
                          sx={{ 
                            bgcolor: 'rgba(100,100,255,0.1)', 
                            color: 'white',
                            border: '1px solid rgba(100,100,255,0.3)',
                            '& .MuiChip-deleteIcon': {
                              color: 'rgba(255,255,255,0.7)',
                              '&:hover': { color: 'white' }
                            }
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="rgba(255,255,255,0.5)">
                        No items selected yet
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Time selection */}
                  {!location.state?.selectedTime && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Pickup Time
                      </Typography>
                      
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          borderRadius: '16px',
                          bgcolor: 'rgba(20, 20, 40, 0.4)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: 'rgba(100, 180, 255, 0.1)',
                              border: '1px solid rgba(100, 180, 255, 0.3)',
                              boxShadow: '0 0 20px rgba(100, 180, 255, 0.2)',
                              color: 'white'
                            }}
                          >
                            <AccessTimeIcon sx={{ fontSize: 28 }} />
                          </Box>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <TextField
                              type="time"
                              fullWidth
                              value={selectedTimeObj ? formatTimeForDisplay(selectedTimeObj) : ''}
                              onChange={handleTimeChange}
                              error={timeError}
                              helperText={timeError ? `Please select a time between ${formatTimeForDisplay(minTime)} and ${formatTimeForDisplay(maxTime)}` : ''}
                              InputProps={{
                                sx: {
                                  color: 'white',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)'
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#40a0ff'
                                  }
                                }
                              }}
                              FormHelperTextProps={{
                                sx: {
                                  color: timeError ? '#ff7070' : 'rgba(255, 255, 255, 0.7)'
                                }
                              }}
                              inputProps={{
                                step: 300 // 5 minutes
                              }}
                            />
                          </Box>
                        </Stack>
                      </Paper>
                    </Box>
                  )}
                  
                  {/* Display selected time if coming from MealBuilderPage */}
                  {location.state?.selectedTime && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Pickup Time
                      </Typography>
                      
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          borderRadius: '16px',
                          bgcolor: 'rgba(20, 20, 40, 0.4)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(100, 180, 255, 0.3)'
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: 'rgba(100, 180, 255, 0.1)',
                              border: '1px solid rgba(100, 180, 255, 0.3)',
                              boxShadow: '0 0 20px rgba(100, 180, 255, 0.2)',
                              color: 'white'
                            }}
                          >
                            <AccessTimeIcon sx={{ fontSize: 28 }} />
                          </Box>
                          
                          <Box>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Selected Time
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                              {location.state.selectedTime} - {
                                (() => {
                                  const timeObj = parseTimeString(location.state.selectedTime);
                                  if (timeObj) {
                                    const endTime = new Date(timeObj.getTime() + 5 * 60000);
                                    return formatTimeForDisplay(endTime);
                                  }
                                  return '';
                                })()
                              }
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Box>
                  )}
                  
                  {/* Confirm Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleConfirm}
                    disabled={allSelectedItems.length === 0 || (!selectedTimeObj && !location.state?.selectedTime) || timeError}
                    endIcon={<CheckCircleIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: '16px',
                      background: allSelectedItems.length === 0 
                        ? 'rgba(100,100,100,0.2)'
                        : activeTab === 0
                          ? 'linear-gradient(90deg, #40a0ff, #8080ff)'
                          : activeTab === 1
                            ? 'linear-gradient(90deg, #ffa040, #ff8080)'
                            : 'linear-gradient(90deg, #a040ff, #8080ff)',
                      boxShadow: '0 10px 20px rgba(100,100,255,0.3)',
                      '&:hover': {
                        background: activeTab === 0
                          ? 'linear-gradient(90deg, #50b0ff, #9090ff)'
                          : activeTab === 1
                            ? 'linear-gradient(90deg, #ffb050, #ff9090)'
                            : 'linear-gradient(90deg, #b050ff, #9090ff)',
                      },
                      '&:disabled': {
                        background: 'rgba(100,100,100,0.2)',
                        color: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  >
                    Confirm Your Order
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </Container>
      
      {/* Floating Price Bar */}
      <AnimatePresence>
        {allSelectedItems.length > 0 && !showConfirmation && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }} 
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Paper 
              elevation={10} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: 'rgba(20, 20, 40, 0.8)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(100, 100, 255, 0.2)',
                color: 'white'
              }}
            >
              <Box>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Total Price
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: activeTab === 0
                      ? 'linear-gradient(90deg, #ffffff, #80d0ff)'
                      : activeTab === 1
                        ? 'linear-gradient(90deg, #ffffff, #ffd080)'
                        : 'linear-gradient(90deg, #ffffff, #d080ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Rs {totalPrice.toFixed(2)}
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => setActiveTab((prev) => (prev + 1) % 3)}
                sx={{
                  borderRadius: '16px', 
                  px: 3,
                  background: activeTab === 0
                    ? 'linear-gradient(90deg, #40a0ff, #8080ff)'
                    : activeTab === 1
                      ? 'linear-gradient(90deg, #ffa040, #ff8080)'
                      : 'linear-gradient(90deg, #a040ff, #8080ff)',
                  boxShadow: '0 0 20px rgba(100,100,255,0.3)',
                  '&:hover': {
                    background: activeTab === 0
                      ? 'linear-gradient(90deg, #50b0ff, #9090ff)'
                      : activeTab === 1
                        ? 'linear-gradient(90deg, #ffb050, #ff9090)'
                        : 'linear-gradient(90deg, #b050ff, #9090ff)',
                  }
                }}
              >
                {activeTab === 0 ? 'Add Snacks' : 
                 activeTab === 1 ? 'Add Extras' : 
                 'Drinks & Snacks'}
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
