import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  alpha,
  useTheme,
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
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import RiceIcon from '@mui/icons-material/DinnerDining';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Sample mock data - replace with actual API calls
const mockStats = {
  totalRevenue: 25850,
  ordersToday: 43,
  activeUsers: 18,
  topSellingItems: [
    { id: 1, name: 'Rice Plate with Curry', sales: 28, category: 'rice' },
    { id: 2, name: 'Chocolate Milkshake', sales: 22, category: 'drinks' },
    { id: 3, name: 'Samosa', sales: 19, category: 'snacks' },
    { id: 4, name: 'Chicken Rice Plate', sales: 15, category: 'rice' },
  ],
  recentOrders: [
    { id: 'A112', time: '10:45 AM', items: ['Rice Plate', 'Cola'], total: 320, status: 'completed' },
    { id: 'A111', time: '10:30 AM', items: ['Chocolate Shake', 'Samosa'], total: 250, status: 'in-progress' },
    { id: 'A110', time: '10:15 AM', items: ['Rice Plate', 'Ice Cream'], total: 280, status: 'completed' },
  ],
};

const StatCard = ({ title, value, icon, color }) => {
    const theme = useTheme();
    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 56, height: 56, mr: 2 }}>
                {icon}
            </Avatar>
            <Box>
                <Typography color="text.secondary">{title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            </Box>
        </Card>
    );
};

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedSection, setSelectedSection] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const renderDashboard = () => (
    <>
      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
            <StatCard 
                title="Total Revenue (LKR)" 
                value={mockStats.totalRevenue.toLocaleString()} 
                icon={<AttachMoneyIcon />} 
                color={theme.palette.success.main}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
            <StatCard 
                title="Orders Today" 
                value={mockStats.ordersToday} 
                icon={<ReceiptIcon />} 
                color={theme.palette.info.main}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
            <StatCard 
                title="Active Users" 
                value={mockStats.activeUsers} 
                icon={<PeopleIcon />} 
                color={theme.palette.warning.main}
            />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
                <Button fullWidth variant="outlined" startIcon={<RiceIcon />} sx={{ py: 1.5, textTransform: 'none' }} onClick={() => setSelectedSection('rice-curry')}>
                    Rice & Curry
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button fullWidth variant="outlined" startIcon={<LocalDrinkIcon />} sx={{ py: 1.5, textTransform: 'none' }} onClick={() => setSelectedSection('drinks')}>
                    Drinks
                </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
                <Button fullWidth variant="outlined" startIcon={<FastfoodIcon />} sx={{ py: 1.5, textTransform: 'none' }} onClick={() => setSelectedSection('snacks')}>
                    Snacks
                </Button>
            </Grid>
             <Grid item xs={6} sm={3}>
                <Button fullWidth variant="contained" startIcon={<LocalDiningIcon />} sx={{ py: 1.5, textTransform: 'none' }} onClick={() => setSelectedSection('queue')}>
                    Queue Dashboard
                </Button>
            </Grid>
        </Grid>
      </Box>

      {/* Data Grids */}
      
    </>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard': return renderDashboard();
      case 'rice-curry': return <RiceCurryManagement />;
      case 'orders': return <OrderManagement />;
      case 'users': return <UserManagement />;
      case 'queue': return <QueueManagement />;
      case 'drinks': return (<Box sx={{ p: 3, textAlign: 'center' }}><Typography variant="h5">Drinks Management</Typography></Box>);
      case 'snacks': return (<Box sx={{ p: 3, textAlign: 'center' }}><Typography variant="h5">Snacks Management</Typography></Box>);
      default: return renderDashboard();
    }
  };

  const menuItems = [
    { key: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { key: 'orders', text: 'Order Management', icon: <ReceiptIcon /> },
    { key: 'queue', text: 'Queue Management', icon: <LocalDiningIcon /> },
    { type: 'divider', key: 'div1' },
    { type: 'header', key: 'header1', text: 'Menu Management' },
    { key: 'rice-curry', text: 'Rice & Curry', icon: <RiceIcon /> },
    { key: 'drinks', text: 'Drinks', icon: <LocalDrinkIcon /> },
    { key: 'snacks', text: 'Snacks', icon: <FastfoodIcon /> },
    { type: 'divider', key: 'div2' },
    { key: 'users', text: 'User Management', icon: <PeopleIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f8fa' }}>
      {/* Left Sidebar */}
      <Box component={Paper} elevation={2} sx={{ width: 260, flexShrink: 0, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', borderRight: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 1 }}>
          <RestaurantIcon sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Canteen Admin</Typography>
        </Box>
        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map(item => {
            if (item.type === 'divider') return <Divider key={item.key} sx={{ my: 1 }} />;
            if (item.type === 'header') return <Typography key={item.key} variant="overline" color="text.secondary" sx={{ px: 2, py: 1 }}>{item.text}</Typography>;
            
            const isSelected = selectedSection === item.key;
            return (
              <ListItem button key={item.key} selected={isSelected} component={motion.div} whileHover={{ x: 4 }} sx={{ borderRadius: 1, mb: 0.5, bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'transparent' }} onClick={() => setSelectedSection(item.key)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: isSelected ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.1), color: isSelected ? '#fff' : theme.palette.text.primary }}>
                    {item.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}><PersonIcon /></Avatar>
            <Box>
              <Typography variant="subtitle2">{user?.name || 'Admin User'}</Typography>
              <Typography variant="caption" color="text.secondary">Administrator</Typography>
            </Box>
          </Box>
          <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {menuItems.find(item => item.key === selectedSection)?.text || 'Dashboard'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Welcome back! Here's an overview of your canteen's performance.
            </Typography>
          </Box>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;