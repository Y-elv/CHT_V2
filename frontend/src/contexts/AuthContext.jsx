import React, { createContext, useContext, useState, useEffect } from "react";
import { useBadgeStore } from "../zustandStore/store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const setProfile = useBadgeStore((state) => state.setProfile);
  const setIsLoggedIn = useBadgeStore((state) => state.setIsLoggedIn);
  const clearProfile = useBadgeStore((state) => state.clearProfile);

  // Auto-restore session on mount
  useEffect(() => {
    const restoreSession = () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.token) {
          setUser(userInfo);
          setToken(userInfo.token);
          setProfile(userInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [setProfile, setIsLoggedIn]);

  const login = (userData) => {
    try {
      // Store in localStorage
      localStorage.setItem("userInfo", JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setToken(userData.token);
      setProfile(userData);
      setIsLoggedIn(true);

      return { success: true, userData };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "Failed to save login information" };
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setToken(null);
    clearProfile();
    setIsLoggedIn(false);
    // Navigation will be handled by the component calling logout
  };

  // Role checking utilities
  const isAdmin = () => user?.role === "admin";
  const isDoctor = () => user?.role === "doctor" && user?.doctorStatus === "approved";
  const isPatient = () => user?.role === "patient";
  const isAuthenticated = () => !!user && !!token;

  // Get redirect path based on role (for reference, actual redirect handled in login component)
  const getRoleRedirectPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "doctor" && user.doctorStatus === "approved") return "/doctor/dashboard";
    if (user.role === "patient") return "/profile";
    return "/profile";
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isDoctor,
    isPatient,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;

