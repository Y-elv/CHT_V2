// types/doctor.ts
export interface Doctor extends import("./admin").Doctor {}
export type DoctorSpecialty = "mental-health" | "sexual-health" | "general";
export type DoctorAvailability = "available" | "busy" | "offline";
