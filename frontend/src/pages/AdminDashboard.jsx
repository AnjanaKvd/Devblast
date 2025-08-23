import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Components
import RiceCurryManagement from '../components/admin/RiceCurryManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import QueueManagement from '../components/admin/QueueManagement';

// Icons
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import RiceIcon from '@mui/icons-material/DinnerDining';

// Sample mock data - replace with actual API calls
const mockStats = {
  totalRevenue: 25850,
  ordersToday: 43,
  activeUsers: 18,
  topSellingItems: [
    { id: 1, name: "Rice Plate with Curry", sales: 28, category: "rice" },
    { id: 2, name: "Chocolate Milkshake", sales: 22, category: "drinks" },
    { id: 3, name: "Samosa", sales: 19, category: "snacks" },
    { id: 4, name: "Chicken Rice Plate", sales: 15, category: "rice" }
  ],
  recentOrders: [
    { id: "A112", time: "10:45 AM", items: ["Rice Plate", "Cola"], total: 320, status: "completed" },
    { id: "A111", time: "10:30 AM", items: ["Chocolate Shake", "Samosa"], total: 250, status: "in-progress" },
    { id: "A110", time: "10:15 AM", items: ["Rice Plate", "Ice Cream"], total: 280, status: "completed" },
    { id: "A109", time: "10:00 AM", items: ["Sandwich", "Sprite"], total: 300, status: "completed" }
  ],
  inventory: {
    lowStock: [
      { id: 1, name: "Chicken", current: 3, minimum: 5 },
      { id: 2, name: "Rice", current: 8, minimum: 10 }
    ]
  }
};

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [tabValue, setTabValue] = useState(0);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return renderDashboard();
      case 'rice-curry':
        return <RiceCurryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'queue':
        return <QueueManagement />;
      case 'drinks':
        return (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" gutterBottom>Drinks Management</Typography>
            <Typography variant="body1">Manage drinks and beverages here.</Typography>
          </Box>
        );
      case 'snacks':
        return (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" gutterBottom>Snacks Management</Typography>
            <Typography variant="body1">Manage snacks and short eats here.</Typography>
          </Box>
        );
      default:
        return renderDashboard();
    }
  };
  
  const renderDashboard = () => (
    <>      
      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<RiceIcon />}
              sx={{ py: 1.5, textTransform: 'none' }}
              onClick={() => setSelectedSection('rice-curry')}
            >
              Rice & Curry
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<LocalDrinkIcon />}
              sx={{ py: 1.5, textTransform: 'none' }}
              onClick={() => setSelectedSection('drinks')}
            >
              Drinks
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<FastfoodIcon />}
              sx={{ py: 1.5, textTransform: 'none' }}
              onClick={() => setSelectedSection('snacks')}
            >
              Snacks
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<PeopleIcon />}
              sx={{ py: 1.5, textTransform: 'none' }}
              onClick={() => setSelectedSection('users')}
            >
              Users
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
  
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: '#f5f8fa'
    }}>
      {/* Left Sidebar */}
      <Box 
        component={Paper} 
        elevation={2}
        sx={{ 
          width: 260, 
          flexShrink: 0,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRight: `1px solid ${theme.palette.divider}`,
          pt: 2
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
          <RestaurantIcon sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Canteen Admin
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Navigation Menu */}
        <List sx={{ px: 2 }}>
          <ListItem 
            button 
            selected={selectedSection === 'dashboard'}
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              bgcolor: selectedSection === 'dashboard' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
            }}
            onClick={() => setSelectedSection('dashboard')}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: selectedSection === 'dashboard' 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.grey[500], 0.2),
                color: selectedSection === 'dashboard'
                  ? theme.palette.primary.main
                  : theme.palette.grey[700]
              }}>
                <DashboardIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Dashboard" />
          </ListItem>
          
          <ListItem 
            button 
            selected={selectedSection === 'orders'}
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              bgcolor: selectedSection === 'orders' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
            }}
            onClick={() => setSelectedSection('orders')}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: selectedSection === 'orders' 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.grey[500], 0.2),
                color: selectedSection === 'orders'
                  ? theme.palette.primary.main
                  : theme.palette.grey[700]
              }}>
                <ReceiptIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Order Management" />
          </ListItem>
          
          <ListItem 
            button 
            selected={selectedSection === 'queue'}
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              bgcolor: selectedSection === 'queue' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
            }}
            onClick={() => setSelectedSection('queue')}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: selectedSection === 'queue' 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.grey[500], 0.2),
                color: selectedSection === 'queue'
                  ? theme.palette.primary.main
                  : theme.palette.grey[700]
              }}>
                <LocalDiningIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Queue Management" />
          </ListItem>
          
          <Divider sx={{ my: 2 }} />
          <Typography variant="overline" color="text.secondary" sx={{ px: 2, py: 1 }}>
            Menu Management
          </Typography>
          
          <ListItem 
            button 
            selected={selectedSection === 'rice-curry'}
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              bgcolor: selectedSection === 'rice-curry' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
            }}
            onClick={() => setSelectedSection('rice-curry')}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: selectedSection === 'rice-curry' 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.grey[500], 0.2),
                color: selectedSection === 'rice-curry'
                  ? theme.palette.primary.main
                  : theme.palette.grey[700]
              }}>
                <RiceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Rice & Curry" />
          </ListItem>
          
          <ListItem 
            button 
            selected={selectedSection === 'drinks'}
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              bgcolor: selectedSection === 'drinks' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
            }}
            onClick={() => setSelectedSection('drinks')}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: selectedSection === 'drinks' 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.grey[500], 0.2),
                color: selectedSection === 'drinks'
                  ? theme.palette.primary.main
                  : theme.palette.grey[700]
              }}>
                <LocalDrinkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Drinks" />
          </ListItem>
          
          <ListItem 
            button 
            selected={selectedSection === 'snacks'}
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              bgcolor: selectedSection === 'snacks' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
            }}
            onClick={() => setSelectedSection('snacks')}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: selectedSection === 'snacks' 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.grey[500], 0.2),
                color: selectedSection === 'snacks'
                  ? theme.palette.primary.main
                  : theme.palette.grey[700]
              }}>
                <FastfoodIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Snacks" />
          </ListItem>
          
          <Divider sx={{ my: 2 }} />
          
          <ListItem 
            button 
            selected={selectedSection === 'users'}
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1,
              bgcolor: selectedSection === 'users' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
            }}
            onClick={() => setSelectedSection('users')}
          >
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: selectedSection === 'users' 
                  ? alpha(theme.palette.primary.main, 0.2) 
                  : alpha(theme.palette.grey[500], 0.2),
                color: selectedSection === 'users'
                  ? theme.palette.primary.main
                  : theme.palette.grey[700]
              }}>
                <PeopleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="User Management" />
          </ListItem>
          
          <ListItem 
            button 
            component={motion.div}
            whileHover={{ x: 4 }}
            sx={{ 
              borderRadius: 1,
              mb: 1
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: alpha(theme.palette.grey[500], 0.2), color: theme.palette.grey[700] }}>
                <SettingsIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* User Profile */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle2">{user?.name || 'Admin User'}</Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Box>
          
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {selectedSection === 'dashboard' && 'Admin Dashboard'}
              {selectedSection === 'rice-curry' && 'Rice & Curry Management'}
              {selectedSection === 'drinks' && 'Drinks Management'}
              {selectedSection === 'snacks' && 'Snacks Management'}
              {selectedSection === 'orders' && 'Order Management'}
              {selectedSection === 'queue' && 'Queue Management'}
              {selectedSection === 'users' && 'User Management'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedSection === 'dashboard' && "Welcome back! Here's what's happening with your canteen today."}
              {selectedSection === 'rice-curry' && "Manage rice and curry items, prices, and availability."}
              {selectedSection === 'drinks' && "Manage drinks, beverages, and their availability."}
              {selectedSection === 'snacks' && "Manage snacks, short eats, and other food items."}
              {selectedSection === 'orders' && "View and manage customer orders and their status."}
              {selectedSection === 'queue' && "Manage the order queue and track order progress."}
              {selectedSection === 'users' && "Manage user accounts, roles, and permissions."}
            </Typography>
          </Box>
          
          {/* Main Content based on selected section */}
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
