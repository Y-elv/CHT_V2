import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Homepage = () => {
  const { user } = useAuthStore();

  // Redirect authenticated users to their appropriate dashboard
  if (user) {
    const getRoleRedirectPath = () => {
      if (user.role === "admin") return "/admin/dashboard";
      if (user.role === "doctor" && user.doctorStatus === "approved") return "/doctor/dashboard";
      if (user.role === "patient") return "/profile";
      return "/profile";
    };
    
    return <Navigate to={getRoleRedirectPath()} replace />;
  }

  // Redirect unauthenticated users to the main landing page
  return <Navigate to="/landing" replace />;
};

export default Homepage;
