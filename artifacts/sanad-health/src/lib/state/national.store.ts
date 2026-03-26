import { create } from "zustand";

interface SystemStats {
  totalPatients: number;
  totalHospitals: number;
  totalMedicalRecords: number;
  drugInteractionsPrevented: number;
  emergencyResponsesThisMonth: number;
  activePhysicians: number;
}

interface NationalStore {
  stats: SystemStats | null;
  patients: unknown[];
  loading: boolean;
  error: string | null;
  setStats: (s: SystemStats) => void;
  setPatients: (p: unknown[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useNationalStore = create<NationalStore>((set) => ({
  stats: null,
  patients: [],
  loading: false,
  error: null,
  setStats: (stats) => set({ stats }),
  setPatients: (patients) => set({ patients }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
