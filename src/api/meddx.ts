export interface ClinicalHistoryTurn {
  question: string;
  answer: string;
}

export interface ClinicalEngineResult {
  ranked_differential: string[];
  rationale: string;
  dialogue_history: string;
  rag_content: string;
  intermediate_differentials: string[][];
}

export interface ClinicalSessionSnapshot {
  session_id: string;
  patient_initial_info: string;
  patient_profile: string;
  history_complete: boolean;
  pending_question: string | null;
  history_turns: ClinicalHistoryTurn[];
  dialogue_history: string;
  result: ClinicalEngineResult | null;
  question?: string | null;
}

const rawBaseUrl = import.meta.env.VITE_MEDDX_API_URL ?? "";
export const meddxApiBaseUrl = rawBaseUrl.replace(/\/$/, "");
export const meddxApiConfigured = Boolean(meddxApiBaseUrl);

export class MEDDxApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "MEDDxApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!meddxApiConfigured) {
    throw new MEDDxApiError("MEDDxAgent backend is not configured.", 0);
  }

  const response = await fetch(`${meddxApiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.error === "string" ? body.error : "MEDDxAgent request failed.";
    throw new MEDDxApiError(message, response.status);
  }

  return body as T;
}

export function createClinicalSession(patientInitialInfo: string, patientId?: string) {
  return request<ClinicalSessionSnapshot>("/api/v1/clinical/sessions", {
    method: "POST",
    body: JSON.stringify({
      patient_initial_info: patientInitialInfo,
      ...(patientId ? { patient_id: patientId } : {}),
    }),
  });
}

export function getClinicalSession(sessionId: string) {
  return request<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}`);
}

export function updateClinicalContext(sessionId: string, patientInitialInfo: string) {
  return request<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/context`, {
    method: "POST",
    body: JSON.stringify({ patient_initial_info: patientInitialInfo }),
  });
}

export function generateClinicalQuestion(sessionId: string) {
  return request<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/question`, {
    method: "POST",
  });
}

export function submitClinicalAnswer(sessionId: string, answer: string) {
  return request<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

export function finishClinicalHistory(sessionId: string) {
  return request<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/history/finish`, {
    method: "POST",
  });
}

export function runClinicalSession(sessionId: string) {
  return request<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/run`, {
    method: "POST",
  });
}
