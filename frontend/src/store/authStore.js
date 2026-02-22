import { create } from "zustand";
import axios from "../api/axios";

const TOKEN_KEY = "fh_auth_token";

// Safe localStorage helpers — won't crash in Safari private mode
const saveToken = (token) => {
  try { localStorage.setItem(TOKEN_KEY, token); } catch (_) {}
};
const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch (_) { return null; }
};
const removeToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch (_) {}
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: async (credentials) => {
    try {
      set({ loading: true });
      const response = await axios.post("/auth/login", credentials);
      const { user, token } = response.data;

      if (user) {
        if (token) saveToken(token);
        set({ user, isAuthenticated: true, loading: false });
        return { success: true, user };
      }

      set({ user: null, isAuthenticated: false, loading: false });
      return { success: false, error: "Login failed" };
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      return { success: false, error: errorMessage };
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (user) return { success: true, user };

    // No token = no point calling API
    const token = getToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return { success: false, error: "No session found" };
    }

    set({ loading: true });
    try {
      const response = await axios.get("/auth/profile");
      if (response.data) {
        set({ user: response.data, isAuthenticated: true, loading: false });
        return { success: true, user: response.data };
      }
      set({ user: null, isAuthenticated: false, loading: false });
      return { success: false, error: "No user data received" };
    } catch (error) {
      removeToken(); // Clear bad or expired token
      set({ user: null, isAuthenticated: false, loading: false });
      return { success: false, error: error.message || "Failed to fetch profile" };
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
    } catch (_) {}
    removeToken();
    set({ user: null, isAuthenticated: false, loading: false });
    return { success: true };
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
  getUser: () => get().user,
  getIsAuthenticated: () => get().isAuthenticated,
  getLoading: () => get().loading,
}));
