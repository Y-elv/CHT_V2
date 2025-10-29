// store/consultationStore.ts
import { create } from "zustand";
import { Consultation, ConsultationFilters } from "../types/admin";

interface ConsultationState {
  consultations: Consultation[];
  filters: ConsultationFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setConsultations: (consultations: Consultation[]) => void;
  setFilters: (filters: ConsultationFilters) => void;
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  removeConsultation: (id: string) => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  consultations: [],
  filters: {},
  isLoading: false,
  error: null,

  setConsultations: (consultations) => set({ consultations }),

  setFilters: (filters) => set({ filters }),

  updateConsultation: (id, updates) =>
    set((state) => ({
      consultations: state.consultations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  removeConsultation: (id) =>
    set((state) => ({
      consultations: state.consultations.filter((c) => c.id !== id),
    })),
}));
