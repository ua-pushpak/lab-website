import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, send them back to login
    return <Navigate to="/admin-login" replace />;
  }

  // If token exists, show the admin panel
  return children;
};

export default ProtectedRoute;