import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

// Admin Protected Route
export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = window.location;

  // ============================================
  // [AUTH][GUARD] AdminProtectedRoute Check
  // ============================================
  console.log("============================================");
  console.log("[AUTH][GUARD] AdminProtectedRoute: Auth check");
  console.log("[AUTH][GUARD] Timestamp:", new Date().toISOString());
  console.log("[AUTH][GUARD] Route:", location.pathname);
  console.log("[AUTH][GUARD] Full URL:", location.href);
  
  // Check storage state
  const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
  const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
  console.log("[AUTH][GUARD] Storage state:");
  console.log("[AUTH][GUARD] - Token exists:", !!token);
  console.log("[AUTH][GUARD] - Token preview:", token ? `${token.substring(0, 20)}...` : "null");
  console.log("[AUTH][GUARD] - UserInfo exists:", !!userInfo);
  
  console.log("[AUTH][GUARD] Auth state:");
  console.log("[AUTH][GUARD] - loading:", loading);
  console.log("[AUTH][GUARD] - user:", user);
  console.log("[AUTH][GUARD] - user.role:", user?.role);
  console.log("[AUTH][GUARD] - isAuthenticated():", isAuthenticated());
  console.log("[AUTH][GUARD] - isAdmin():", isAdmin());

  if (loading) {
    console.log("[AUTH][GUARD] AdminProtectedRoute: Still loading...");
    console.log("============================================");
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
    console.log("[AUTH][GUARD] AdminProtectedRoute: ❌ REDIRECTING TO LOGIN");
    console.log("[AUTH][GUARD] Reason: Not authenticated");
    console.log("[AUTH][GUARD] - user exists:", !!user);
    console.log("[AUTH][GUARD] - token exists:", !!token);
    console.log("============================================");
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    console.log("[AUTH][GUARD] AdminProtectedRoute: ❌ REDIRECTING TO HOME");
    console.log("[AUTH][GUARD] Reason: Not admin");
    console.log("[AUTH][GUARD] - user.role:", user?.role);
    console.log("============================================");
    return <Navigate to="/" replace />;
  }

  console.log("[AUTH][GUARD] AdminProtectedRoute: ✅ Access granted");
  console.log("============================================");
  return children;
};

// Doctor Protected Route (requires approved status)
export const DoctorProtectedRoute = ({ children }) => {
  const { isAuthenticated, isDoctor, loading, user } = useAuth();
  const location = window.location;

  // ============================================
  // [AUTH][GUARD] DoctorProtectedRoute Check
  // ============================================
  console.log("============================================");
  console.log("[AUTH][GUARD] DoctorProtectedRoute: Auth check");
  console.log("[AUTH][GUARD] Timestamp:", new Date().toISOString());
  console.log("[AUTH][GUARD] Route:", location.pathname);
  console.log("[AUTH][GUARD] Full URL:", location.href);
  
  // Check storage state
  const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
  const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
  console.log("[AUTH][GUARD] Storage state:");
  console.log("[AUTH][GUARD] - Token exists:", !!token);
  console.log("[AUTH][GUARD] - Token preview:", token ? `${token.substring(0, 20)}...` : "null");
  console.log("[AUTH][GUARD] - UserInfo exists:", !!userInfo);
  
  console.log("[AUTH][GUARD] Auth state:");
  console.log("[AUTH][GUARD] - loading:", loading);
  console.log("[AUTH][GUARD] - user:", user);
  console.log("[AUTH][GUARD] - user.role:", user?.role);
  console.log("[AUTH][GUARD] - user.doctorStatus:", user?.doctorStatus);
  console.log("[AUTH][GUARD] - isAuthenticated():", isAuthenticated());
  console.log("[AUTH][GUARD] - isDoctor():", isDoctor());

  if (loading) {
    console.log("[AUTH][GUARD] DoctorProtectedRoute: Still loading...");
    console.log("============================================");
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
    console.log("[AUTH][GUARD] DoctorProtectedRoute: ❌ REDIRECTING TO LOGIN");
    console.log("[AUTH][GUARD] Reason: Not authenticated");
    console.log("[AUTH][GUARD] - user exists:", !!user);
    console.log("[AUTH][GUARD] - token exists:", !!token);
    console.log("============================================");
    return <Navigate to="/login" replace />;
  }

  // Check if user is doctor
  if (user?.role !== "doctor") {
    console.log("[AUTH][GUARD] DoctorProtectedRoute: ❌ REDIRECTING TO HOME");
    console.log("[AUTH][GUARD] Reason: Not a doctor");
    console.log("[AUTH][GUARD] - user.role:", user?.role);
    console.log("============================================");
    return <Navigate to="/" replace />;
  }

  // Check if doctor is approved
  if (user?.doctorStatus !== "approved") {
    console.log("[AUTH][GUARD] DoctorProtectedRoute: ❌ REDIRECTING TO LOGIN");
    console.log("[AUTH][GUARD] Reason: Doctor not approved");
    console.log("[AUTH][GUARD] - user.doctorStatus:", user?.doctorStatus);
    console.log("============================================");
    return <Navigate to="/login" replace state={{ message: "Your doctor account is pending approval." }} />;
  }

  console.log("[AUTH][GUARD] DoctorProtectedRoute: ✅ Access granted");
  console.log("============================================");
  return children;
};

