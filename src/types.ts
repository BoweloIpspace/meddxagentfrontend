export type PatientSex = "Male" | "Female" | "Other";

export interface Patient {
  /** Legacy external identifier. New consultations do not collect a patient ID. */
  id?: string;
  age?: number;
  sex?: PatientSex;
  chiefComplaint: string;
  initialInformation: string;
  medicalHistory?: string;
  medications?: string;
  knownConditions?: string;
  riskFactors?: string;
}

export type DiagnosisClassification =
  | "most-likely"
  | "possible"
  | "must-not-miss"
  | "confirmed"
  | "needs-investigation";

export interface ManagementPlan {
  immediate?: string[];
  definitive?: string[];
  supportive?: string[];
  monitoring?: string[];
  escalation?: string[];
  followUp?: string[];
}

export interface DifferentialEntry {
  rank: number;
  diagnosis: string;
  classification?: DiagnosisClassification;
  supportingEvidence?: string[];
  againstEvidence?: string[];
  confirmationNeeds?: string[];
  discriminators?: string[];
  management?: ManagementPlan;
}

export interface HistoryQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface ClinicalSummary {
  positiveFindings: string[];
  negativeFindings: string[];
  riskFactors: string[];
  redFlags: string[];
}

export interface PhysicalExamination {
  generalAppearance: string;
  respiratoryDistress: string;
  cyanosis: string;
  pallor: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  respiratoryExam: string;
  cardiovascularExam: string;
  abdominalExam: string;
  neurologicalExam: string;
  otherFindings: string;
}

export type InvestigationCategory = "initial" | "targeted" | "conditional";

export interface InvestigationEntry {
  id: string;
  name: string;
  category: InvestigationCategory;
  rationale: string;
  result: string;
}

export interface ClinicalWorkflow {
  historyQuestions: HistoryQuestion[];
  historySummary: ClinicalSummary;
  examination: PhysicalExamination;
  investigations: InvestigationEntry[];
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
  workflow: ClinicalWorkflow;
}

export interface CaseInput {
  age: string;
  sex: "" | PatientSex;
  chiefComplaint: string;
  initialInformation: string;
  medicalHistory: string;
  medications: string;
  knownConditions: string;
  riskFactors: string;
}
