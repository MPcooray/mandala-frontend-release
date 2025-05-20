import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/orders')}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Order #{order.orderNumber}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Placed on {new Date(order.orderDate).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Typography>Name: {order.username}</Typography>
            <Typography>Email: {order.email}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography>
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={order.status}
                label="Status"
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="PROCESSING">Processing</MenuItem>
                <MenuItem value="SHIPPED">Shipped</MenuItem>
                <MenuItem value="DELIVERED">Delivered</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            {order.items.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography>
                  Product ID: {item.productId}
                  <br />
                  Quantity: {item.quantity}
                  {item.selectedColor && ` | Color: ${item.selectedColor}`}
                  {item.selectedSize && ` | Size: ${item.selectedSize}`}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Typography>Method: {order.paymentMethod}</Typography>
            <Typography>Status: {order.isPaid ? 'Paid' : 'Unpaid'}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography>Subtotal: ${order.subtotal}</Typography>
            <Typography>Shipping: ${order.shippingCost}</Typography>
            <Typography variant="h6">Total: ${order.total}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminOrderDetails; 