// Patient Protected Route
export const PatientProtectedRoute = ({ children }) => {
  const { isAuthenticated, isPatient, loading, user } = useAuth();
  const location = window.location;

  // ============================================
  // [AUTH][GUARD] PatientProtectedRoute Check
  // ============================================
  console.log("============================================");
  console.log("[AUTH][GUARD] PatientProtectedRoute: Auth check");
  console.log("[AUTH][GUARD] Timestamp:", new Date().toISOString());
  console.log("[AUTH][GUARD] Route:", location.pathname);
  console.log("[AUTH][GUARD] Full URL:", location.href);
  
  // Check storage state
  const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
  const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
  console.log("[AUTH][GUARD] Storage state:");
  console.log("[AUTH][GUARD] - Token exists:", !!token);
  console.log("[AUTH][GUARD] - Token preview:", token ? `${token.substring(0, 20)}...` : "null");
  console.log("[AUTH][GUARD] - UserInfo exists:", !!userInfo);
  
  console.log("[AUTH][GUARD] Auth state:");
  console.log("[AUTH][GUARD] - loading:", loading);
  console.log("[AUTH][GUARD] - user:", user);
  console.log("[AUTH][GUARD] - user.role:", user?.role);
  console.log("[AUTH][GUARD] - isAuthenticated():", isAuthenticated());
  console.log("[AUTH][GUARD] - isPatient():", isPatient());

  if (loading) {
    console.log("[AUTH][GUARD] PatientProtectedRoute: Still loading...");
    console.log("============================================");
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
    console.log("[AUTH][GUARD] PatientProtectedRoute: ❌ REDIRECTING TO LOGIN");
    console.log("[AUTH][GUARD] Reason: Not authenticated");
    console.log("[AUTH][GUARD] - user exists:", !!user);
    console.log("[AUTH][GUARD] - token exists:", !!token);
    console.log("============================================");
    return <Navigate to="/login" replace />;
  }

  if (!isPatient()) {
    console.log("[AUTH][GUARD] PatientProtectedRoute: ❌ REDIRECTING TO HOME");
    console.log("[AUTH][GUARD] Reason: Not a patient");
    console.log("[AUTH][GUARD] - user.role:", user?.role);
    console.log("============================================");
    return <Navigate to="/" replace />;
  }

  console.log("[AUTH][GUARD] PatientProtectedRoute: ✅ Access granted");
  console.log("============================================");
  return children;
};

