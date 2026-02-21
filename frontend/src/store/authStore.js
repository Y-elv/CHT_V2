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
        set({ loading: true });
        const response = await axios.post("/auth/login", credentials);
        const { user } = response.data;

        if (user) {
          set({
            user,
            isAuthenticated: true,
            loading: false
          });
          return { success: true, user };
        }

        set({
          user: null,
          isAuthenticated: false,
          loading: false
        });
        return { success: false, error: "Login failed" };
      } catch (error) {
        set({ loading: false });
        let errorMessage = "Login failed";
        if (error.response?.data) {
          if (error.response.data.message) errorMessage = error.response.data.message;
          else if (error.response.data.error) errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
      }
    },

    fetchProfile: async () => {
      const { user } = get();
      
      if (user) return { success: true, user };
      set({ loading: true });

      try {
        const fetchProfile = async () => {
          try {
            const response = await axios.get("/auth/profile");
            if (response.data) {
              const user = response.data;
              set({ user, isAuthenticated: true, loading: false });
              return { success: true, user };
            }
            set({ user: null, isAuthenticated: false, loading: false });
            return { success: false, error: "No user data received" };
          } catch (error) {
            if (error.response?.status === 401) {
              set({ user: null, isAuthenticated: false, loading: false });
              return { success: false, error: "Session expired. Please login again." };
            }
            set({ user: null, isAuthenticated: false, loading: false });
            return { success: false, error: error.message || "Failed to fetch profile" };
          }
        };
        return fetchProfile();
      } catch (error) {
        set({ loading: false });
        if (error.status === 401) {
          set({ user: null, isAuthenticated: false, loading: false });
        }
        return { success: false, error: error.message || "Failed to fetch profile" };
      }
    },

    logout: async () => {
      try {
        set({ loading: true });
        await axios.post("/auth/logout");
        set({ user: null, isAuthenticated: false, loading: false });
        return { success: true };
      } catch (error) {
        set({ loading: false });
        return { success: false, error: error.message || "Logout failed" };
      }
    },

    setUser: (user) => {
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
