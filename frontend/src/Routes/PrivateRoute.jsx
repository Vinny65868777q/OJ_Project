import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log("isLoggedIn:", isLoggedIn, "loading:", loading);


  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;