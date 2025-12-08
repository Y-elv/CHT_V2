import React, { createContext, useContext, useState, useEffect } from "react";
import { useBadgeStore } from "../zustandStore/store";
import { extractUserFromToken } from "../utils/tokenUtils";

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
      console.log("🔄 AuthContext: Restoring session from localStorage...");
      try {
        // Try to extract user from token first (new method)
        const token = localStorage.getItem("token");
        console.log("🔑 Token found in localStorage:", !!token);
        
        if (token) {
          try {
            const userFromToken = extractUserFromToken();
            console.log("👤 User extracted from token:", userFromToken);
            
            if (userFromToken) {
              // Reconstruct user object with token
              const userInfo = {
                ...userFromToken,
                token: token,
                _id: userFromToken.id,
              };
              console.log("✅ Restored user from token:", userInfo);
              setUser(userInfo);
              setToken(token);
              setProfile(userInfo);
              setIsLoggedIn(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("❌ Error extracting user from token:", e);
          }
        }

        // Try new format (cht_user and cht_token)
        const chtUser = localStorage.getItem("cht_user");
        const chtToken = localStorage.getItem("cht_token") || localStorage.getItem("token");
        console.log("📦 Checking cht_user format:", !!chtUser, "cht_token:", !!chtToken);
        
        if (chtUser && chtToken) {
          try {
            const userInfo = JSON.parse(chtUser);
            userInfo.token = chtToken; // Ensure token is in user object
            console.log("✅ Restored user from cht_user:", userInfo);
            console.log("   - Name:", userInfo.name);
            console.log("   - Email:", userInfo.email);
            console.log("   - Role:", userInfo.role);
            console.log("   - Pic:", userInfo.pic);
            setUser(userInfo);
            setToken(chtToken);
            setProfile(userInfo);
            setIsLoggedIn(true);
            setLoading(false);
            return;
          } catch (e) {
            console.error("❌ Error parsing cht_user:", e);
          }
        }
        
        // Fallback to old format (userInfo)
        const userInfoStr = localStorage.getItem("userInfo");
        console.log("📦 Checking userInfo format:", !!userInfoStr);
        
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            if (userInfo && userInfo.token) {
              console.log("✅ Restored user from userInfo:", userInfo);
              console.log("   - Name:", userInfo.name);
              console.log("   - Email:", userInfo.email);
              console.log("   - Role:", userInfo.role);
              console.log("   - Pic:", userInfo.pic);
              setUser(userInfo);
              setToken(userInfo.token);
              setProfile(userInfo);
              setIsLoggedIn(true);
            }
          } catch (e) {
            console.error("❌ Error parsing userInfo:", e);
          }
        }
        
        console.log("⚠️ No user data found in localStorage");
      } catch (error) {
        console.error("❌ Error restoring session:", error);
        // Don't clean up data on error - might be temporary issue
      } finally {
        setLoading(false);
        console.log("✅ AuthContext: Session restoration complete");
      }
    };

    restoreSession();
  }, [setProfile, setIsLoggedIn]);

  const login = (userData) => {
    try {
      console.log("🟢 [AuthContext Login] login() called");
      console.log("🟢 [AuthContext Login] userData received:", userData);
      console.log("🟢 [AuthContext Login] userData.token exists:", !!userData.token);
      console.log("🟢 [AuthContext Login] userData.token:", userData.token ? `${userData.token.substring(0, 20)}...` : "null");
      console.log("🟢 [AuthContext Login] Full token:", userData.token);
      
      // Store login time for fresh login detection
      sessionStorage.setItem("lastLoginTime", Date.now().toString());
      console.log("🟢 [AuthContext Login] Stored login time:", new Date().toISOString());
      
      // Store token as "token" (primary key)
      if (userData.token) {
        console.log("🟢 [AuthContext Login] Storing token as 'token'");
        console.log("🟢 [AuthContext Login] Full token BEFORE storage:", userData.token);
        localStorage.setItem("token", userData.token);
        const storedToken = localStorage.getItem("token");
        console.log("🟢 [AuthContext Login] Token stored, verified:", storedToken?.substring(0, 20) + "...");
        console.log("🟢 [AuthContext Login] Full token AFTER storage:", storedToken);
        console.log("🟢 [AuthContext Login] Tokens match:", userData.token === storedToken);
      }
      
      // Store in both formats for compatibility
      // New format: cht_user and cht_token
      if (userData.token) {
        console.log("🟢 [AuthContext Login] Storing cht_user and cht_token");
        localStorage.setItem("cht_user", JSON.stringify(userData));
        localStorage.setItem("cht_token", userData.token);
        console.log("🟢 [AuthContext Login] cht_user stored:", !!localStorage.getItem("cht_user"));
        console.log("🟢 [AuthContext Login] cht_token stored:", !!localStorage.getItem("cht_token"));
      }
      
      // Old format: userInfo (for backward compatibility)
      console.log("🟢 [AuthContext Login] Storing userInfo");
      localStorage.setItem("userInfo", JSON.stringify(userData));
      console.log("🟢 [AuthContext Login] userInfo stored:", !!localStorage.getItem("userInfo"));
      
      // Update state
      console.log("🟢 [AuthContext Login] Updating React state...");
      setUser(userData);
      setToken(userData.token);
      console.log("🟢 [AuthContext Login] Calling setProfile...");
      setProfile(userData);
      console.log("🟢 [AuthContext Login] Calling setIsLoggedIn(true)...");
      setIsLoggedIn(true);
      console.log("🟢 [AuthContext Login] State updated successfully");

      return { success: true, userData };
    } catch (error) {
      console.error("❌ [AuthContext Login] Login error:", error);
      return { error: "Failed to save login information" };
    }
  };

  const logout = () => {
    // Remove all auth-related data
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cht_user");
    localStorage.removeItem("cht_token");
    localStorage.removeItem("token"); // Remove primary token key
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

