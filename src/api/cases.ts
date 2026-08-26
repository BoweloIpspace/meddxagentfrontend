import { meddxRequest } from "./meddx";
import type { Case } from "../types";

interface CaseEnvelope {
  case: Case;
}

interface CaseListEnvelope {
  cases: Case[];
}

export function listServerCases(limit = 100, offset = 0) {
  const normalizedLimit = Math.max(1, Math.min(500, Math.trunc(limit)));
  const normalizedOffset = Math.max(0, Math.trunc(offset));
  return meddxRequest<CaseListEnvelope>(
    `/api/v1/cases?limit=${normalizedLimit}&offset=${normalizedOffset}`
  ).then((response) => response.cases);
}

export function getServerCase(caseId: string) {
  return meddxRequest<CaseEnvelope>(`/api/v1/cases/${encodeURIComponent(caseId)}`).then(
    (response) => response.case
  );
}

export function saveServerCase(caseRecord: Case) {
  return meddxRequest<CaseEnvelope>(`/api/v1/cases/${encodeURIComponent(caseRecord.id)}`, {
    method: "PUT",
    body: JSON.stringify(caseRecord),
  }).then((response) => response.case);
}

export function archiveServerCase(caseId: string) {
  return meddxRequest<{ status: "archived" }>(
    `/api/v1/cases/${encodeURIComponent(caseId)}/archive`,
    { method: "POST" }
  );
}

export function deleteServerCase(caseId: string) {
  return meddxRequest<void>(`/api/v1/cases/${encodeURIComponent(caseId)}`, {
    method: "DELETE",
  });
}
