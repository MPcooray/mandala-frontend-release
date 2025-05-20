import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      // Refresh orders after update
      fetchOrders();
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.username}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PROCESSING">Processing</MenuItem>
                    <MenuItem value="SHIPPED">Shipped</MenuItem>
                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.location.href = `/admin/orders/${order.id}`}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminOrders; 