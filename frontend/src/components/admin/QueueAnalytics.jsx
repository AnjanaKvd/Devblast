import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';

const QueueAnalytics = ({ orders, refreshData }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('today');
  const [chartType, setChartType] = useState('bar');
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  useEffect(() => {
    // Filter orders based on selected time range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let filtered;
    switch (timeRange) {
      case 'today':
        filtered = orders.filter(order => new Date(order.createdAt) >= today);
        break;
      case 'thisWeek':
        filtered = orders.filter(order => new Date(order.createdAt) >= thisWeekStart);
        break;
      case 'thisMonth':
        filtered = orders.filter(order => new Date(order.createdAt) >= thisMonthStart);
        break;
      case 'all':
      default:
        filtered = [...orders];
        break;
    }
    setFilteredOrders(filtered);
  }, [orders, timeRange]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Calculate analytics data
  const getAnalyticsData = () => {
    // Orders by status
    const ordersByStatus = {
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      inProgress: filteredOrders.filter(o => o.status === 'in-progress').length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
    };
    
    // Orders by type (based on items)
    const ordersByType = {
      rice: 0,
      drinks: 0,
      snacks: 0,
      other: 0
    };
    
    filteredOrders.forEach(order => {
      if (order.items && order.items.length > 0) {
        let hasRice = false;
        let hasDrinks = false;
        let hasSnacks = false;
        
        order.items.forEach(item => {
          if (item.category === 'rice') hasRice = true;
          else if (item.category === 'drinks') hasDrinks = true;
          else if (item.category === 'snacks') hasSnacks = true;
        });
        
        if (hasRice) ordersByType.rice++;
        if (hasDrinks) ordersByType.drinks++;
        if (hasSnacks) ordersByType.snacks++;
        if (!hasRice && !hasDrinks && !hasSnacks) ordersByType.other++;
      }
    });
    
    // Calculate average processing time (for completed orders)
    const completedOrders = filteredOrders.filter(o => o.status === 'completed');
    let avgProcessingTime = 0;
    
    if (completedOrders.length > 0) {
      const totalProcessingTime = completedOrders.reduce((sum, order) => {
        const createdTime = new Date(order.createdAt).getTime();
        const updatedTime = new Date(order.updatedAt).getTime();
        return sum + (updatedTime - createdTime) / (1000 * 60); // in minutes
      }, 0);
      
      avgProcessingTime = Math.round(totalProcessingTime / completedOrders.length);
    }
    
    // Calculate peak hours
    const hourCounts = {};
    filteredOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const peakHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b, 0);
    
    // Calculate busiest counter
    const counterCounts = {};
    filteredOrders.forEach(order => {
      const counter = order.counter || 1;
      counterCounts[counter] = (counterCounts[counter] || 0) + 1;
    });
    
    const busiestCounter = Object.keys(counterCounts).reduce((a, b) => 
      counterCounts[a] > counterCounts[b] ? a : b, 1);
    
    return {
      ordersByStatus,
      ordersByType,
      avgProcessingTime,
      peakHour,
      busiestCounter,
      totalOrders: filteredOrders.length,
      totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.totalAmount || order.totalPrice || 0), 0)
    };
  };
  
  const analyticsData = getAnalyticsData();
  
  // Helper function to format time
  const formatHour = (hour) => {
    const h = parseInt(hour);
    return `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;
  };
  
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Queue Analytics
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            size="small"
            onClick={refreshData}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="analytics tabs"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab icon={<AssessmentIcon />} label="Overview" />
        <Tab icon={<StackedBarChartIcon />} label="Orders by Status" />
        <Tab icon={<PieChartIcon />} label="Orders by Type" />
        <Tab icon={<TimelineIcon />} label="Processing Times" />
      </Tabs>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Total Orders
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                  {analyticsData.totalOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {timeRange === 'today' ? 'Today' : 
                   timeRange === 'thisWeek' ? 'This Week' : 
                   timeRange === 'thisMonth' ? 'This Month' : 'All Time'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Total Revenue
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                  Rs {analyticsData.totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {timeRange === 'today' ? 'Today' : 
                   timeRange === 'thisWeek' ? 'This Week' : 
                   timeRange === 'thisMonth' ? 'This Month' : 'All Time'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Avg. Processing Time
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                  {analyticsData.avgProcessingTime} min
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For completed orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card
              component={motion.div}
              whileHover={{ y: -5 }}
              sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05) }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Peak Hour
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                  {formatHour(analyticsData.peakHour)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Most orders received
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                Orders by Status
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.warning.main, 0.2),
                      color: theme.palette.warning.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByStatus.pending}
                  </Box>
                  <Typography variant="body2">Pending</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.info.main, 0.2),
                      color: theme.palette.info.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByStatus.inProgress}
                  </Box>
                  <Typography variant="body2">In Progress</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.success.main, 0.2),
                      color: theme.palette.success.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByStatus.completed}
                  </Box>
                  <Typography variant="body2">Completed</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                      color: theme.palette.error.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByStatus.cancelled}
                  </Box>
                  <Typography variant="body2">Cancelled</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, height: '100%' }}
            >
              <Typography variant="h6" gutterBottom>
                Orders by Type
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByType.rice}
                  </Box>
                  <Typography variant="body2">Rice</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.info.main, 0.2),
                      color: theme.palette.info.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByType.drinks}
                  </Box>
                  <Typography variant="body2">Drinks</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.secondary.main, 0.2),
                      color: theme.palette.secondary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByType.snacks}
                  </Box>
                  <Typography variant="body2">Snacks</Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.grey[500], 0.2),
                      color: theme.palette.grey[700],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {analyticsData.ordersByType.other}
                  </Box>
                  <Typography variant="body2">Other</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Orders by Status
          </Typography>
          {/* A placeholder for a proper chart component */}
          <Box sx={{ height: 300, mt: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 100, 
                  height: `${(analyticsData.ordersByStatus.pending / analyticsData.totalOrders) * 250}px`,
                  bgcolor: theme.palette.warning.main,
                  borderRadius: '4px 4px 0 0',
                  minHeight: 20,
                  transition: 'height 0.5s ease'
                }} 
              />
              <Typography variant="body2" sx={{ mt: 1 }}>Pending</Typography>
              <Typography variant="body1" fontWeight="bold">{analyticsData.ordersByStatus.pending}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 100, 
                  height: `${(analyticsData.ordersByStatus.inProgress / analyticsData.totalOrders) * 250}px`,
                  bgcolor: theme.palette.info.main,
                  borderRadius: '4px 4px 0 0',
                  minHeight: 20,
                  transition: 'height 0.5s ease'
                }} 
              />
              <Typography variant="body2" sx={{ mt: 1 }}>In Progress</Typography>
              <Typography variant="body1" fontWeight="bold">{analyticsData.ordersByStatus.inProgress}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 100, 
                  height: `${(analyticsData.ordersByStatus.completed / analyticsData.totalOrders) * 250}px`,
                  bgcolor: theme.palette.success.main,
                  borderRadius: '4px 4px 0 0',
                  minHeight: 20,
                  transition: 'height 0.5s ease'
                }} 
              />
              <Typography variant="body2" sx={{ mt: 1 }}>Completed</Typography>
              <Typography variant="body1" fontWeight="bold">{analyticsData.ordersByStatus.completed}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 100, 
                  height: `${(analyticsData.ordersByStatus.cancelled / analyticsData.totalOrders) * 250}px`,
                  bgcolor: theme.palette.error.main,
                  borderRadius: '4px 4px 0 0',
                  minHeight: 20,
                  transition: 'height 0.5s ease'
                }} 
              />
              <Typography variant="body2" sx={{ mt: 1 }}>Cancelled</Typography>
              <Typography variant="body1" fontWeight="bold">{analyticsData.ordersByStatus.cancelled}</Typography>
            </Box>
          </Box>
        </Box>
      )}
      
      {tabValue === 2 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Orders by Type
          </Typography>
          {/* A placeholder for a proper chart component */}
          <Box sx={{ 
            height: 300, 
            mt: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative'
          }}>
            <Box sx={{ 
              width: 300, 
              height: 300, 
              borderRadius: '50%', 
              position: 'relative',
              background: `conic-gradient(
                ${theme.palette.primary.main} 0% ${analyticsData.ordersByType.rice / analyticsData.totalOrders * 100}%, 
                ${theme.palette.info.main} ${analyticsData.ordersByType.rice / analyticsData.totalOrders * 100}% ${(analyticsData.ordersByType.rice + analyticsData.ordersByType.drinks) / analyticsData.totalOrders * 100}%, 
                ${theme.palette.secondary.main} ${(analyticsData.ordersByType.rice + analyticsData.ordersByType.drinks) / analyticsData.totalOrders * 100}% ${(analyticsData.ordersByType.rice + analyticsData.ordersByType.drinks + analyticsData.ordersByType.snacks) / analyticsData.totalOrders * 100}%,
                ${theme.palette.grey[500]} ${(analyticsData.ordersByType.rice + analyticsData.ordersByType.drinks + analyticsData.ordersByType.snacks) / analyticsData.totalOrders * 100}% 100%
              )`,
              transform: 'rotate(-90deg)'
            }} />
            
            <Box sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%', 
              bgcolor: 'white',
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Typography variant="h6">{analyticsData.totalOrders}</Typography>
              <Typography variant="caption">Total Orders</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="body2">Rice ({analyticsData.ordersByType.rice})</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.info.main, mr: 1 }} />
              <Typography variant="body2">Drinks ({analyticsData.ordersByType.drinks})</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="body2">Snacks ({analyticsData.ordersByType.snacks})</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.grey[500], mr: 1 }} />
              <Typography variant="body2">Other ({analyticsData.ordersByType.other})</Typography>
            </Box>
          </Box>
        </Box>
      )}
      
      {tabValue === 3 && (
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}
              >
                <Typography variant="h6" gutterBottom>
                  Average Processing Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                  <Box 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      border: `8px solid ${theme.palette.info.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold">{analyticsData.avgProcessingTime}</Typography>
                    <Typography variant="caption">minutes</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  Average time from order placement to completion
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}
              >
                <Typography variant="h6" gutterBottom>
                  Busiest Counter
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                  <Box 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      border: `8px solid ${theme.palette.warning.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold">{analyticsData.busiestCounter}</Typography>
                    <Typography variant="caption">counter</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  Counter with the most orders processed
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default QueueAnalytics;
