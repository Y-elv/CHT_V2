import { create } from "zustand";
import axios from "../api/axios";

export const useAuthStore = create(
  (set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    loading: false,

    // Actions
    login: async (credentials) => {
      try {
        console.log(" [AUTH STORE] Login attempt:", { ...credentials, timestamp: new Date().toISOString() });
        set({ loading: true });
        
        const response = await axios.post("/api/auth/login", credentials);
        console.log(" [AUTH STORE] Login response:", response.status, response.data);
        
        const { user } = response.data;
        
        if (user) {
          console.log(" [AUTH STORE] Login successful:", user);
          console.log(" [AUTH STORE] User role:", user.role);
          console.log(" [AUTH STORE] User status:", user.doctorStatus || 'N/A');
          
          set({
            user,
            isAuthenticated: true,
            loading: false 
          });
          
          console.log("[AUTH STORE] Login successful");
          return { success: true, user };
          
        } else {
          console.log(" [AUTH STORE] Login failed - no user data in response");
          set({
            user: null,
            isAuthenticated: false,
            loading: false 
          });
          
          console.error("[AUTH STORE] Login failed:", error);
          
          // Return error for UI handling
          return { 
            success: false, 
            error: error.message || "Login failed" 
          };
        }
      } catch (error) {
        set({ loading: false });
        
        console.error("❌ [AUTH STORE] Login failed:", error);
        console.error("📊 [AUTH STORE] Error response:", error.response?.status, error.response?.data);
        
        // Extract meaningful error message from backend response
        let errorMessage = "Login failed";
        
        if (error.response?.data) {
          // Backend returned structured error response
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        } else if (error.message) {
          // Fallback to error message
          errorMessage = error.message;
        }
        
        console.log("🔍 [AUTH STORE] Final error message:", errorMessage);
        
        // Return error for UI handling
        return { 
          success: false, 
          error: errorMessage
        };
      }
    },

    fetchProfile: async () => {
      const { user } = get();
      
      // If we already have user data, don't fetch
      if (user) {
        console.log("[AUTH STORE] User already in state, skipping fetch");
        return { success: true, user };
      }
      
      set({ loading: true });
      
      try {
        // Fetch user profile from backend
        const fetchProfile = async () => {
          try {
            console.log("🍪 [AUTH STORE] Fetching user profile...");
            const response = await axios.get("/api/auth/profile");
            console.log("📊 [AUTH STORE] Profile response:", response.status, response.data);
            
            if (response.data) {
              const user = response.data;
              console.log("✅ [AUTH STORE] User profile fetched successfully:", user);
              console.log("👤 [AUTH STORE] User role:", user.role);
              console.log("🏥 [AUTH STORE] User status:", user.doctorStatus || 'N/A');
              
              set({
                user,
                isAuthenticated: true,
                loading: false,
              });
              
              return { success: true, user };
            } else {
              console.log("❌ [AUTH STORE] No user data in response");
              set({
                user: null,
                isAuthenticated: false,
                loading: false,
              });
              return { success: false, error: "No user data received" };
            }
          } catch (error) {
            console.error("❌ [AUTH STORE] Profile fetch failed:", error);
            
            if (error.response?.status === 401) {
              console.log("🚪 [AUTH STORE] Session expired - clearing auth state");
              set({
                user: null,
                isAuthenticated: false,
                loading: false,
              });
              return { success: false, error: "Session expired. Please login again." };
            }
            
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            });
            return { success: false, error: error.message || "Failed to fetch profile" };
          }
        };
        return fetchProfile();
      } catch (error) {
        set({ loading: false });
        
        console.error("[AUTH STORE] Profile fetch failed:", error);
        
        // If 401, clear auth state
        if (error.status === 401) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            loading: false 
          });
          
          console.log("[AUTH STORE] Cleared auth state due to 401");
        }
        
        return { 
          success: false, 
          error: error.message || "Failed to fetch profile" 
        };
      }
    },

    logout: async () => {
      try {
        console.log("🚪 [AUTH STORE] Logout attempt - current user:", get().user);
        set({ loading: true });
        
        console.log("[AUTH STORE] Sending logout request...");
        await axios.post("/api/auth/logout");
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false 
        });
        
        console.log("[AUTH STORE] Logout successful");
        return { success: true };
        
      } catch (error) {
        set({ loading: false });
        
        console.error("❌ [AUTH STORE] Logout failed:", error);
        
        return { 
          success: false, 
          error: error.message || "Logout failed" 
        };
      }
    },

    setUser: (user) => {
      console.log("[AUTH STORE] Setting user:", user);
      set({ 
        user, 
        isAuthenticated: !!user, 
        loading: false 
      });
    },

    // Getters
    getUser: () => get().user,
    getIsAuthenticated: () => get().isAuthenticated,
    getLoading: () => get().loading,
  })
);
