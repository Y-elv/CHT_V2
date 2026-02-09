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
      console.log("[PROTECTED ROUTE] Checking authentication...");
      const result = await fetchProfile();
      
      if (!result.success) {
        console.log("[PROTECTED ROUTE] Auth check failed, redirecting to login");
        navigate("/login");
      }
    };

    checkAuth();
    return <LoadingSpinner />;
  }

  // If still not authenticated after check, redirect to login
  if (!isAuthenticated) {
    console.log("[PROTECTED ROUTE] Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render children
  console.log("[PROTECTED ROUTE] User authenticated, rendering protected content");
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

  // Check if user is doctor
  if (user?.role !== "doctor") {
    console.log("[PROTECTED ROUTE] User is not a doctor, redirecting");
    return <Navigate to="/" replace />;
  }

  // Check if doctor is approved
  if (user?.doctorStatus !== "approved") {
    console.log("[PROTECTED ROUTE] Doctor not approved, redirecting to login");
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
