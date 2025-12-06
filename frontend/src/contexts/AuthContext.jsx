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
        // Try new format first (cht_user and cht_token)
        const chtUser = localStorage.getItem("cht_user");
        const chtToken = localStorage.getItem("cht_token");
        
        if (chtUser && chtToken) {
          try {
            const userInfo = JSON.parse(chtUser);
            userInfo.token = chtToken; // Ensure token is in user object
            setUser(userInfo);
            setToken(chtToken);
            setProfile(userInfo);
            setIsLoggedIn(true);
            setLoading(false);
            return;
          } catch (e) {
            console.error("Error parsing cht_user:", e);
          }
        }
        
        // Fallback to old format (userInfo)
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.token) {
          setUser(userInfo);
          setToken(userInfo.token);
          setProfile(userInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        // Clean up corrupted data
        localStorage.removeItem("userInfo");
        localStorage.removeItem("cht_user");
        localStorage.removeItem("cht_token");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [setProfile, setIsLoggedIn]);

  const login = (userData) => {
    try {
      // Store in both formats for compatibility
      // New format: cht_user and cht_token
      if (userData.token) {
        localStorage.setItem("cht_user", JSON.stringify(userData));
        localStorage.setItem("cht_token", userData.token);
      }
      
      // Old format: userInfo (for backward compatibility)
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
    // Remove all auth-related data
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cht_user");
    localStorage.removeItem("cht_token");
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

