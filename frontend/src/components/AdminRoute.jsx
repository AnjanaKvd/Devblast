import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  // Check if user exists and has admin role
  if (!user || user.role !== 'admin') {
    // Redirect to login if not logged in, or to dashboard if logged in but not admin
    return <Navigate to={user ? '/dashboard' : '/login'} />;
  }
  
  return children;
};

export default AdminRoute;
