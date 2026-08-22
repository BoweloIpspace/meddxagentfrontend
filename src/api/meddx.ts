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

export interface MEDDxRequestEventDetail {
  id: string;
  path: string;
  label: string;
}

const rawBaseUrl = import.meta.env.VITE_MEDDX_API_URL ?? "";
export const meddxApiBaseUrl = rawBaseUrl.replace(/\/$/, "");
export const meddxApiConfigured = Boolean(meddxApiBaseUrl);

export const MEDDX_REQUEST_START_EVENT = "meddx:request-start";
export const MEDDX_REQUEST_END_EVENT = "meddx:request-end";

let requestSequence = 0;

export class MEDDxApiError extends Error {
  status: number;
  code?: string;
  detail?: string;

  constructor(message: string, status: number, code?: string, detail?: string) {
    super(message);
    this.name = "MEDDxApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

function requestLabel(path: string) {
  if (path.endsWith("/question")) return "Generating targeted history question";
  if (path.endsWith("/answer")) return "Saving patient response";
  if (path.endsWith("/history/finish")) return "Finalizing clinical history";
  if (path.endsWith("/run")) return "Running MEDDxAgent diagnosis pipeline";
  if (path.endsWith("/context")) return "Syncing clinical context";
  if (path === "/api/v1/clinical/sessions") return "Preparing clinical session";
  return "Contacting MEDDxAgent";
}

function dispatchRequestEvent(type: string, detail: MEDDxRequestEventDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<MEDDxRequestEventDetail>(type, { detail }));
}

function humanizeApiError(rawMessage: string, status: number) {
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("insufficient_quota") ||
    normalized.includes("exceeded your current quota") ||
    normalized.includes("billing") && normalized.includes("quota")
  ) {
    return "The OpenAI API account configured for MEDDxAgent has no available quota. Add API credit or update the API billing configuration, then retry.";
  }

  if (
    normalized.includes("invalid_api_key") ||
    normalized.includes("incorrect api key") ||
    normalized.includes("authentication") && normalized.includes("openai")
  ) {
    return "MEDDxAgent cannot authenticate with the configured OpenAI API account. Check the API key configuration, then retry.";
  }

  if (
    normalized.includes("session") &&
    (normalized.includes("not found") || normalized.includes("does not exist") || normalized.includes("unknown"))
  ) {
    return "This clinical session is no longer available. Start a new consultation and retry.";
  }

  if (status === 429 || normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "The clinical engine is temporarily rate-limited. Wait a moment, then retry the request.";
  }

  if (normalized.includes("timeout") || normalized.includes("timed out")) {
    return "The clinical engine took too long to respond. Retry once; if it continues, check the backend service.";
  }

  if (status >= 500) {
    return "MEDDxAgent could not complete this request. Retry once; if it continues, check the backend service logs.";
  }

  if (status === 404) {
    return "The requested MEDDxAgent resource is no longer available. Refresh the workflow or start a new consultation.";
  }

  return rawMessage || "MEDDxAgent request failed.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!meddxApiConfigured) {
    throw new MEDDxApiError(
      "MEDDxAgent backend is not configured. Add the clinical API URL before running the engine.",
      0
    );
  }

  const requestDetail: MEDDxRequestEventDetail = {
    id: `meddx-request-${++requestSequence}`,
    path,
    label: requestLabel(path),
  };
  dispatchRequestEvent(MEDDX_REQUEST_START_EVENT, requestDetail);

  try {
    let response: Response;
    try {
      response = await fetch(`${meddxApiBaseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new MEDDxApiError(
        "Unable to reach the MEDDxAgent clinical API. Check your connection and backend availability, then retry.",
        0,
        "network_error",
        detail
      );
    }

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const rawMessage = typeof body?.error === "string" ? body.error : "MEDDxAgent request failed.";
      const code = typeof body?.code === "string" ? body.code : undefined;
      throw new MEDDxApiError(
        humanizeApiError(rawMessage, response.status),
        response.status,
        code,
        rawMessage
      );
    }

    return body as T;
  } finally {
    dispatchRequestEvent(MEDDX_REQUEST_END_EVENT, requestDetail);
  }
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
