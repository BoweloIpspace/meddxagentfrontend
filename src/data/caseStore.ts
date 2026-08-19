import type { Case, CaseInput, CaseStatus, Patient } from "../types";

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

function parseCases(value: string | null): Case[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as Case[]) : [];
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
    id: input.patientId.trim(),
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

export function caseToInput(caseRecord: Case): CaseInput {
  return {
    patientId: caseRecord.patient.id,
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
  existingCaseId?: string
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
  };

  const nextCases = [nextCase, ...cases.filter((item) => item.id !== nextCase.id)];
  writeCases(nextCases);
  return nextCase;
}

export function deleteCase(caseId: string) {
  writeCases(getCases().filter((item) => item.id !== caseId));
}

export function clearCases() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
