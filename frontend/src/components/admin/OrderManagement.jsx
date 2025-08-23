import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Badge,
  Divider,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import PrintIcon from '@mui/icons-material/Print';
import * as api from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.getOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handlePrintOrder = (order) => {
    const printContent = `
      Order Token: ${order.id}
      Status: ${order.status}
      Total: Rs ${order.totalPrice}
      Items: ${order.items.map(item => item.name).join(', ')}
      Time: ${new Date(order.createdAt).toLocaleString()}
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            .order-info { margin-bottom: 20px; }
            .item { margin-bottom: 10px; }
            .footer { margin-top: 30px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <h2>Order Receipt</h2>
          <div class="order-info">
            <p><strong>Token:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(order.createdAt).toLocaleTimeString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <h3>Items:</h3>
          ${order.items.map(item => `
            <div class="item">
              <p>${item.name} - Rs ${item.price}</p>
            </div>
          `).join('')}
          <div class="order-info">
            <p><strong>Total:</strong> Rs ${order.totalPrice}</p>
          </div>
          <div class="footer">
            <p>Thank you for your order!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'rice':
        return <LocalDiningIcon />;
      case 'drinks':
        return <LocalDrinkIcon />;
      case 'snacks':
        return <FastfoodIcon />;
      default:
        return <RestaurantIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Order Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedOrder ? 7 : 12}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            {order.items.slice(0, 2).map((item, index) => (
                              <Chip
                                key={index}
                                size="small"
                                label={item.name}
                                icon={getCategoryIcon(item.category)}
                              />
                            ))}
                            {order.items.length > 2 && (
                              <Chip
                                size="small"
                                label={`+${order.items.length - 2} more`}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>Rs {order.totalPrice}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" fullWidth>
                            <Select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              renderValue={(selected) => (
                                <Chip
                                  size="small"
                                  label={selected.charAt(0).toUpperCase() + selected.slice(1)}
                                  color={getStatusColor(selected)}
                                />
                              )}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="in-progress">In Progress</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewOrder(order)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print Receipt">
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={() => handlePrintOrder(order)}
                            >
                              <PrintIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
        
        {selectedOrder && (
          <Grid item xs={12} md={5}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: 2, 
              position: 'sticky', 
              top: 20,
              maxHeight: 'calc(100vh - 200px)',
              overflow: 'auto'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Order Details
                  </Typography>
                  <Chip 
                    label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    color={getStatusColor(selectedOrder.status)}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Token
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {selectedOrder.id}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Estimated Preparation Time
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedOrder.estimatedTime} minutes
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Counter
                  </Typography>
                  <Typography variant="body1">
                    {selectedOrder.counter}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Items
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  {selectedOrder.items.map((item, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < selectedOrder.items.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main
                          }}
                        >
                          {getCategoryIcon(item.category)}
                        </Avatar>
                        <Typography variant="body2">
                          {item.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        Rs {item.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    Rs {selectedOrder.totalPrice}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default OrderManagement;
