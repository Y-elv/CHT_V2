// store/adminStore.ts
import { create } from "zustand";
import axios from "../api/axios";
import {
  Consultation,
  Doctor,
  Activity,
  DashboardStats,
  ConsultationFilters,
  HealthGameStats,
} from "../types/admin";

// API response types
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  pic?: string;
  role: string;
  isAdmin?: boolean;
  doctorStatus?: string | null;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiConsultation {
  _id: string;
  patient: { _id: string; name: string; email: string; pic?: string } | null;
  doctor: {
    _id: string;
    name: string;
    email: string;
    pic?: string;
    specialty?: string;
  } | null;
  date: string;
  time: string;
  appointmentType: string;
  status: string;
  callLink?: string | null;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiDoctor {
  _id: string;
  name: string;
  email: string;
  pic?: string;
  role: string;
  doctorStatus?: string;
  specialty?: string;
  bio?: string;
  yearsOfExperience?: number;
  hospital?: string;
  consultationFee?: number;
  status?: string;
}

export interface ApiFaq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive?: boolean;
  createdBy?: { _id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminState {
  totalUsers: number;
  activeConsultations: number;
  mentalHealthAlerts: number;
  faqCount: number;
  dashboardStats: DashboardStats | null;

  consultations: Consultation[];
  apiConsultations: ApiConsultation[];
  consultationsTotal: number;
  consultationsPage: number;
  totalPagesConsultations: number;

  doctors: Doctor[];
  apiDoctors: ApiDoctor[];
  doctorsTotal: number;

  users: ApiUser[];
  usersTotal: number;
  usersPage: number;
  usersTotalPages: number;

  faqs: ApiFaq[];
  faqsTotal: number;
  faqsPage: number;
  faqsTotalPages: number;

  recentActivity: Activity[];
  healthGameStats: HealthGameStats | null;
  consultationFilters: ConsultationFilters;

  isLoading: boolean;
  error: string | null;

  fetchDashboardStats: () => Promise<void>;
  fetchConsultations: (page?: number, limit?: number) => Promise<void>;
  updateConsultationStatus: (id: string, status: string) => Promise<void>;
  fetchDoctors: (page?: number, limit?: number) => Promise<void>;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  fetchFaqs: (page?: number, limit?: number) => Promise<void>;
  createFaq: (payload: { question: string; answer: string; category: string }) => Promise<ApiFaq | null>;
  updateFaq: (id: string, payload: { question?: string; answer?: string; category?: string }) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  fetchRecentActivity: () => Promise<void>;
  fetchHealthGameStats: () => Promise<void>;
  setConsultationFilters: (filters: ConsultationFilters) => void;
  subscribeToUpdates: () => void;
  unsubscribeFromUpdates: () => void;
}

const mapApiConsultationToConsultation = (c: ApiConsultation): Consultation => ({
  id: c._id,
  userId: c.patient?._id ?? "",
  userName: c.patient?.name ?? "—",
  userAge: 0,
  userAvatar: c.patient?.pic,
  doctorId: c.doctor?._id ?? "",
  doctorName: c.doctor?.name ?? "—",
  doctorSpecialty: (c.doctor?.specialty as any) ?? "general",
  type: (c.appointmentType === "video" ? "video" : c.appointmentType === "chat" ? "chat" : "urgent") as Consultation["type"],
  topic: "general",
  status: (c.status === "pending" ? "scheduled" : c.status === "approved" ? "in-progress" : c.status === "cancelled" ? "cancelled" : "completed") as Consultation["status"],
  priority: "normal",
  scheduledAt: c.date || c.createdAt,
});

const mapApiDoctorToDoctor = (d: ApiDoctor): Doctor => ({
  id: d._id,
  name: d.name,
  email: d.email,
  avatar: d.pic,
  specialty: (d.specialty as any) ?? "general",
  credentials: [],
  isVerified: (d.doctorStatus || d.status) === "approved",
  isOnline: false,
  availability: "available",
  rating: 0,
  reviewCount: 0,
  currentConsultations: 0,
  totalConsultations: 0,
  languages: [],
  bio: d.bio,
});

export const useAdminStore = create<AdminState>((set, get) => ({
  totalUsers: 0,
  activeConsultations: 0,
  mentalHealthAlerts: 0,
  faqCount: 0,
  dashboardStats: null,

  consultations: [],
  apiConsultations: [],
  consultationsTotal: 0,
  consultationsPage: 1,
  totalPagesConsultations: 1,

  doctors: [],
  apiDoctors: [],
  doctorsTotal: 0,

  users: [],
  usersTotal: 0,
  usersPage: 1,
  usersTotalPages: 1,

  faqs: [],
  faqsTotal: 0,
  faqsPage: 1,
  faqsTotalPages: 1,

  recentActivity: [],
  healthGameStats: null,
  consultationFilters: {},
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const [usersRes, consultationsRes, faqRes] = await Promise.all([
        axios.get("/admin/users?page=1&limit=1"),
        axios.get("/admin/consultations?page=1&limit=1"),
        axios.get("/admin/faq?page=1&limit=1"),
      ]);

      const totalUsers = usersRes.data?.total ?? 0;
      const consultationsTotal = consultationsRes.data?.total ?? 0;
      const faqCount = faqRes.data?.total ?? 0;

      const stats: DashboardStats = {
        totalUsers,
        activeConsultations: consultationsTotal,
        mentalHealthAlerts: 0,
        gameEngagement: faqCount,
        totalConsultationsToday: 0,
        completedThisWeek: 0,
        averageSessionTime: 0,
        activeGamePlayers: faqCount,
      };

      set({
        totalUsers,
        activeConsultations: consultationsTotal,
        mentalHealthAlerts: 0,
        faqCount,
        dashboardStats: stats,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchConsultations: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        `/admin/consultations?page=${page}&limit=${limit}`
      );
      const list: ApiConsultation[] = res.data?.consultations ?? [];
      const total = res.data?.total ?? 0;
      const totalPages = res.data?.totalPages ?? 1;
      const consultations = list.map(mapApiConsultationToConsultation);
      set({
        apiConsultations: list,
        consultations,
        consultationsTotal: total,
        consultationsPage: page,
        totalPagesConsultations: totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  updateConsultationStatus: async (id, status) => {
    try {
      const consultations = get().consultations.map((c) =>
        c.id === id ? { ...c, status: status as any } : c
      );
      set({ consultations });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchDoctors: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        `/admin/all-doctors?page=${page}&limit=${limit}`
      );
      const list: ApiDoctor[] = res.data?.doctors ?? [];
      const total = res.data?.total ?? 0;
      const doctors = list.map(mapApiDoctorToDoctor);
      set({
        apiDoctors: list,
        doctors,
        doctorsTotal: total,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchUsers: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        `/admin/users?page=${page}&limit=${limit}`
      );
      const list: ApiUser[] = res.data?.users ?? [];
      const total = res.data?.total ?? 0;
      const totalPages = res.data?.totalPages ?? 1;
      set({
        users: list,
        usersTotal: total,
        usersPage: page,
        usersTotalPages: totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  blockUser: async (userId: string) => {
    try {
      await axios.post(`/admin/users/${userId}/block`);
      const users = get().users.map((u) =>
        u._id === userId ? { ...u, status: "blocked" } : u
      );
      set({ users });
    } catch (e: any) {
      throw new Error(e.response?.data?.message || e.message || "Failed to block");
    }
  },

  unblockUser: async (userId: string) => {
    try {
      await axios.post(`/admin/users/${userId}/unblock`);
      const users = get().users.map((u) =>
        u._id === userId ? { ...u, status: "active" } : u
      );
      set({ users });
    } catch (e: any) {
      throw new Error(e.response?.data?.message || e.message || "Failed to unblock");
    }
  },

  fetchFaqs: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        `/admin/faq?page=${page}&limit=${limit}`
      );
      const list: ApiFaq[] = res.data?.faqs ?? [];
      const total = res.data?.total ?? 0;
      const totalPages = res.data?.totalPages ?? 1;
      set({
        faqs: list,
        faqsTotal: total,
        faqsPage: page,
        faqsTotalPages: totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  createFaq: async (payload) => {
    try {
      const res = await axios.post("/admin/faq", payload);
      const faq = res.data?.faq ?? null;
      if (faq) {
        const total = get().faqsTotal + 1;
        const faqCount = get().faqCount + 1;
        set((s) => ({
          faqs: [faq, ...s.faqs],
          faqsTotal: total,
          faqCount,
        }));
      }
      return faq;
    } catch (e: any) {
      throw new Error(e.response?.data?.message || e.message || "Failed to create FAQ");
    }
  },

  updateFaq: async (id, payload) => {
    try {
      const res = await axios.put(`/admin/faq/${id}`, payload);
      const updated = res.data?.faq;
      if (updated) {
        set((s) => ({
          faqs: s.faqs.map((f) => (f._id === id ? { ...f, ...updated } : f)),
        }));
      }
    } catch (e: any) {
      throw new Error(e.response?.data?.message || e.message || "Failed to update FAQ");
    }
  },

  deleteFaq: async (id: string) => {
    try {
      await axios.delete(`/admin/faq/${id}`);
      set((s) => ({
        faqs: s.faqs.filter((f) => f._id !== id),
        faqsTotal: Math.max(0, s.faqsTotal - 1),
        faqCount: Math.max(0, s.faqCount - 1),
      }));
    } catch (e: any) {
      throw new Error(e.response?.data?.message || e.message || "Failed to delete FAQ");
    }
  },

  fetchRecentActivity: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ recentActivity: [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchHealthGameStats: async () => {
    set({ isLoading: true, error: null });
    try {
      set({ healthGameStats: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setConsultationFilters: (filters) => set({ consultationFilters: filters }),

  subscribeToUpdates: () => {},
  unsubscribeFromUpdates: () => {},
}));
