import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

// Admin Protected Route
export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  console.log("⚠️ [Auth Guard] AdminProtectedRoute: Auth check");
  console.log("⚠️ [Auth Guard] isAuthenticated():", isAuthenticated());
  console.log("⚠️ [Auth Guard] isAdmin():", isAdmin());
  console.log("⚠️ [Auth Guard] loading:", loading);
  console.log("⚠️ [Auth Guard] user:", user);

  // Check if user info exists in localStorage (for session restoration)
  const hasUserInfo = () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
      const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
      return !!(token || userInfo);
    } catch (error) {
      console.error("❌ [Auth Guard] Error checking user info:", error);
      return false;
    }
  };

  // Get user role from localStorage if not in state yet
  const getUserRoleFromStorage = () => {
    try {
      const chtUser = localStorage.getItem("cht_user");
      const userInfo = localStorage.getItem("userInfo");
      const userData = chtUser ? JSON.parse(chtUser) : userInfo ? JSON.parse(userInfo) : null;
      return userData?.role;
    } catch (error) {
      return null;
    }
  };

  if (loading) {
    console.log("⚠️ [Auth Guard] AdminProtectedRoute: Still loading...");
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  // If not authenticated but user info exists in localStorage, wait for session restoration
  if (!isAuthenticated() && hasUserInfo()) {
    console.log("⚠️ [Auth Guard] AdminProtectedRoute: User info exists, waiting for session restoration...");
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Restoring session...</Text>
        </VStack>
      </Box>
    );
  }

  // Check role from localStorage if not in state
  const userRole = user?.role || getUserRoleFromStorage();
  console.log("⚠️ [Auth Guard] User role from state/storage:", userRole);

  if (!isAuthenticated() && !hasUserInfo()) {
    console.log("⚠️ [Auth Guard] AdminProtectedRoute: REDIRECTING TO LOGIN - Not authenticated");
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "admin") {
    console.log("⚠️ [Auth Guard] AdminProtectedRoute: REDIRECTING TO HOME - Not admin");
    return <Navigate to="/" replace />;
  }

  console.log("✅ [Auth Guard] AdminProtectedRoute: Access granted");
  return children;
};

// Doctor Protected Route (requires approved status)
export const DoctorProtectedRoute = ({ children }) => {
  const { isAuthenticated, isDoctor, loading, user } = useAuth();

  console.log("⚠️ [Auth Guard] DoctorProtectedRoute: Auth check");
  console.log("⚠️ [Auth Guard] isAuthenticated():", isAuthenticated());
  console.log("⚠️ [Auth Guard] isDoctor():", isDoctor());
  console.log("⚠️ [Auth Guard] user:", user);
  console.log("⚠️ [Auth Guard] user.role:", user?.role);
  console.log("⚠️ [Auth Guard] user.doctorStatus:", user?.doctorStatus);
  console.log("⚠️ [Auth Guard] loading:", loading);

  // Check if user info exists in localStorage (for session restoration)
  const hasUserInfo = () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
      const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
      return !!(token || userInfo);
    } catch (error) {
      console.error("❌ [Auth Guard] Error checking user info:", error);
      return false;
    }
  };

  // Get user data from localStorage if not in state yet
  const getUserDataFromStorage = () => {
    try {
      const chtUser = localStorage.getItem("cht_user");
      const userInfo = localStorage.getItem("userInfo");
      const userData = chtUser ? JSON.parse(chtUser) : userInfo ? JSON.parse(userInfo) : null;
      return userData;
    } catch (error) {
      return null;
    }
  };

  if (loading) {
    console.log("⚠️ [Auth Guard] DoctorProtectedRoute: Still loading...");
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  // If not authenticated but user info exists in localStorage, wait for session restoration
  if (!isAuthenticated() && hasUserInfo()) {
    console.log("⚠️ [Auth Guard] DoctorProtectedRoute: User info exists, waiting for session restoration...");
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Restoring session...</Text>
        </VStack>
      </Box>
    );
  }

  // Get user data from state or localStorage
  const userData = user || getUserDataFromStorage();
  const userRole = userData?.role;
  const doctorStatus = userData?.doctorStatus;

  console.log("⚠️ [Auth Guard] User role from state/storage:", userRole);
  console.log("⚠️ [Auth Guard] Doctor status from state/storage:", doctorStatus);

  if (!isAuthenticated() && !hasUserInfo()) {
    console.log("⚠️ [Auth Guard] DoctorProtectedRoute: REDIRECTING TO LOGIN - Not authenticated");
    return <Navigate to="/login" replace />;
  }

  // Check if user is doctor
  if (userRole !== "doctor") {
    console.log("⚠️ [Auth Guard] DoctorProtectedRoute: REDIRECTING TO HOME - Not a doctor");
    return <Navigate to="/" replace />;
  }

  // Check if doctor is approved
  if (doctorStatus !== "approved") {
    console.log("⚠️ [Auth Guard] DoctorProtectedRoute: REDIRECTING TO LOGIN - Doctor not approved");
    return <Navigate to="/login" replace state={{ message: "Your doctor account is pending approval." }} />;
  }

  console.log("✅ [Auth Guard] DoctorProtectedRoute: Access granted");
  return children;
};

// Patient Protected Route
export const PatientProtectedRoute = ({ children }) => {
  const { isAuthenticated, isPatient, loading } = useAuth();

  console.log("⚠️ [Auth Guard] PatientProtectedRoute: Auth check");
  console.log("⚠️ [Auth Guard] isAuthenticated():", isAuthenticated());
  console.log("⚠️ [Auth Guard] isPatient():", isPatient());
  console.log("⚠️ [Auth Guard] loading:", loading);

  if (loading) {
    console.log("⚠️ [Auth Guard] PatientProtectedRoute: Still loading...");
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
    console.log("⚠️ [Auth Guard] PatientProtectedRoute: REDIRECTING TO LOGIN - Not authenticated");
    return <Navigate to="/login" replace />;
  }

  if (!isPatient()) {
    console.log("⚠️ [Auth Guard] PatientProtectedRoute: REDIRECTING TO HOME - Not a patient");
    return <Navigate to="/" replace />;
  }

  console.log("✅ [Auth Guard] PatientProtectedRoute: Access granted");
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
      console.log("⚠️ [Auth Guard] ProtectedRoute: Checking for user info...");
      const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
      const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
      console.log("⚠️ [Auth Guard] Token found:", !!token, token ? `${token.substring(0, 20)}...` : "null");
      console.log("⚠️ [Auth Guard] UserInfo found:", !!userInfo);
      const hasInfo = !!(token || userInfo);
      console.log("⚠️ [Auth Guard] hasUserInfo result:", hasInfo);
      return hasInfo;
    } catch (error) {
      console.error("❌ [Auth Guard] Error checking user info:", error);
      return false;
    }
  };

  console.log("⚠️ [Auth Guard] ProtectedRoute: Auth check");
  console.log("⚠️ [Auth Guard] isAuthenticated():", isAuthenticated());
  console.log("⚠️ [Auth Guard] user:", user);
  console.log("⚠️ [Auth Guard] loading:", loading);
  console.log("⚠️ [Auth Guard] hasUserInfo():", hasUserInfo());

  // Only redirect to login if user is not authenticated AND no user info exists
  if (!isAuthenticated() && !hasUserInfo()) {
    console.log("⚠️ [Auth Guard] REDIRECTING TO LOGIN - No authentication and no user info");
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

