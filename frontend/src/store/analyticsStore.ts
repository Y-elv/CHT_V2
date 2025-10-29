// store/analyticsStore.ts
import { create } from "zustand";
import { HealthGameStats, DashboardStats } from "../types/admin";

interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  healthGameStats: HealthGameStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setDashboardStats: (stats: DashboardStats) => void;
  setHealthGameStats: (stats: HealthGameStats) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  dashboardStats: null,
  healthGameStats: null,
  isLoading: false,
  error: null,

  setDashboardStats: (stats) => set({ dashboardStats: stats }),

  setHealthGameStats: (stats) => set({ healthGameStats: stats }),
}));
