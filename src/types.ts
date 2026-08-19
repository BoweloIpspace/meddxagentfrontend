/* ── Domain types for MEDDxAgent clinical interface ── */

export interface Patient {
  id: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  chiefComplaint: string;
  initialInformation: string;
  medicalHistory?: string;
  medications?: string;
  knownConditions?: string;
  riskFactors?: string;
  confirmedSymptoms: string[];
  newlyDiscovered: string[];
}

export interface DifferentialEntry {
  rank: number;
  diagnosis: string;
  confidence: "High" | "Moderate" | "Low";
  change?: {
    direction: "up" | "down" | "new";
    previousRank?: number;
  };
}

export interface EvidenceSource {
  type: "PubMed" | "Wikipedia" | "Clinical Guideline";
  title: string;
  snippet: string;
  relevance: "High" | "Medium" | "Low";
  url?: string;
}

export interface HistoryQuestion {
  question: string;
  response: string;
  timestamp: string;
}

export interface DiagnosticIteration {
  iteration: number;
  timestamp: string;
  differential: DifferentialEntry[];
  evidenceSummary: string;
  changes: Array<{
    diagnosis: string;
    direction: "up" | "down" | "new";
    previousRank?: number;
    newRank: number;
  }>;
}

export type AgentStage =
  | "history_taking"
  | "knowledge_retrieval"
  | "diagnosis_strategy"
  | "complete";

export interface AgentActivity {
  id: string;
  timestamp: string;
  stage: AgentStage;
  title: string;
  description: string;
}

export type CaseStatus = "active" | "completed" | "draft";

export interface Case {
  id: string;
  patient: Patient;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  currentIteration: number;
  maxIterations: number;
  differential: DifferentialEntry[];
  activities: AgentActivity[];
  iterations: DiagnosticIteration[];
  historyQuestions: HistoryQuestion[];
  evidence: EvidenceSource[];
  evidenceSummary: string;
}
