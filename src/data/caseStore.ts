import type { ClinicalSessionSnapshot } from "../api/meddx";
import type {
  Case,
  CaseInput,
  CaseStatus,
  ClinicalWorkflow,
  Patient,
} from "../types";

const STORAGE_KEY = "meddxagent.cases.v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createCaseId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `CASE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  return `CASE-${Date.now().toString(36).toUpperCase()}`;
}

export function createEmptyClinicalWorkflow(): ClinicalWorkflow {
  return {
    historyQuestions: [],
    historySummary: {
      positiveFindings: [],
      negativeFindings: [],
      riskFactors: [],
      redFlags: [],
    },
    examination: {
      generalAppearance: "",
      respiratoryDistress: "",
      cyanosis: "",
      pallor: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      heartRate: "",
      bloodPressure: "",
      temperature: "",
      respiratoryExam: "",
      cardiovascularExam: "",
      abdominalExam: "",
      neurologicalExam: "",
      otherFindings: "",
    },
    investigations: [],
  };
}

function normalizeCase(caseRecord: Case): Case {
  const emptyWorkflow = createEmptyClinicalWorkflow();
  const storedWorkflow = caseRecord.workflow;

  return {
    ...caseRecord,
    patient: {
      ...caseRecord.patient,
      id: caseRecord.patient.id || undefined,
    },
    engineSessionId: caseRecord.engineSessionId || undefined,
    workflow: {
      historyQuestions: storedWorkflow?.historyQuestions ?? emptyWorkflow.historyQuestions,
      historySummary: {
        ...emptyWorkflow.historySummary,
        ...(storedWorkflow?.historySummary ?? {}),
      },
      examination: {
        ...emptyWorkflow.examination,
        ...(storedWorkflow?.examination ?? {}),
      },
      investigations: storedWorkflow?.investigations ?? emptyWorkflow.investigations,
    },
  };
}

function parseCases(value: string | null): Case[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as Case[]).map(normalizeCase) : [];
  } catch {
    return [];
  }
}

function writeCases(cases: Case[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function getCases(): Case[] {
  if (!canUseStorage()) return [];

  return parseCases(window.localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getCase(caseId: string): Case | undefined {
  return getCases().find((item) => item.id === caseId);
}

function buildPatient(input: CaseInput): Patient {
  const parsedAge = input.age.trim() === "" ? undefined : Number(input.age);

  return {
    age: Number.isFinite(parsedAge) ? parsedAge : undefined,
    sex: input.sex || undefined,
    chiefComplaint: input.chiefComplaint.trim(),
    initialInformation: input.initialInformation.trim(),
    medicalHistory: input.medicalHistory.trim() || undefined,
    medications: input.medications.trim() || undefined,
    knownConditions: input.knownConditions.trim() || undefined,
    riskFactors: input.riskFactors.trim() || undefined,
  };
}

/**
 * Builds the clinical string that the application adapter can pass directly to
 * DDxDriver's Patient(patient_initial_info=...). Every editable intake field in
 * the consultation must have a deterministic destination in this payload or in
 * the engine-owned doctor/patient dialogue.
 */
export function buildDDxPatientInitialInfo(input: CaseInput, workflow: ClinicalWorkflow): string {
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    const normalized = value?.trim();
    if (normalized) lines.push(`${label}: ${normalized}`);
  };

  add("Age", input.age);
  add("Sex", input.sex);
  add("Chief complaint", input.chiefComplaint);
  add("Initial clinical information", input.initialInformation);
  add("Relevant chronic conditions", input.knownConditions);
  add("Current medications", input.medications);
  add("Other relevant background", input.medicalHistory);
  add("Known risk factors", input.riskFactors);

  const examination = workflow.examination;
  add("General appearance", examination.generalAppearance);
  add("Respiratory distress", examination.respiratoryDistress);
  add("Cyanosis", examination.cyanosis);
  add("Pallor", examination.pallor);
  add("Respiratory rate", examination.respiratoryRate);
  add("Oxygen saturation", examination.oxygenSaturation);
  add("Heart rate", examination.heartRate);
  add("Blood pressure", examination.bloodPressure);
  add("Temperature", examination.temperature);
  add("Respiratory examination", examination.respiratoryExam);
  add("Cardiovascular examination", examination.cardiovascularExam);
  add("Abdominal examination", examination.abdominalExam);
  add("Neurological examination", examination.neurologicalExam);
  add("Other examination findings", examination.otherFindings);

  workflow.investigations.forEach((investigation, index) => {
    const name = investigation.name.trim();
    const result = investigation.result.trim();
    if (!name && !result) return;
    const label = name || `Investigation ${index + 1}`;
    lines.push(`Investigation - ${label}: ${result || "Result not entered"}`);
  });

  return lines.join("\n");
}

export function caseToInput(caseRecord: Case): CaseInput {
  return {
    age: caseRecord.patient.age?.toString() ?? "",
    sex: caseRecord.patient.sex ?? "",
    chiefComplaint: caseRecord.patient.chiefComplaint,
    initialInformation: caseRecord.patient.initialInformation,
    medicalHistory: caseRecord.patient.medicalHistory ?? "",
    medications: caseRecord.patient.medications ?? "",
    knownConditions: caseRecord.patient.knownConditions ?? "",
    riskFactors: caseRecord.patient.riskFactors ?? "",
  };
}

export function saveCaseInput(
  input: CaseInput,
  status: CaseStatus,
  existingCaseId?: string,
  workflow?: ClinicalWorkflow
): Case {
  const cases = getCases();
  const existing = existingCaseId ? cases.find((item) => item.id === existingCaseId) : undefined;
  const now = new Date().toISOString();

  const nextCase: Case = {
    id: existing?.id ?? createCaseId(),
    patient: buildPatient(input),
    status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    currentIteration: existing?.currentIteration ?? 0,
    differential: existing?.differential ?? [],
    rationale: existing?.rationale ?? "",
    dialogueHistory: existing?.dialogueHistory ?? "",
    ragContent: existing?.ragContent ?? "",
    workflow: workflow ?? existing?.workflow ?? createEmptyClinicalWorkflow(),
    engineSessionId: existing?.engineSessionId,
  };

  const nextCases = [nextCase, ...cases.filter((item) => item.id !== nextCase.id)];
  writeCases(nextCases);
  return nextCase;
}

export function applyEngineSnapshot(caseId: string, snapshot: ClinicalSessionSnapshot): Case | undefined {
  const cases = getCases();
  const existing = cases.find((item) => item.id === caseId);
  if (!existing) return undefined;

  const result = snapshot.result;
  const nextWorkflow: ClinicalWorkflow = {
    ...existing.workflow,
    historyQuestions: snapshot.history_turns.map((turn, index) => ({
      id: `engine-history-${index + 1}`,
      question: turn.question,
      answer: turn.answer,
    })),
  };

  const nextCase: Case = {
    ...existing,
    updatedAt: new Date().toISOString(),
    status: result ? "completed" : "active",
    currentIteration: result?.intermediate_differentials.length ?? existing.currentIteration,
    differential: result
      ? result.ranked_differential.map((diagnosis, index) => ({ rank: index + 1, diagnosis }))
      : existing.differential,
    rationale: result?.rationale ?? existing.rationale,
    dialogueHistory: result?.dialogue_history || snapshot.dialogue_history || existing.dialogueHistory,
    ragContent: result?.rag_content ?? existing.ragContent,
    workflow: nextWorkflow,
    engineSessionId: snapshot.session_id,
  };

  writeCases([nextCase, ...cases.filter((item) => item.id !== caseId)]);
  return nextCase;
}

export function clearCases() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
