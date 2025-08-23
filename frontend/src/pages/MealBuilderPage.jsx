// src/pages/MealBuilderPage.js (Corrected)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Typography, Container, Skeleton, Alert, IconButton, Paper, Button,
    Stepper, Step, StepLabel, Chip, LinearProgress, Grid, Fade, Tooltip,
    Stack, TextField, InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CasinoIcon from '@mui/icons-material/Casino';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import * as api from '../services/api';

// Import Components
import EnhancedNavbar from '../components/Navbar';
import ItemSelectorCard from '../components/ItemSelectorCard';

// A small component for the food items appearing on the plate
const PlateItem = ({ item, index, total }) => {
    // Calculate position on a circle with slight randomness for natural placement
    const angle = (index / total) * Math.PI * 2;
    const radius = 35 + Math.random() * 10; // Vary the radius slightly

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: index * 0.1 // Stagger the animations
            }}
            style={{
                position: 'absolute',
                top: `${50 + Math.sin(angle) * radius}%`,
                left: `${50 + Math.cos(angle) * radius}%`,
                zIndex: 10 + index,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.name}
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid white',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
                    }}
                />

                {/* Price Tag */}
                <Chip
                    size="small"
                    label={`Rs ${item.price}`}
                    sx={{
                        position: 'absolute',
                        top: -10,
                        right: -20,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.6rem',
                        height: 20,
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 0 10px rgba(120,120,255,0.5)',
                    }}
                />
            </Box>
        </motion.div>
    );
};


// Rice Plate component that shows a stylized 3D-looking plate
const RicePlate = ({ selectedRice, selectedCurries }) => {
    const plateControls = useAnimation();
    const steamRef = useRef(null);

    // Steam particles effect
    const SteamParticle = ({ delay, duration, size, left }) => (
        <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{
                y: [-10, -40],
                opacity: [0, 0.7, 0]
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
                bottom: '100%',
                width: size,
                height: size,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.8)',
                filter: 'blur(4px)'
            }}
        />
    );

    useEffect(() => {
        // Plate wiggle animation when a new item is added
        if (selectedRice || selectedCurries.length > 0) {
            plateControls.start({
                rotate: [0, -3, 3, -2, 2, 0],
                transition: { duration: 0.5 }
            });
        }
    }, [selectedRice, selectedCurries.length, plateControls]);

    return (
        <Box
            sx={{
                position: 'relative',
                perspective: '1000px',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {/* Ambient light glow under the plate */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '80%',
                    height: '20%',
                    borderRadius: '50%',
                    background: selectedRice
                        ? 'radial-gradient(circle, rgba(120,180,255,0.4) 0%, rgba(0,0,0,0) 70%)'
                        : 'radial-gradient(circle, rgba(100,100,100,0.2) 0%, rgba(0,0,0,0) 70%)',
                    bottom: '5%',
                    filter: 'blur(15px)',
                    zIndex: 1,
                    transition: 'all 0.5s ease-in-out'
                }}
            />

            {/* The plate */}
            <motion.div
                animate={plateControls}
                style={{
                    position: 'relative',
                    zIndex: 2
                }}
            >
                {/* Plate base */}
                <Box
                    sx={{
                        width: { xs: 280, sm: 350 },
                        height: { xs: 280, sm: 350 },
                        borderRadius: '50%',
                        background: 'linear-gradient(145deg, #f0f0f0, #e6e6e6)',
                        boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff, inset 0 4px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    {/* Rice */}
                    {selectedRice && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            style={{
                                position: 'absolute',
                                width: '75%',
                                height: '75%',
                                borderRadius: '50%',
                                zIndex: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: selectedRice.type === 'white'
                                        ? 'linear-gradient(135deg, #f5f5f5, #e6e6e6)'
                                        : selectedRice.type === 'red'
                                            ? 'linear-gradient(135deg, #d7bfb3, #c4a99c)'
                                            : 'linear-gradient(135deg, #e0d5a8, #ccba7c)',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
                                    position: 'relative'
                                }}
                            />
                            {/* Steam effect */}
                            <Box ref={steamRef} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 0 }}>
                                <SteamParticle delay={0.5} duration={2} size={10} left={30} />
                                <SteamParticle delay={1.2} duration={2.5} size={15} left={45} />
                                <SteamParticle delay={0.8} duration={2.2} size={12} left={60} />
                                <SteamParticle delay={1.5} duration={2.3} size={8} left={75} />
                            </Box>
                        </motion.div>
                    )}

                    {/* Plate rim highlight */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: '50%',
                            boxShadow: 'inset 0 0 0 8px rgba(255,255,255,0.8)',
                            zIndex: 10
                        }}
                    />
                </Box>
            </motion.div>

            {/* The curry items */}
            <AnimatePresence>
                {selectedCurries.map((curry, index) => (
                    <PlateItem
                        key={curry.id}
                        item={curry}
                        index={index}
                        total={selectedCurries.length}
                    />
                ))}
            </AnimatePresence>

            {/* The rice label if selected */}
            {selectedRice && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20
                    }}
                >
                    <Chip
                        icon={<LocalDiningIcon fontSize="small" />}
                        label={selectedRice.name}
                        sx={{
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 0 10px rgba(120,180,255,0.5)',
                        }}
                    />
                </motion.div>
            )}
        </Box>
    );
};

