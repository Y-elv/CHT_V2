// store/adminStore.ts
import { create } from "zustand";
import axios from "../config/axiosConfig";
import {
  Consultation,
  Doctor,
  Activity,
  DashboardStats,
  ConsultationFilters,
  HealthGameStats,
} from "../types/admin";

interface AdminState {
  // Stats
  totalUsers: number;
  activeConsultations: number;
  mentalHealthAlerts: number;
  gameEngagement: number;
  dashboardStats: DashboardStats | null;

  // Data
  consultations: Consultation[];
  doctors: Doctor[];
  recentActivity: Activity[];
  healthGameStats: HealthGameStats | null;

  // Filters
  consultationFilters: ConsultationFilters;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardStats: () => Promise<void>;
  fetchConsultations: (filters?: ConsultationFilters) => Promise<void>;
  updateConsultationStatus: (id: string, status: string) => Promise<void>;
  fetchDoctors: () => Promise<void>;
  fetchRecentActivity: () => Promise<void>;
  fetchHealthGameStats: () => Promise<void>;
  setConsultationFilters: (filters: ConsultationFilters) => void;

  // Real-time updates
  subscribeToUpdates: () => void;
  unsubscribeFromUpdates: () => void;
}

// Dummy data generators
const generateDummyConsultations = (): Consultation[] => {
  return [
    {
      id: "1",
      userId: "u1",
      userName: "Alice Johnson",
      userAge: 19,
      userAvatar: "https://i.pravatar.cc/150?img=1",
      doctorId: "d1",
      doctorName: "Dr. Sarah Williams",
      doctorSpecialty: "mental-health",
      type: "video",
      topic: "anxiety",
      status: "in-progress",
      priority: "urgent",
      scheduledAt: new Date().toISOString(),
      startedAt: new Date(Date.now() - 10 * 60000).toISOString(),
      duration: 10,
    },
    {
      id: "2",
      userId: "u2",
      userName: "Bob Smith",
      userAge: 20,
      userAvatar: "https://i.pravatar.cc/150?img=2",
      doctorId: "d2",
      doctorName: "Dr. Michael Chen",
      doctorSpecialty: "sexual-health",
      type: "chat",
      topic: "sexual-health",
      status: "scheduled",
      priority: "normal",
      scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    },
    {
      id: "3",
      userId: "u3",
      userName: "Charlie Brown",
      userAge: 18,
      userAvatar: "https://i.pravatar.cc/150?img=3",
      doctorId: "d3",
      doctorName: "Dr. Emma Davis",
      doctorSpecialty: "mental-health",
      type: "urgent",
      topic: "depression",
      status: "completed",
      priority: "high",
      scheduledAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      completedAt: new Date(Date.now() - 23.5 * 3600000).toISOString(),
      duration: 30,
    },
    {
      id: "4",
      userId: "u4",
      userName: "Diana Prince",
      userAge: 21,
      userAvatar: "https://i.pravatar.cc/150?img=4",
      doctorId: "d1",
      doctorName: "Dr. Sarah Williams",
      doctorSpecialty: "mental-health",
      type: "video",
      topic: "mental-health",
      status: "scheduled",
      priority: "normal",
      scheduledAt: new Date(Date.now() + 4 * 3600000).toISOString(),
    },
  ];
};

const generateDummyDoctors = (): Doctor[] => {
  return [
    {
      id: "d1",
      name: "Dr. Sarah Williams",
      email: "sarah.williams@healthplatform.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      specialty: "mental-health",
      credentials: ["MD", "Psychiatry"],
      isVerified: true,
      isOnline: true,
      availability: "available",
      rating: 4.8,
      reviewCount: 127,
      currentConsultations: 2,
      totalConsultations: 450,
      languages: ["English", "French"],
      bio: "Experienced psychiatrist specializing in youth mental health.",
    },
    {
      id: "d2",
      name: "Dr. Michael Chen",
      email: "michael.chen@healthplatform.com",
      avatar: "https://i.pravatar.cc/150?img=6",
      specialty: "sexual-health",
      credentials: ["MD", "Gynecology"],
      isVerified: true,
      isOnline: true,
      availability: "busy",
      rating: 4.9,
      reviewCount: 203,
      currentConsultations: 3,
      totalConsultations: 520,
      languages: ["English", "Chinese"],
      bio: "Passionate about adolescent reproductive health education.",
    },
    {
      id: "d3",
      name: "Dr. Emma Davis",
      email: "emma.davis@healthplatform.com",
      avatar: "https://i.pravatar.cc/150?img=7",
      specialty: "mental-health",
      credentials: ["PsyD", "Clinical Psychology"],
      isVerified: true,
      isOnline: false,
      availability: "offline",
      rating: 4.7,
      reviewCount: 89,
      currentConsultations: 0,
      totalConsultations: 312,
      languages: ["English", "Spanish"],
      bio: "Specialized in cognitive behavioral therapy for teens.",
    },
  ];
};

