export type PatientSex = "Male" | "Female" | "Other";

export interface Patient {
  id: string;
  age?: number;
  sex?: PatientSex;
  chiefComplaint: string;
  initialInformation: string;
  medicalHistory?: string;
  medications?: string;
  knownConditions?: string;
  riskFactors?: string;
}

export interface DifferentialEntry {
  rank: number;
  diagnosis: string;
}

export type CaseStatus = "draft" | "ready" | "active" | "completed" | "error";

export interface Case {
  id: string;
  patient: Patient;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  currentIteration: number;
  differential: DifferentialEntry[];
  rationale: string;
  dialogueHistory: string;
  ragContent: string;
}

export interface CaseInput {
  patientId: string;
  age: string;
  sex: "" | PatientSex;
  chiefComplaint: string;
  initialInformation: string;
  medicalHistory: string;
  medications: string;
  knownConditions: string;
  riskFactors: string;
}
