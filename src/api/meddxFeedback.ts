export interface RequestActivityDetail {
  id: string;
  label: string;
}

export type RequestActivityPhase = "start" | "end";

export function requestLabel(path: string): string {
  if (path === "/api/v1/cases") return "Loading clinical cases";
  if (path.includes("/api/v1/cases/") && path.endsWith("/archive")) return "Archiving clinical case";
  if (path.includes("/api/v1/cases/")) return "Syncing clinical case";
  if (path.endsWith("/question")) return "Generating targeted history question";
  if (path.endsWith("/answer")) return "Saving patient response";
  if (path.endsWith("/history/finish")) return "Finalizing clinical history";
  if (path.endsWith("/run")) return "Running MEDDxAgent diagnosis pipeline";
  if (path.endsWith("/context")) return "Syncing clinical context";
  if (path.endsWith("/archive")) return "Archiving clinical session";
  if (path === "/api/v1/clinical/sessions") return "Preparing clinical session";
  return "Contacting MEDDxAgent";
}

export function humanizeApiError(rawMessage: string, status: number): string {
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("insufficient_quota") ||
    normalized.includes("exceeded your current quota") ||
    (normalized.includes("billing") && normalized.includes("quota"))
  ) {
    return "The OpenAI API account configured for MEDDxAgent has no available quota. Add API credit or update the API billing configuration, then retry.";
  }

  if (
    normalized.includes("invalid_api_key") ||
    normalized.includes("incorrect api key") ||
    (normalized.includes("authentication") && normalized.includes("openai"))
  ) {
    return "MEDDxAgent cannot authenticate with the configured OpenAI API account. Check the API key configuration, then retry.";
  }

  if (status === 401) {
    return "An authenticated account is required for this MEDDxAgent resource. Sign in through the configured identity provider, then retry.";
  }

  if (status === 403) {
    return "Your authenticated account is not authorized to use this MEDDxAgent resource.";
  }

  if (
    status === 410 ||
    (normalized.includes("session") &&
      (normalized.includes("expired") || normalized.includes("archived")))
  ) {
    return "This clinical session is no longer active. Start or resume an available consultation before retrying.";
  }

  if (
    normalized.includes("session") &&
    (normalized.includes("not found") ||
      normalized.includes("does not exist") ||
      normalized.includes("unknown"))
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

export function updateRequestActivity(
  activeRequests: Map<string, string>,
  phase: RequestActivityPhase,
  detail: RequestActivityDetail
): string | null {
  if (phase === "start") {
    activeRequests.set(detail.id, detail.label);
  } else {
    activeRequests.delete(detail.id);
  }

  const remaining = Array.from(activeRequests.values());
  return remaining.length ? remaining[remaining.length - 1] : null;
}
