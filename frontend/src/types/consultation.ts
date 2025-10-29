// types/consultation.ts
export interface Consultation extends import("./admin").Consultation {}
export type ConsultationType = "video" | "chat" | "urgent";
export type ConsultationStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";
export type ConsultationPriority = "normal" | "high" | "urgent";
export type ConsultationTopic =
  | "mental-health"
  | "sexual-health"
  | "general"
  | "depression"
  | "anxiety";
