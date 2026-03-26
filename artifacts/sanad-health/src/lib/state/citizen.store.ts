import { create } from "zustand";

interface CitizenStore {
  nationalId: string;
  healthScore: number | null;
  patient: Record<string, unknown> | null;
  recentVisits: unknown[];
  currentMedications: unknown[];
  aiAlerts: unknown[];
  labResults: unknown[];
  upcomingVaccinations: unknown[];
  loading: boolean;
  error: string | null;
  setNationalId: (id: string) => void;
  setDashboard: (data: {
    healthScore: number;
    patient: Record<string, unknown>;
    recentVisits: unknown[];
    currentMedications: unknown[];
    aiAlerts: unknown[];
    labResults: unknown[];
    upcomingVaccinations: unknown[];
  }) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useCitizenStore = create<CitizenStore>((set) => ({
  nationalId: "1234567890",
  healthScore: null,
  patient: null,
  recentVisits: [],
  currentMedications: [],
  aiAlerts: [],
  labResults: [],
  upcomingVaccinations: [],
  loading: false,
  error: null,
  setNationalId: (nationalId) => set({ nationalId }),
  setDashboard: (data) => set({ ...data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