const generateDummyActivity = (): Activity[] => {
  return [
    {
      id: "a1",
      type: "consultation-booked",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      userId: "u1",
      userName: "Alice Johnson",
      userAvatar: "https://i.pravatar.cc/150?img=1",
      doctorId: "d1",
      doctorName: "Dr. Sarah Williams",
      description:
        "Alice Johnson booked a consultation with Dr. Sarah Williams",
      priority: "high",
    },
    {
      id: "a2",
      type: "message-sent",
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      userId: "u2",
      userName: "Bob Smith",
      userAvatar: "https://i.pravatar.cc/150?img=2",
      description: "Bob Smith sent an urgent message",
      priority: "urgent",
    },
    {
      id: "a3",
      type: "game-achievement",
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      userId: "u3",
      userName: "Charlie Brown",
      userAvatar: "https://i.pravatar.cc/150?img=3",
      description: "Charlie Brown completed mental health awareness quiz",
      priority: "low",
    },
  ];
};

export const useAdminStore = create<AdminState>((set, get) => ({
  totalUsers: 1247,
  activeConsultations: 24,
  mentalHealthAlerts: 8,
  gameEngagement: 892,
  dashboardStats: null,
  consultations: [],
  doctors: [],
  recentActivity: [],
  healthGameStats: null,
  consultationFilters: {},
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call with dummy data
      await new Promise((resolve) => setTimeout(resolve, 500));

      const stats: DashboardStats = {
        totalUsers: 1247,
        activeConsultations: 24,
        mentalHealthAlerts: 8,
        gameEngagement: 892,
        totalConsultationsToday: 45,
        completedThisWeek: 156,
        averageSessionTime: 18,
        activeGamePlayers: 892,
      };

      set({
        ...stats,
        dashboardStats: stats,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchConsultations: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const consultations = generateDummyConsultations();

      // Apply filters
      let filtered = consultations;
      if (filters?.status) {
        filtered = filtered.filter((c) => c.status === filters.status);
      }
      if (filters?.type) {
        filtered = filtered.filter((c) => c.type === filters.type);
      }
      if (filters?.priority) {
        filtered = filtered.filter((c) => c.priority === filters.priority);
      }

      set({ consultations: filtered, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateConsultationStatus: async (id, status) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const consultations = get().consultations.map((c) =>
        c.id === id ? { ...c, status: status as any } : c
      );
      set({ consultations });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const doctors = generateDummyDoctors();
      set({ doctors, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchRecentActivity: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const activity = generateDummyActivity();
      set({ recentActivity: activity, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchHealthGameStats: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const stats: HealthGameStats = {
        activePlayers: 892,
        totalPlayers: 1247,
        averageSessionTime: 18,
        popularTopics: [
          { topic: "Mental Health Awareness", plays: 342 },
          { topic: "Sexual Health Basics", plays: 289 },
          { topic: "Stress Management", plays: 156 },
          { topic: "Building Confidence", plays: 89 },
        ],
        rewardsDistributed: 1247,
        topPerformers: [
          { userId: "u1", userName: "Alice Johnson", score: 950 },
          { userId: "u2", userName: "Bob Smith", score: 920 },
          { userId: "u3", userName: "Charlie Brown", score: 890 },
        ],
      };

      set({ healthGameStats: stats, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setConsultationFilters: (filters) => {
    set({ consultationFilters: filters });
  },

  subscribeToUpdates: () => {
    // Socket.io subscription logic will be implemented here
    console.log("Subscribing to real-time updates");
  },

  unsubscribeFromUpdates: () => {
    // Socket.io cleanup
    console.log("Unsubscribing from real-time updates");
  },
}));
