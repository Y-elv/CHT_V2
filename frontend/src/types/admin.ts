// types/admin.ts
export interface Consultation {
  id: string;
  userId: string;
  userName: string;
  userAge: number;
  userAvatar?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: "mental-health" | "sexual-health" | "general";
  type: "video" | "chat" | "urgent";
  topic:
    | "mental-health"
    | "sexual-health"
    | "general"
    | "depression"
    | "anxiety";
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  priority: "normal" | "high" | "urgent";
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // minutes
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  specialty: "mental-health" | "sexual-health" | "general";
  credentials: string[];
  isVerified: boolean;
  isOnline: boolean;
  availability: "available" | "busy" | "offline";
  rating: number;
  reviewCount: number;
  currentConsultations: number;
  totalConsultations: number;
  languages: string[];
  bio?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender?: string;
  avatar?: string;
  registeredAt: string;
  lastActive: string;
  consultationsCount: number;
  gameScore: number;
  interests: string[];
  mentalHealthRisk?: "low" | "medium" | "high";
}

export interface Activity {
  id: string;
  type:
    | "user-registered"
    | "consultation-booked"
    | "message-sent"
    | "game-achievement"
    | "doctor-availability";
  timestamp: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  doctorId?: string;
  doctorName?: string;
  description: string;
  priority?: "low" | "medium" | "high";
}

export interface HealthGameStats {
  activePlayers: number;
  totalPlayers: number;
  averageSessionTime: number; // minutes
  popularTopics: { topic: string; plays: number }[];
  rewardsDistributed: number;
  topPerformers: { userId: string; userName: string; score: number }[];
}

export interface AwarenessMessage {
  id: string;
  title: string;
  content: string;
  category: "mental-health" | "sexual-health" | "general" | "motivation";
  targetAudience: "all" | "specific";
  targetAgeRange?: { min: number; max: number };
  targetGender?: "male" | "female" | "other" | "all";
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: string;
  sentAt?: string;
  reachCount?: number;
  engagementRate?: number;
}

export interface ConsultationFilters {
  status?: string;
  type?: string;
  topic?: string;
  dateRange?: { start: string; end: string };
  priority?: string;
  doctorId?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeConsultations: number;
  mentalHealthAlerts: number;
  gameEngagement: number;
  totalConsultationsToday: number;
  completedThisWeek: number;
  averageSessionTime: number;
  activeGamePlayers: number;
}
