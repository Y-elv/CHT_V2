import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

// Admin Protected Route
export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Doctor Protected Route (requires approved status)
export const DoctorProtectedRoute = ({ children }) => {
  const { isAuthenticated, isDoctor, loading, user } = useAuth();

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is doctor
  if (user?.role !== "doctor") {
    return <Navigate to="/" replace />;
  }

  // Check if doctor is approved
  if (user?.doctorStatus !== "approved") {
    return <Navigate to="/login" replace state={{ message: "Your doctor account is pending approval." }} />;
  }

  return children;
};

// Patient Protected Route
export const PatientProtectedRoute = ({ children }) => {
  const { isAuthenticated, isPatient, loading } = useAuth();

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isPatient()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// General Protected Route (any authenticated user)
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  // Check if user info exists in localStorage (don't redirect if it does)
  const hasUserInfo = () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
      const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
      return !!(token || userInfo);
    } catch {
      return false;
    }
  };

  // Only redirect to login if user is not authenticated AND no user info exists
  if (!isAuthenticated() && !hasUserInfo()) {
    return <Navigate to="/login" replace />;
  }

  // If user info exists but not authenticated, wait a bit for auth context to update
  if (!isAuthenticated() && hasUserInfo() && !loading) {
    // Give auth context time to restore session
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Restoring session...</Text>
        </VStack>
      </Box>
    );
  }

  return children;
};

