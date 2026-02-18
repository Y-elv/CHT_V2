import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Spinner, VStack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

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

// Main Protected Route component
export const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  // If loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, try to fetch profile
  if (!isAuthenticated && !user) {
    const checkAuth = async () => {
      const result = await fetchProfile();
      if (!result.success) navigate("/login");
    };

    checkAuth();
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role-based protected routes
export const DoctorProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  // If loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, try to fetch profile
  if (!isAuthenticated && !user) {
    const checkAuth = async () => {
      const result = await fetchProfile();
      
      if (!result.success) {
        navigate("/login");
      }
    };

    checkAuth();
    return <LoadingSpinner />;
  }

  // If still not authenticated after check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "doctor") {
    return <Navigate to="/" replace />;
  }
  if (user?.doctorStatus !== "approved") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PatientProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  // If loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, try to fetch profile
  if (!isAuthenticated && !user) {
    const checkAuth = async () => {
      const result = await fetchProfile();
      
      if (!result.success) {
        navigate("/login");
      }
    };

    checkAuth();
    return <LoadingSpinner />;
  }

  // If still not authenticated after check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is patient
  if (user?.role !== "patient") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  // If loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, try to fetch profile
  if (!isAuthenticated && !user) {
    const checkAuth = async () => {
      const result = await fetchProfile();
      
      if (!result.success) {
        navigate("/login");
      }
    };

    checkAuth();
    return <LoadingSpinner />;
  }

  // If still not authenticated after check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};
