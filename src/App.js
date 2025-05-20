import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
// Import other components as needed

const theme = createTheme({
  // Add your theme configuration here
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
          
          {/* Add other routes here */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 