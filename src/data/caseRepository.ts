import {
  archiveServerCase,
  deleteServerCase,
  getServerCase,
  listServerCases,
  saveServerCase,
} from "../api/cases";
import type { Case } from "../types";
import {
  clearCases,
  getCase,
  getCases,
  normalizeCase,
  removeLocalCase,
  replaceLocalCases,
} from "./caseStore";

export type CaseStorageMode = "local" | "server";

export interface CaseRepository {
  readonly mode: CaseStorageMode;
  list(): Promise<Case[]>;
  get(caseId: string): Promise<Case | undefined>;
  save(caseRecord: Case): Promise<Case>;
  archive(caseId: string): Promise<void>;
  delete(caseId: string): Promise<void>;
  clear(): Promise<void>;
}

export function resolveCaseStorageMode(rawValue: unknown): CaseStorageMode {
  return typeof rawValue === "string" && rawValue.trim().toLowerCase() === "server"
    ? "server"
    : "local";
}

export const configuredCaseStorageMode = resolveCaseStorageMode(
  import.meta.env.VITE_MEDDX_CASE_STORAGE
);

export class LocalCaseRepository implements CaseRepository {
  readonly mode = "local" as const;

  async list() {
    return getCases();
  }

  async get(caseId: string) {
    return getCase(caseId);
  }

  async save(caseRecord: Case) {
    const cases = getCases();
    const normalized = normalizeCase(caseRecord);
    replaceLocalCases([normalized, ...cases.filter((item) => item.id !== normalized.id)]);
    return normalized;
  }

  async archive(caseId: string) {
    // Browser mode has no hidden archive collection; archive removes it from the workspace.
    removeLocalCase(caseId);
  }

  async delete(caseId: string) {
    removeLocalCase(caseId);
  }

  async clear() {
    clearCases();
  }
}

export class ServerCaseRepository implements CaseRepository {
  readonly mode = "server" as const;

  async list() {
    return (await listServerCases()).map(normalizeCase);
  }

  async get(caseId: string) {
    try {
      return normalizeCase(await getServerCase(caseId));
    } catch (error) {
      if (error instanceof Error && "status" in error && (error as { status?: number }).status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  async save(caseRecord: Case) {
    return normalizeCase(await saveServerCase(normalizeCase(caseRecord)));
  }

  async archive(caseId: string) {
    await archiveServerCase(caseId);
  }

  async delete(caseId: string) {
    await deleteServerCase(caseId);
  }

  async clear() {
    const cases = await this.list();
    // Keep deletion deliberately sequential to avoid triggering API abuse/rate limits.
    for (const caseRecord of cases) {
      await this.delete(caseRecord.id);
    }
  }
}

export function createCaseRepository(mode = configuredCaseStorageMode): CaseRepository {
  return mode === "server" ? new ServerCaseRepository() : new LocalCaseRepository();
}
