// hooks/useConsultations.ts
import { useEffect } from "react";
import { useAdminStore } from "../store/adminStore";
import { ConsultationFilters } from "../types/admin";

export const useConsultations = (filters?: ConsultationFilters) => {
  const consultations = useAdminStore((state) => state.consultations);
  const isLoading = useAdminStore((state) => state.isLoading);
  const error = useAdminStore((state) => state.error);
  const fetchConsultations = useAdminStore((state) => state.fetchConsultations);

  useEffect(() => {
    fetchConsultations(filters);
  }, [fetchConsultations, JSON.stringify(filters)]);

  return { consultations, isLoading, error };
};
