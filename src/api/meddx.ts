import { humanizeApiError, requestLabel } from "./meddxFeedback";
import { createRequestControl, resolveRequestTimeoutMs } from "./requestTimeout";

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

export type MEDDxAccessTokenProvider = () =>
  | string
  | null
  | undefined
  | Promise<string | null | undefined>;

const rawBaseUrl = import.meta.env.VITE_MEDDX_API_URL ?? "";
export const meddxApiBaseUrl = rawBaseUrl.replace(/\/$/, "");
export const meddxApiConfigured = Boolean(meddxApiBaseUrl);
export const meddxRequestTimeoutMs = resolveRequestTimeoutMs(
  import.meta.env.VITE_MEDDX_REQUEST_TIMEOUT_MS
);

export const MEDDX_REQUEST_START_EVENT = "meddx:request-start";
export const MEDDX_REQUEST_END_EVENT = "meddx:request-end";

let requestSequence = 0;
let accessTokenProvider: MEDDxAccessTokenProvider | null = null;

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

/**
 * Connect an authentication provider without coupling the API client to a
 * specific vendor. The provider should return the current short-lived access
 * token; MEDDxAgent never stores the token in localStorage or a Vite variable.
 */
export function setMEDDxAccessTokenProvider(provider: MEDDxAccessTokenProvider | null) {
  accessTokenProvider = provider;
}

export function meddxAccessTokenProviderConfigured() {
  return accessTokenProvider !== null;
}

async function resolveAccessToken() {
  if (!accessTokenProvider) return null;
  const token = await accessTokenProvider();
  const normalized = typeof token === "string" ? token.trim() : "";
  return normalized || null;
}

function dispatchRequestEvent(type: string, detail: MEDDxRequestEventDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<MEDDxRequestEventDetail>(type, { detail }));
}

export async function meddxRequest<T>(path: string, init?: RequestInit): Promise<T> {
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

  const requestControl = createRequestControl(init?.signal, meddxRequestTimeoutMs);

  try {
    let response: Response;
    try {
      const token = await resolveAccessToken();
      const headers = new Headers(init?.headers);
      if (init?.body !== undefined && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      response = await fetch(`${meddxApiBaseUrl}${path}`, {
        ...init,
        headers,
        signal: requestControl.signal,
      });
    } catch (error) {
      if (error instanceof MEDDxApiError) throw error;
      const detail = error instanceof Error ? error.message : String(error);
      if (requestControl.didTimeout()) {
        throw new MEDDxApiError(
          "The MEDDxAgent clinical API took too long to respond. Please retry.",
          0,
          "request_timeout",
          detail
        );
      }
      throw new MEDDxApiError(
        "Unable to reach the MEDDxAgent clinical API. Check your connection and backend availability, then retry.",
        0,
        "network_error",
        detail
      );
    }

    const body = response.status === 204 ? {} : await response.json().catch(() => ({}));
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
    requestControl.cleanup();
    dispatchRequestEvent(MEDDX_REQUEST_END_EVENT, requestDetail);
  }
}

export function createClinicalSession(patientInitialInfo: string, patientId?: string) {
  return meddxRequest<ClinicalSessionSnapshot>("/api/v1/clinical/sessions", {
    method: "POST",
    body: JSON.stringify({
      patient_initial_info: patientInitialInfo,
      ...(patientId ? { patient_id: patientId } : {}),
    }),
  });
}

export function getClinicalSession(sessionId: string) {
  return meddxRequest<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}`);
}

export function updateClinicalContext(sessionId: string, patientInitialInfo: string) {
  return meddxRequest<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/context`, {
    method: "POST",
    body: JSON.stringify({ patient_initial_info: patientInitialInfo }),
  });
}

export function generateClinicalQuestion(sessionId: string) {
  return meddxRequest<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/question`, {
    method: "POST",
  });
}

export function submitClinicalAnswer(sessionId: string, answer: string) {
  return meddxRequest<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

export function finishClinicalHistory(sessionId: string) {
  return meddxRequest<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/history/finish`, {
    method: "POST",
  });
}

export function runClinicalSession(sessionId: string) {
  return meddxRequest<ClinicalSessionSnapshot>(`/api/v1/clinical/sessions/${sessionId}/run`, {
    method: "POST",
  });
}

export function archiveClinicalSession(sessionId: string) {
  return meddxRequest<{ status: "archived" }>(
    `/api/v1/clinical/sessions/${sessionId}/archive`,
    { method: "POST" }
  );
}

export function deleteClinicalSession(sessionId: string) {
  return meddxRequest<void>(`/api/v1/clinical/sessions/${sessionId}`, {
    method: "DELETE",
  });
}
