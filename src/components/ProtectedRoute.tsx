import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useProfile } from '../contexts/ProfileContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { profile, loading } = useProfile();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress />
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  if (!profile && location.pathname !== '/perfil') {
    return <Navigate to="/perfil" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 