// General Protected Route (any authenticated user)
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = window.location;

  // ============================================
  // [AUTH][GUARD] ProtectedRoute Check
  // ============================================
  console.log("============================================");
  console.log("[AUTH][GUARD] ProtectedRoute: Auth check");
  console.log("[AUTH][GUARD] Timestamp:", new Date().toISOString());
  console.log("[AUTH][GUARD] Route:", location.pathname);
  console.log("[AUTH][GUARD] Full URL:", location.href);

  if (loading) {
    console.log("[AUTH][GUARD] ProtectedRoute: Still loading...");
    console.log("============================================");
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
      console.log("[AUTH][GUARD] ProtectedRoute: Checking for user info in localStorage...");
      // ============================================
      // [AUTH][STORAGE READ] Reading from localStorage
      // ============================================
      console.log("[AUTH][STORAGE READ] Reading 'token' from localStorage...");
      const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
      console.log("[AUTH][STORAGE READ] Token found:", !!token);
      console.log("[AUTH][STORAGE READ] Token preview:", token ? `${token.substring(0, 20)}...` : "null");
      console.log("[AUTH][STORAGE READ] Token length:", token?.length || 0);
      
      console.log("[AUTH][STORAGE READ] Reading 'userInfo' or 'cht_user' from localStorage...");
      const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
      console.log("[AUTH][STORAGE READ] UserInfo found:", !!userInfo);
      console.log("[AUTH][STORAGE READ] UserInfo length:", userInfo?.length || 0);
      
      const hasInfo = !!(token || userInfo);
      console.log("[AUTH][GUARD] hasUserInfo() result:", hasInfo);
      return hasInfo;
    } catch (error) {
      console.error("[AUTH][GUARD] ❌ Error checking user info:", error);
      console.error("[AUTH][GUARD] Error stack:", error.stack);
      return false;
    }
  };

  // Check storage state
  const token = localStorage.getItem("token") || localStorage.getItem("cht_token");
  const userInfo = localStorage.getItem("userInfo") || localStorage.getItem("cht_user");
  console.log("[AUTH][GUARD] Storage state:");
  console.log("[AUTH][GUARD] - Token exists:", !!token);
  console.log("[AUTH][GUARD] - Token preview:", token ? `${token.substring(0, 20)}...` : "null");
  console.log("[AUTH][GUARD] - UserInfo exists:", !!userInfo);
  
  console.log("[AUTH][GUARD] Auth state:");
  console.log("[AUTH][GUARD] - loading:", loading);
  console.log("[AUTH][GUARD] - user:", user);
  console.log("[AUTH][GUARD] - user.role:", user?.role);
  console.log("[AUTH][GUARD] - isAuthenticated():", isAuthenticated());
  console.log("[AUTH][GUARD] - hasUserInfo():", hasUserInfo());

  // Only redirect to login if user is not authenticated AND no user info exists
  if (!isAuthenticated() && !hasUserInfo()) {
    console.log("[AUTH][GUARD] ProtectedRoute: ❌ REDIRECTING TO LOGIN");
    console.log("[AUTH][GUARD] Reason: No authentication and no user info");
    console.log("[AUTH][GUARD] - isAuthenticated():", isAuthenticated());
    console.log("[AUTH][GUARD] - hasUserInfo():", hasUserInfo());
    console.log("[AUTH][GUARD] - user exists:", !!user);
    console.log("[AUTH][GUARD] - token exists:", !!token);
    console.log("============================================");
    return <Navigate to="/login" replace />;
  }

  // If user info exists but not authenticated, wait a bit for auth context to update
  if (!isAuthenticated() && hasUserInfo() && !loading) {
    console.log("[AUTH][GUARD] ProtectedRoute: ⏳ Waiting for session restoration");
    console.log("[AUTH][GUARD] Reason: User info exists but not authenticated yet");
    console.log("[AUTH][GUARD] - hasUserInfo():", hasUserInfo());
    console.log("[AUTH][GUARD] - isAuthenticated():", isAuthenticated());
    console.log("[AUTH][GUARD] - loading:", loading);
    console.log("============================================");
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

  console.log("[AUTH][GUARD] ProtectedRoute: ✅ Access granted");
  console.log("============================================");
  return children;
};

