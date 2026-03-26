import { create } from "zustand";

export interface PatientSummary {
  totalVisits: number;
  hospitalsVisited: number;
  activeMedications: number;
  lastVisit: string;
  riskScore: "low" | "medium" | "high";
}

export interface DrugAlert {
  severity: string;
  drug1: string;
  drug2: string;
  message: string;
  messageAr: string;
}

export interface PatientFull {
  id: number;
  nationalId: string;
  nameAr: string;
  nameEn: string;
  bloodType: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  phone: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContacts: { name: string; relation: string; phone: string }[];
  currentMedications: {
    name: string; nameAr: string; dosage: string; frequency: string;
    prescribedBy: string; hospital: string; prescribedDate: string;
  }[];
  medicalRecords: {
    id: number; date: string; hospital: string; hospitalAr: string;
    doctorName: string; specialty: string; specialtyAr: string;
    diagnosis: string; diagnosisAr: string; notes: string; type: string;
  }[];
  labResults: {
    id: number; testName: string; testNameAr: string; date: string;
    hospital: string; value: string; unit: string; normalRange: string; status: string;
  }[];
  vaccinations: {
    name: string; nameAr: string; date: string; nextDue: string | null; status: string;
  }[];
}

interface ClinicalStore {
  searchId: string;
  patient: PatientFull | null;
  summary: PatientSummary | null;
  drugAlerts: DrugAlert[];
  loading: boolean;
  error: string | null;
  activeTab: "timeline" | "labs" | "medications" | "vaccinations";
  newDrugInput: string;
  interactionResult: { hasInteraction: boolean; severity: string; alerts: DrugAlert[] } | null;
  setSearchId: (id: string) => void;
  setPatient: (p: PatientFull | null) => void;
  setSummary: (s: PatientSummary | null) => void;
  setDrugAlerts: (a: DrugAlert[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  setActiveTab: (t: "timeline" | "labs" | "medications" | "vaccinations") => void;
  setNewDrugInput: (v: string) => void;
  setInteractionResult: (r: { hasInteraction: boolean; severity: string; alerts: DrugAlert[] } | null) => void;
}

export const useClinicalStore = create<ClinicalStore>((set) => ({
  searchId: "1234567890",
  patient: null,
  summary: null,
  drugAlerts: [],
  loading: false,
  error: null,
  activeTab: "timeline",
  newDrugInput: "",
  interactionResult: null,
  setSearchId: (searchId) => set({ searchId }),
  setPatient: (patient) => set({ patient }),
  setSummary: (summary) => set({ summary }),
  setDrugAlerts: (drugAlerts) => set({ drugAlerts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setNewDrugInput: (newDrugInput) => set({ newDrugInput }),
  setInteractionResult: (interactionResult) => set({ interactionResult }),
}));
