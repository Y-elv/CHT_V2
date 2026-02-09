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
    console.log("[PROTECTED ROUTE] Admin route - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    console.log("[PROTECTED ROUTE] Admin route - User not admin, redirecting");
    return <Navigate to="/" replace />;
  }

  console.log("[PROTECTED ROUTE] Admin route - Access granted");
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
    console.log("[PROTECTED ROUTE] Doctor route - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "doctor") {
    console.log("[PROTECTED ROUTE] Doctor route - User not doctor, redirecting");
    return <Navigate to="/" replace />;
  }

  if (user?.doctorStatus !== "approved") {
    console.log("[PROTECTED ROUTE] Doctor route - Doctor not approved, redirecting");
    return <Navigate to="/login" replace />;
  }

  console.log("[PROTECTED ROUTE] Doctor route - Access granted");
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
    console.log("[PROTECTED ROUTE] Patient route - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "patient") {
    console.log("[PROTECTED ROUTE] Patient route - User not patient, redirecting");
    return <Navigate to="/" replace />;
  }

  console.log("[PROTECTED ROUTE] Patient route - Access granted");
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
    console.log("[PROTECTED ROUTE] General route - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("[PROTECTED ROUTE] General route - Access granted");
  return children;
};
