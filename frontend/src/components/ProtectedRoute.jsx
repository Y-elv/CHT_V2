import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

// Loading component
const LoadingSpinner = () => (
  <Box
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <VStack spacing={4} align="center">
      <Spinner size="xl" color="blue.500" thickness="4px" />
      <Text color="gray.600" mt={4}>
        Checking authentication...
      </Text>
    </VStack>
  </Box>
);

// Admin Protected Route
export const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Doctor Protected Route
export const DoctorProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== "doctor") {
    return <Navigate to="/" replace />;
  }
  if (user?.doctorStatus !== "approved") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Patient Protected Route
export const PatientProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== "patient") {
    return <Navigate to="/" replace />;
  }
  return children;
};

// General Protected Route
export const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