// Carousel for item selection
const ItemCarousel = ({ items, selectedItems, onSelect, title, type }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{
                fontWeight: 'bold',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary'
            }}>
                {type === 'rice' ? <LocalDiningIcon color="primary" /> : <RestaurantMenuIcon color="secondary" />}
                {title}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': {
                        height: 6,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 3,
                    }
                }}
            >
                {items.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                            delay: item.id * 0.05 % 0.5 // Staggered animation based on id
                        }}
                    >
                        <ItemSelectorCard
                            item={item}
                            isSelected={
                                type === 'rice'
                                    ? selectedItems?.id === item.id
                                    : selectedItems.some(i => i.id === item.id)
                            }
                            onSelect={onSelect}
                        />
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
};

export default function MealBuilderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [options, setOptions] = useState({
        riceOptions: [],
        curryOptions: [],
        extrasOptions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for user's choices
    const [selectedRice, setSelectedRice] = useState(null);
    const [selectedCurries, setSelectedCurries] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Step management
    const [activeStep, setActiveStep] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderToken, setOrderToken] = useState(null);

    // Check if we're coming from the dashboard with the rice-curry option
    const fromDashboard = location.state?.from === 'dashboard' && location.state?.selectedOption === 'rice-curry';

    // Fetch rice and curries from the backend
    useEffect(() => {
        const fetchMealOptions = async () => {
            try {
                setLoading(true);
                // Fetch all rice and curry items
                const { data } = await api.getRiceCurries();

                // Categorize items based on their type
                const categorizedItems = data.reduce((acc, item) => {
                    if (item.type === 'rice') {
                        acc.riceOptions.push({
                            id: item._id,
                            name: item.name,
                            price: item.price,
                            type: item.variant || 'white',
                            imageUrl: item.image || 'https://images.unsplash.com/photo-1541014741259-de529411b96b?q=80&w=150&auto=format&fit=crop'
                        });
                    } else if (item.type === 'curry') {
                        acc.curryOptions.push({
                            id: item._id,
                            name: item.name,
                            price: item.price,
                            type: item.category || 'curry',
                            imageUrl: item.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=150&auto=format&fit=crop'
                        });
                    } else if (item.type === 'extra') {
                        acc.extrasOptions.push({
                            id: item._id,
                            name: item.name,
                            price: item.price,
                            type: 'extra',
                            imageUrl: item.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=150&auto=format&fit=crop'
                        });
                    }
                    return acc;
                }, { riceOptions: [], curryOptions: [], extrasOptions: [] });

                setOptions(categorizedItems);
                setError(null);
            } catch (err) {
                console.error('Error fetching meal options:', err);
                setError('Could not load menu. Please try again later.');

                // Fallback to mock data if API fails
                const mockData = {
                    riceOptions: [
                        { id: '1', name: 'White Rice', price: 250, type: 'white', imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=150&auto=format&fit=crop' },
                    ],
                    curryOptions: [
                        { id: '2', name: 'Chicken Curry', price: 350, type: 'curry', imageUrl: 'https://images.unsplash.com/photo-1604344799811-36f1db28bd5d?q=80&w=150&auto=format&fit=crop' },
                    ],
                    extrasOptions: [
                        { id: '3', name: 'Papadam', price: 50, type: 'extra', imageUrl: 'https://images.unsplash.com/photo-1695848934569-dbf252c7b611?q=80&w=150&auto=format&fit=crop' },
                    ]
                };
                setOptions(mockData);
            } finally {
                setLoading(false);
            }
        };

        fetchMealOptions();
    }, [fromDashboard]);

    // Recalculate total price
    useEffect(() => {
        const ricePrice = selectedRice ? selectedRice.price : 0;
        const curriesPrice = selectedCurries.reduce((sum, curry) => sum + curry.price, 0);
        const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
        setTotalPrice(ricePrice + curriesPrice + extrasPrice);
    }, [selectedRice, selectedCurries, selectedExtras]);

    // Move to next step when selections are made
    useEffect(() => {
        if (activeStep === 0 && selectedRice) {
            setTimeout(() => setActiveStep(1), 500);
        } else if (activeStep === 1 && selectedCurries.length > 0) {
            setTimeout(() => setActiveStep(2), 500);
        }
    }, [selectedRice, selectedCurries, activeStep]);

    // Handle randomizer function
    const handleSurpriseMe = () => {
        // Random rice selection
        const randomRice = options.riceOptions[Math.floor(Math.random() * options.riceOptions.length)];
        setSelectedRice(randomRice);

        // Random 1-3 curries
        const curriesCount = Math.floor(Math.random() * 3) + 1;
        const shuffledCurries = [...options.curryOptions].sort(() => 0.5 - Math.random());
        setSelectedCurries(shuffledCurries.slice(0, curriesCount));

        // Maybe add an extra
        if (Math.random() > 0.5) {
            const randomExtra = options.extrasOptions[Math.floor(Math.random() * options.extrasOptions.length)];
            setSelectedExtras([randomExtra]);
        } else {
            setSelectedExtras([]);
        }

        setActiveStep(2);
    };

    // Combined handler for selecting any item
    const handleItemSelect = (item) => {
        // Check what type of item it is
        if (options.riceOptions.some(rice => rice.id === item.id)) {
            setSelectedRice(prevRice => (prevRice?.id === item.id ? null : item));
        } else if (options.curryOptions.some(curry => curry.id === item.id)) {
            setSelectedCurries(prev =>
                prev.find(c => c.id === item.id)
                    ? prev.filter(c => c.id !== item.id)
                    : [...prev, item]
            );
        } else { // It's an extra
            setSelectedExtras(prev =>
                prev.find(e => e.id === item.id)
                    ? prev.filter(e => e.id !== item.id)
                    : [...prev, item]
            );
        }
    };

    // State for time selection
    const [selectedTimeObj, setSelectedTimeObj] = useState(null);
    const [timeError, setTimeError] = useState('');
    const [isAsap, setIsAsap] = useState(true);

    // Calculate available pickup times (current time + 10min to +24 hours in 5min increments)
    const getAvailableTimeRange = () => {
        const now = new Date();
        const minTime = new Date(now.getTime() + 10 * 60000); // current time + 10 minutes
        const maxTime = new Date(now.getTime() + 24 * 60 * 60000); // current time + 24 hours

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

    // Format date for display
    const formatDateForDisplay = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle time change
    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        if (!timeValue) {
            setSelectedTimeObj(null);
            setTimeError('Please select a valid time');
            return;
        }

        try {
            // Parse time string (HH:MM) to Date object
            const [hours, minutes] = timeValue.split(':').map(Number);
            const timeObj = new Date();
            timeObj.setHours(hours, minutes, 0, 0);

            // If the selected time is earlier than now, assume it's for tomorrow
            if (timeObj < new Date()) {
                timeObj.setDate(timeObj.getDate() + 1);
            }

            // Validate time is within allowed range
            if (timeObj < minTime) {
                setTimeError(`Please select a time after ${formatTimeForDisplay(minTime)}`);
                return;
            }

            if (timeObj > maxTime) {
                setTimeError('Maximum advance booking is 24 hours');
                return;
            }

            setSelectedTimeObj(timeObj);
            setTimeError('');
        } catch (err) {
            setTimeError('Invalid time format');
        }
    };

    // Toggle between ASAP and schedule later
    const toggleOrderTime = (asap) => {
        setIsAsap(asap);
        if (asap) {
            setSelectedTimeObj(new Date());
            setTimeError('');
        } else {
            // Set default scheduled time to next available slot
            setSelectedTimeObj(minTime);
        }
    };

    // Handle confirmation and submit order to backend
    const handleConfirm = async () => {
        try {
            // Validate time if not ASAP
            if (!isAsap && !selectedTimeObj) {
                setTimeError('Please select a pickup time');
                return;
            }

            if (timeError) {
                return; // Don't proceed if there's a time validation error
            }

            setLoading(true);

            // Prepare order items with proper schema for backend
            const orderItems = [
                { item: selectedRice.id, quantity: 1 },
                ...selectedCurries.map(curry => ({ item: curry.id, quantity: 1 })),
                ...selectedExtras.map(extra => ({ item: extra.id, quantity: 1 }))
            ];

            // Prepare order data for backend
            const orderData = {
                items: orderItems,
                totalAmount: totalPrice,
                customerIndex: '1', // Ensure this is a string to match the schema
                orderType: 'meal-builder', // Add order type for tracking
                scheduledTime: isAsap ? undefined : selectedTimeObj.toISOString()
            };

            console.log('Submitting order:', orderData); // Debug log

            // Submit order to backend
            const response = await api.submitOrder(orderData);

            if (response.data) {
                // Save the token from the response
                const { token, _id: orderId, createdAt } = response.data;
                setOrderToken(token);

                // Store order info in localStorage for queue highlighting
                const orderInfo = {
                    token,
                    orderId,
                    createdAt: new Date(createdAt).getTime(),
                    status: 'pending'
                };
                localStorage.setItem('userOrder', JSON.stringify(orderInfo));

                // Show confirmation screen with actual token
                setShowConfirmation(true);

                // After a delay, redirect to the queue page
                setTimeout(() => {
                    navigate('/queue', {
                        state: {
                            from: 'mealbuilder',
                            newOrder: {
                                ...orderData,
                                _id: orderId,
                                token,
                                createdAt,
                                status: 'pending'
                            },
                            animate: true
                        }
                    });
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            setError(error.response?.data?.message || 'Failed to submit order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectedItems = [selectedRice, ...selectedCurries, ...selectedExtras].filter(Boolean);

    return (
        <Box
            component={motion.div}
            initial={fromDashboard ? { scale: 0.9, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'black',
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

                {/* Glowing orbs */}
                {[...Array(5)].map((_, i) => (
                    <Box
                        key={i}
                        component={motion.div}
                        animate={{
                            x: [Math.random() * 100, Math.random() * 100],
                            y: [Math.random() * 100, Math.random() * 100],
                            opacity: [0.4, 0.7, 0.4],
                            scale: [1, 1.5, 1]
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
                            background: i % 2
                                ? 'radial-gradient(circle, rgba(90, 90, 255, 0.15) 0%, rgba(70, 70, 210, 0) 70%)'
                                : 'radial-gradient(circle, rgba(255, 90, 90, 0.1) 0%, rgba(210, 70, 70, 0) 70%)',
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
                {/* Header with Progress Steps */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => navigate('/dashboard', { state: { from: 'mealbuilder' } })}
                            sx={{ color: 'white', mr: 1 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #ffffff, #a0a0ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Design Your Rice Plate ✨
                        </Typography>
                    </Box>

                    {/* Progress Stepper */}
                    <Stepper
                        activeStep={activeStep}
                        sx={{
                            '& .MuiStepLabel-label': {
                                color: 'rgba(255,255,255,0.5)',
                                '&.Mui-active': {
                                    color: 'white',
                                    fontWeight: 'bold'
                                }
                            },
                            '& .MuiStepIcon-root': {
                                color: 'rgba(100,100,255,0.3)',
                                '&.Mui-active': {
                                    color: '#7070ff',
                                },
                                '&.Mui-completed': {
                                    color: '#50c878',
                                }
                            }
                        }}
                    >
                        <Step>
                            <StepLabel>Choose Rice</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Add Curries</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Extras</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Confirm</StepLabel>
                        </Step>
                    </Stepper>
                </Box>

                {/* Main Content Area */}
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
                    // Order Completion / Confirmation Screen
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
                        {!orderToken ? (
                            // Options screen to finalize
                            <>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    Your Rice Plate is Ready!
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
                                                '0 0 20px rgba(120, 120, 255, 0.5)',
                                                '0 0 40px rgba(120, 120, 255, 0.7)',
                                                '0 0 20px rgba(120, 120, 255, 0.5)'
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
                                            border: '2px solid rgba(100, 100, 255, 0.3)',
                                            boxShadow: '0 0 30px rgba(120, 120, 255, 0.6)',
                                        }}
                                    />
                                    <Box
                                        component="img"
                                        src={selectedRice?.imageUrl}
                                        alt="Your Meal"
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
                                            border: '1px solid rgba(100,100,255,0.3)',
                                            boxShadow: '0 0 20px rgba(100,100,255,0.5)',
                                            zIndex: 20
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                                            Rs {totalPrice.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 3,
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
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: '50%',
                                                    bgcolor: 'rgba(100, 100, 255, 0.1)',
                                                    border: '1px solid rgba(100, 100, 255, 0.3)',
                                                    boxShadow: '0 0 20px rgba(100, 100, 255, 0.2)',
                                                    color: 'white'
                                                }}
                                            >
                                                <AccessTimeIcon sx={{ fontSize: 32 }} />
                                            </Box>
                                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                                <Typography variant="subtitle1" sx={{ mb: 1, color: 'rgba(255,255,255,0.9)' }}>
                                                    Pickup Time
                                                </Typography>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                                        <Button
                                                            variant={isAsap ? 'contained' : 'outlined'}
                                                            onClick={() => toggleOrderTime(true)}
                                                            size="small"
                                                            sx={{ flex: 1, bgcolor: isAsap ? 'rgba(112, 112, 255, 0.2)' : 'transparent', borderColor: 'rgba(255, 255, 255, 0.23)', color: isAsap ? 'white' : 'rgba(255, 255, 255, 0.7)', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(112, 112, 255, 0.1)' } }}
                                                        >
                                                            ASAP
                                                        </Button>
                                                        <Button
                                                            variant={!isAsap ? 'contained' : 'outlined'}
                                                            onClick={() => toggleOrderTime(false)}
                                                            size="small"
                                                            sx={{ flex: 1, bgcolor: !isAsap ? 'rgba(112, 112, 255, 0.2)' : 'transparent', borderColor: 'rgba(255, 255, 255, 0.23)', color: !isAsap ? 'white' : 'rgba(255, 255, 255, 0.7)', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)', bgcolor: 'rgba(112, 112, 255, 0.1)' } }}
                                                        >
                                                            Schedule Later
                                                        </Button>
                                                    </Box>
                                                    {!isAsap && (
                                                        <TextField
                                                            type="time"
                                                            fullWidth
                                                            value={selectedTimeObj ? formatTimeForDisplay(selectedTimeObj) : ''}
                                                            onChange={handleTimeChange}
                                                            error={!!timeError}
                                                            helperText={timeError ? timeError : `Available: ${formatTimeForDisplay(minTime)} - ${formatTimeForDisplay(maxTime)}`}
                                                            FormHelperTextProps={{ sx: { color: timeError ? '#ff6b6b' : 'rgba(255, 255, 255, 0.5)', mt: 1 } }}
                                                            InputProps={{ sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7070ff' } } }}
                                                            inputProps={{ step: 300, min: formatTimeForDisplay(minTime), max: formatTimeForDisplay(maxTime) }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                    
                                    {/* Order Summary and Submit Button */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            bgcolor: 'rgba(20, 20, 40, 0.4)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            mt: 2
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>
                                                Order Total:
                                            </Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                                                Rs {totalPrice.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={handleConfirm}
                                            disabled={!selectedRice || selectedCurries.length === 0 || (!isAsap && !selectedTimeObj) || loading}
                                            endIcon={<CheckCircleIcon />}
                                            sx={{
                                                mt: 2,
                                                py: 1.5,
                                                borderRadius: '12px',
                                                background: 'linear-gradient(90deg, #50c878, #4caf50)',
                                                boxShadow: '0 0 20px rgba(80, 200, 120, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(90deg, #60d888, #5cbf60)',
                                                    boxShadow: '0 0 30px rgba(80, 200, 120, 0.5)'
                                                },
                                                '&:disabled': {
                                                    background: 'rgba(100,100,100,0.2)',
                                                    color: 'rgba(255,255,255,0.3)'
                                                }
                                            }}
                                        >
                                            {loading ? 'Placing Order...' : 'Place Order'}
                                        </Button>
                                        
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            size="large"
                                            onClick={() => setShowConfirmation(false)}
                                            sx={{
                                                mt: 1.5,
                                                py: 1.5,
                                                borderRadius: '12px',
                                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                '&:hover': {
                                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                                }
                                            }}
                                        >
                                            Back to Editing
                                        </Button>
                                    </Paper>
                                </Box>
                            </>
                        ) : (
                            // Token generated screen
                            <>
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
                                                '0 0 20px rgba(120, 120, 255, 0.5)',
                                                '0 0 40px rgba(120, 120, 255, 0.7)',
                                                '0 0 20px rgba(120, 120, 255, 0.5)'
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
                                            border: '2px solid rgba(100, 100, 255, 0.3)',
                                            boxShadow: '0 0 30px rgba(120, 120, 255, 0.6)',
                                        }}
                                    />
                                    <Box
                                        component="img"
                                        src={selectedRice?.imageUrl}
                                        alt="Your Meal"
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
                                            border: '1px solid rgba(100,100,255,0.3)',
                                            boxShadow: '0 0 20px rgba(100,100,255,0.5)',
                                            zIndex: 20
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                                            #{orderToken}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    <Typography variant="body1" sx={{ mb: 3, maxWidth: 500, mx: 'auto', color: 'rgba(255,255,255,0.7)' }}>
                                        Your order has been confirmed! You'll be redirected to the queue view shortly.
                                    </Typography>
                                    <Box sx={{ width: '100%', mt: 2 }}>
                                        <LinearProgress
                                            color="primary"
                                            sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7070ff, #a050a0)', borderRadius: 4 } }}
                                        />
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                ) : (
                    // Main build interface
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        {/* Left: Interactive Plate Display */}
                        <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 50%' }, height: { xs: 350, md: 'auto' }, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                            <RicePlate selectedRice={selectedRice} selectedCurries={selectedCurries} />
                            <Tooltip title="Generate a random combination">
                                <IconButton
                                    component={motion.button}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSurpriseMe}
                                    sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.7)', color: '#f5f5f5', border: '2px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', boxShadow: '0 0 15px rgba(100,100,255,0.5)', '&:hover': { bgcolor: 'rgba(70,70,255,0.2)' } }}
                                >
                                    <CasinoIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {/* Right: Item Selection Interface */}
                        <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 50%' }, display: 'flex', flexDirection: 'column' }}>
                            <Paper
                                elevation={0}
                                sx={{ p: 3, borderRadius: '24px', bgcolor: 'rgba(20, 20, 40, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(100, 100, 255, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <Fade in={activeStep === 0}>
                                    <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
                                        <ItemCarousel items={options.riceOptions} selectedItems={selectedRice} onSelect={handleItemSelect} title="Choose Your Rice Base" type="rice" />
                                    </Box>
                                </Fade>
                                <Fade in={activeStep >= 1}>
                                    <Box sx={{ display: activeStep >= 1 ? 'block' : 'none' }}>
                                        <ItemCarousel items={options.curryOptions} selectedItems={selectedCurries} onSelect={handleItemSelect} title="Add Your Curries" type="curry" />
                                    </Box>
                                </Fade>
                                <Fade in={activeStep >= 2}>
                                    <Box sx={{ display: activeStep >= 2 ? 'block' : 'none' }}>
                                        <ItemCarousel items={options.extrasOptions} selectedItems={selectedExtras} onSelect={handleItemSelect} title="Add Extra Items" type="extras" />
                                    </Box>
                                </Fade>
                                <Box sx={{ mt: 'auto', pt: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' }}>
                                        Your Selection
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2, minHeight: 32 }}>
                                        {selectedItems.map(item => (
                                            <Chip
                                                key={item.id}
                                                label={`${item.name} - Rs ${item.price}`}
                                                onDelete={() => handleItemSelect(item)}
                                                sx={{ bgcolor: 'rgba(100,100,255,0.1)', color: 'white', border: '1px solid rgba(100,100,255,0.3)', '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } } }}
                                            />
                                        ))}
                                    </Box>
                                    {activeStep >= 2 && (
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            onClick={() => setShowConfirmation(true)}
                                            disabled={!selectedRice || selectedCurries.length === 0}
                                            endIcon={<CheckCircleIcon />}
                                            sx={{ mt: 2, py: 1.5, borderRadius: '16px', background: 'linear-gradient(90deg, #7070ff, #a050a0)', boxShadow: '0 10px 20px rgba(100,100,255,0.3)', '&:hover': { background: 'linear-gradient(90deg, #8080ff, #b060b0)' }, '&:disabled': { background: 'rgba(100,100,100,0.2)', color: 'rgba(255,255,255,0.3)' } }}
                                        >
                                            Confirm Your Plate
                                        </Button>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                )}
            </Container>

            {/* Floating Price Bar */}
            <AnimatePresence>
                {selectedRice && !showConfirmation && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        <Paper
                            elevation={10}
                            sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(20, 20, 40, 0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(100, 100, 255, 0.2)', color: 'white' }}
                        >
                            <Box>
                                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                    Total Price
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold', background: 'linear-gradient(90deg, #ffffff, #a0a0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                >
                                    Rs {totalPrice.toFixed(2)}
                                </Typography>
                            </Box>
                            {activeStep < 2 ? (
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => setActiveStep(prev => Math.min(prev + 1, 3))}
                                    endIcon={<AddCircleIcon />}
                                    sx={{ borderRadius: '16px', px: 3, background: 'linear-gradient(90deg, #7070ff, #a050a0)', boxShadow: '0 0 20px rgba(100,100,255,0.3)', '&:hover': { background: 'linear-gradient(90deg, #8080ff, #b060b0)' } }}
                                >
                                    Add More
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => setShowConfirmation(true)}
                                    endIcon={<CheckCircleIcon />}
                                    disabled={!selectedRice || selectedCurries.length === 0}
                                    sx={{ 
                                        borderRadius: '16px', 
                                        px: 3, 
                                        background: 'linear-gradient(90deg, #50c878, #4caf50)',
                                        boxShadow: '0 0 20px rgba(80, 200, 120, 0.3)', 
                                        '&:hover': { 
                                            background: 'linear-gradient(90deg, #60d888, #5cbf60)' 
                                        },
                                        '&:disabled': {
                                            background: 'rgba(100,100,100,0.2)',
                                            color: 'rgba(255,255,255,0.3)'
                                        }
                                    }}
                                >
                                    Submit Order
                                </Button>
                            )}
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};
