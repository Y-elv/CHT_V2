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
      // ============================================
      // [AUTH][STORE] Session Restoration Start
      // ============================================
      console.log("============================================");
      console.log("[AUTH][STORE] AuthContext: Restoring session from localStorage...");
      console.log("[AUTH][STORE] Timestamp:", new Date().toISOString());
      console.log("[AUTH][STORE] Component: AuthProvider");
      try {
        // ============================================
        // [AUTH][STORAGE READ] Reading Token
        // ============================================
        console.log("[AUTH][STORAGE READ] Reading 'token' from localStorage...");
        const token = localStorage.getItem("token");
        console.log("[AUTH][STORAGE READ] Token found:", !!token);
        console.log("[AUTH][STORAGE READ] Token length:", token?.length || 0);
        console.log("[AUTH][STORAGE READ] Token preview:", token ? `${token.substring(0, 20)}...` : "null");
        
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

        // ============================================
        // [AUTH][STORAGE READ] Reading cht_user and cht_token
        // ============================================
        console.log("[AUTH][STORAGE READ] Reading 'cht_user' from localStorage...");
        const chtUser = localStorage.getItem("cht_user");
        console.log("[AUTH][STORAGE READ] Reading 'cht_token' from localStorage...");
        const chtToken = localStorage.getItem("cht_token") || localStorage.getItem("token");
        console.log("[AUTH][STORAGE READ] cht_user exists:", !!chtUser);
        console.log("[AUTH][STORAGE READ] cht_token exists:", !!chtToken);
        console.log("[AUTH][STORAGE READ] cht_token length:", chtToken?.length || 0);
        
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
        
        // ============================================
        // [AUTH][STORAGE READ] Reading userInfo (fallback)
        // ============================================
        console.log("[AUTH][STORAGE READ] Reading 'userInfo' from localStorage (fallback)...");
        const userInfoStr = localStorage.getItem("userInfo");
        console.log("[AUTH][STORAGE READ] userInfo exists:", !!userInfoStr);
        console.log("[AUTH][STORAGE READ] userInfo length:", userInfoStr?.length || 0);
        
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
        
        console.log("[AUTH][STORE] ⚠️ No user data found in localStorage");
      } catch (error) {
        console.error("[AUTH][STORE] ❌ Error restoring session:", error);
        console.error("[AUTH][STORE] Error stack:", error.stack);
        // Don't clean up data on error - might be temporary issue
      } finally {
        setLoading(false);
        console.log("[AUTH][STORE] Session restoration complete");
        console.log("[AUTH][STORE] Loading state set to false");
        console.log("============================================");
      }
    };

    restoreSession();
  }, [setProfile, setIsLoggedIn]);
  
  // ============================================
  // [AUTH][RENDER] AuthContext Lifecycle
  // ============================================
  useEffect(() => {
    console.log("[AUTH][RENDER] AuthProvider component mounted");
    return () => {
      console.log("[AUTH][RENDER] AuthProvider component unmounted");
    };
  }, []);

  const login = (userData) => {
    // ============================================
    // [AUTH][STORE] Login Function Called
    // ============================================
    console.log("============================================");
    console.log("[AUTH][STORE] login() function called");
    console.log("[AUTH][STORE] Timestamp:", new Date().toISOString());
    console.log("[AUTH][STORE] userData received:", userData);
    console.log("[AUTH][STORE] userData.email:", userData?.email);
    console.log("[AUTH][STORE] userData.role:", userData?.role);
    console.log("[AUTH][STORE] userData.token exists:", !!userData.token);
    console.log("[AUTH][STORE] userData.token preview:", userData.token ? `${userData.token.substring(0, 20)}...` : "null");
    console.log("[AUTH][STORE] userData.token length:", userData.token?.length || 0);
    console.log("[AUTH][STORE] Full token:", userData.token);
    
    try {
      // ============================================
      // [AUTH][STORAGE WRITE] Storing Login Time
      // ============================================
      const loginTime = Date.now().toString();
      console.log("[AUTH][STORAGE WRITE] Storing login time to sessionStorage...");
      console.log("[AUTH][STORAGE WRITE] Login time:", loginTime);
      console.log("[AUTH][STORAGE WRITE] Login time (ISO):", new Date(parseInt(loginTime)).toISOString());
      sessionStorage.setItem("lastLoginTime", loginTime);
      const storedLoginTime = sessionStorage.getItem("lastLoginTime");
      console.log("[AUTH][STORAGE WRITE] Login time stored:", storedLoginTime);
      
      // ============================================
      // [AUTH][STORAGE WRITE] Storing Token (Primary)
      // ============================================
      if (userData.token) {
        // Trim token to ensure no whitespace issues
        const cleanToken = userData.token.trim();
        console.log("[AUTH][STORAGE WRITE] ===== STORING TOKEN =====");
        console.log("[AUTH][STORAGE WRITE] Key: 'token'");
        console.log("[AUTH][STORAGE WRITE] Token BEFORE storage:", cleanToken);
        console.log("[AUTH][STORAGE WRITE] Token length:", cleanToken.length);
        console.log("[AUTH][STORAGE WRITE] Token starts with 'eyJ':", cleanToken.startsWith('eyJ'));
        localStorage.setItem("token", cleanToken);
        const storedToken = localStorage.getItem("token");
        console.log("[AUTH][STORAGE WRITE] Token AFTER storage:", storedToken);
        console.log("[AUTH][STORAGE WRITE] Token length after storage:", storedToken?.length);
        console.log("[AUTH][STORAGE WRITE] Tokens match:", cleanToken === storedToken);
        console.log("[AUTH][STORAGE WRITE] Token stored successfully:", !!storedToken);
        console.log("[AUTH][STORAGE WRITE] Stored token starts with 'eyJ':", storedToken?.startsWith('eyJ'));
      }
      
      // ============================================
      // [AUTH][STORAGE WRITE] Storing cht_user and cht_token
      // ============================================
      if (userData.token) {
        console.log("[AUTH][STORAGE WRITE] Storing 'cht_user'...");
        const chtUserStr = JSON.stringify(userData);
        console.log("[AUTH][STORAGE WRITE] cht_user JSON length:", chtUserStr.length);
        localStorage.setItem("cht_user", chtUserStr);
        const verifyChtUser = localStorage.getItem("cht_user");
        console.log("[AUTH][STORAGE WRITE] cht_user stored:", !!verifyChtUser);
        
        console.log("[AUTH][STORAGE WRITE] Storing 'cht_token'...");
        localStorage.setItem("cht_token", userData.token);
        const verifyChtToken = localStorage.getItem("cht_token");
        console.log("[AUTH][STORAGE WRITE] cht_token stored:", !!verifyChtToken);
        console.log("[AUTH][STORAGE WRITE] cht_token matches:", userData.token === verifyChtToken);
      }
      
      // ============================================
      // [AUTH][STORAGE WRITE] Storing userInfo (backward compatibility)
      // ============================================
      console.log("[AUTH][STORAGE WRITE] Storing 'userInfo' (backward compatibility)...");
      const userInfoStr = JSON.stringify(userData);
      console.log("[AUTH][STORAGE WRITE] userInfo JSON length:", userInfoStr.length);
      localStorage.setItem("userInfo", userInfoStr);
      const verifyUserInfo = localStorage.getItem("userInfo");
      console.log("[AUTH][STORAGE WRITE] userInfo stored:", !!verifyUserInfo);
      
      // ============================================
      // [AUTH][STORE] Updating React State
      // ============================================
      console.log("[AUTH][STORE] Updating React state...");
      console.log("[AUTH][STORE] Step 1: Calling setUser()...");
      setUser(userData);
      console.log("[AUTH][STORE] Step 2: Calling setToken()...");
      setToken(userData.token);
      console.log("[AUTH][STORE] Step 3: Calling setProfile()...");
      setProfile(userData);
      console.log("[AUTH][STORE] Step 4: Calling setIsLoggedIn(true)...");
      setIsLoggedIn(true);
      
      // ============================================
      // [AUTH][STORE] Login Complete Verification
      // ============================================
      console.log("[AUTH][STORE] ===== LOGIN COMPLETE - VERIFICATION =====");
      console.log("[AUTH][STORE] Verifying all storage after login:");
      const finalToken = localStorage.getItem("token");
      const finalChtToken = localStorage.getItem("cht_token");
      const finalUserInfo = localStorage.getItem("userInfo");
      const finalChtUser = localStorage.getItem("cht_user");
      console.log("[AUTH][STORE] - 'token' exists:", !!finalToken);
      console.log("[AUTH][STORE] - 'cht_token' exists:", !!finalChtToken);
      console.log("[AUTH][STORE] - 'userInfo' exists:", !!finalUserInfo);
      console.log("[AUTH][STORE] - 'cht_user' exists:", !!finalChtUser);
      console.log("[AUTH][STORE] State updated successfully");
      console.log("============================================");

      return { success: true, userData };
    } catch (error) {
      console.error("[AUTH][STORE] ❌ Login error:", error);
      console.error("[AUTH][STORE] Error stack:", error.stack);
      return { error: "Failed to save login information" };
    }
  };

  const logout = () => {
    // ============================================
    // [AUTH][STORE] Logout Function Called
    // ============================================
    console.log("============================================");
    console.log("[AUTH][STORE] logout() function called");
    console.log("[AUTH][STORE] Timestamp:", new Date().toISOString());
    console.log("[AUTH][STORE] Checking storage BEFORE logout:");
    const tokenBeforeLogout = localStorage.getItem("token");
    const userInfoBeforeLogout = localStorage.getItem("userInfo");
    console.log("[AUTH][STORE] - 'token' exists:", !!tokenBeforeLogout);
    console.log("[AUTH][STORE] - 'userInfo' exists:", !!userInfoBeforeLogout);
    
    // Remove all auth-related data
    console.log("[AUTH][STORAGE WRITE] Removing auth data from localStorage...");
    console.log("[AUTH][STORAGE WRITE] Removing 'userInfo'...");
    localStorage.removeItem("userInfo");
    console.log("[AUTH][STORAGE WRITE] Removing 'cht_user'...");
    localStorage.removeItem("cht_user");
    console.log("[AUTH][STORAGE WRITE] Removing 'cht_token'...");
    localStorage.removeItem("cht_token");
    console.log("[AUTH][STORAGE WRITE] Removing 'token'...");
    localStorage.removeItem("token"); // Remove primary token key
    
    console.log("[AUTH][STORAGE WRITE] Removing 'lastLoginTime' from sessionStorage...");
    sessionStorage.removeItem("lastLoginTime");
    
    console.log("[AUTH][STORE] Updating React state...");
    setUser(null);
    setToken(null);
    clearProfile();
    setIsLoggedIn(false);
    
    console.log("[AUTH][STORE] Verifying storage AFTER logout:");
    const tokenAfterLogout = localStorage.getItem("token");
    const userInfoAfterLogout = localStorage.getItem("userInfo");
    console.log("[AUTH][STORE] - 'token' exists:", !!tokenAfterLogout);
    console.log("[AUTH][STORE] - 'userInfo' exists:", !!userInfoAfterLogout);
    console.log("[AUTH][STORE] Logout complete");
    console.log("============================================");
    // Navigation will be handled by the component calling logout
  };

  // Role checking utilities
  const isAdmin = () => {
    const result = user?.role === "admin";
    console.log("[AUTH][STORE] isAdmin() called - result:", result, "user.role:", user?.role);
    return result;
  };
  const isDoctor = () => {
    const result = user?.role === "doctor" && user?.doctorStatus === "approved";
    console.log("[AUTH][STORE] isDoctor() called - result:", result, "user.role:", user?.role, "doctorStatus:", user?.doctorStatus);
    return result;
  };
  const isPatient = () => {
    const result = user?.role === "patient";
    console.log("[AUTH][STORE] isPatient() called - result:", result, "user.role:", user?.role);
    return result;
  };
  const isAuthenticated = () => {
    const result = !!user && !!token;
    console.log("[AUTH][STORE] isAuthenticated() called - result:", result, "user exists:", !!user, "token exists:", !!token);
    return result;
  };

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

