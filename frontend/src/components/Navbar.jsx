import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Link } from '@mui/material';

// A good practice is to pass user details as props
export default function EnhancedNavbar({ userName = 'Student', onLogout }) {
  const navigate = useNavigate();
  // State to manage the dropdown menu's anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Handler to open the menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler to close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handler for logout action
  const handleLogout = () => {
    handleClose(); // Close the menu first
    onLogout();   // Then call the passed logout function
  };

  // Handler for navigating to profile
  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0', // A slightly softer border
      }}
    >
      <Toolbar>
        {/* Left Section: Dashboard Title and Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            <Link href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
              Dashboard
            </Link>
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
          <Button 
            color="inherit" 
            startIcon={<RestaurantMenuIcon />}
            onClick={() => navigate('/meal-builder')}
            sx={{ mr: 2 }}
          >
            Order Food
          </Button>
          <Button 
            color="inherit" 
            startIcon={<ReceiptLongIcon />}
            onClick={() => navigate('/queue')}
            sx={{ mr: 2 }}
          >
            View Queue
          </Button>
            <Button
              color="inherit"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => navigate('/admin')}
            >
              Staff Dashboard
            </Button>
        </Box>

        {/* This Box will grow and push the profile section to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section: Profile Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handleMenu}
            size="small"
            sx={{ ml: 2, borderRadius: '8px', p: 0.5 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
              {userName.charAt(0)}
            </Avatar>
            <Typography sx={{ ml: 1, mr: 1, fontWeight: 500, color: 'text.primary' }}>
              {userName}
            </Typography>
          </IconButton>
        </Box>

        {/* The Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <AccountCircleIcon sx={{ mr: 1.5 }} /> My Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 1.5 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}