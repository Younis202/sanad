import { create } from "zustand";

export interface EmergencyData {
  nationalId: string;
  nameAr: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContacts: { name: string; relation: string; phone: string }[];
  criticalNotes: string;
}

interface EmergencyStore {
  scannedId: string;
  data: EmergencyData | null;
  loading: boolean;
  error: string | null;
  responseTimeMs: number | null;
  setScannedId: (id: string) => void;
  setData: (data: EmergencyData | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  setResponseTime: (ms: number) => void;
  reset: () => void;
}

export const useEmergencyStore = create<EmergencyStore>((set) => ({
  scannedId: "1234567890",
  data: null,
  loading: false,
  error: null,
  responseTimeMs: null,
  setScannedId: (id) => set({ scannedId: id }),
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setResponseTime: (responseTimeMs) => set({ responseTimeMs }),
  reset: () => set({ data: null, error: null, responseTimeMs: null }),
}));
