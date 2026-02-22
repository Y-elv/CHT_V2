import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

const LoadingSpinner = () => (
  <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
    <VStack spacing={4} align="center">
      <Spinner size="xl" color="blue.500" thickness="4px" />
      <Text color="gray.600" mt={4}>Checking authentication...</Text>
    </VStack>
  </Box>
);

export const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!user) await fetchProfile();
      setInitialized(true);
    };
    check();
  }, []);

  if (!initialized || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!user) await fetchProfile();
      setInitialized(true);
    };
    check();
  }, []);

  if (!initialized || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export const DoctorProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!user) await fetchProfile();
      setInitialized(true);
    };
    check();
  }, []);

  if (!initialized || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== "doctor") return <Navigate to="/" replace />;
  if (user?.doctorStatus !== "approved") return <Navigate to="/login" replace />;
  return children;
};

export const PatientProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading, fetchProfile } = useAuthStore();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!user) await fetchProfile();
      setInitialized(true);
    };
    check();
  }, []);

  if (!initialized || loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== "patient") return <Navigate to="/" replace />;
  return children;
};
