import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ClinicalSessionSnapshot } from "../api/meddx";
import type { Case, CaseInput, CaseStatus, ClinicalWorkflow } from "../types";
import {
  buildCaseRecord,
  clearCases as clearLocalCases,
  mergeEngineSnapshot,
  replaceLocalCases,
} from "./caseStore";
import {
  configuredCaseStorageMode,
  createCaseRepository,
  type CaseRepository,
  type CaseStorageMode,
} from "./caseRepository";

interface CaseStoreValue {
  cases: Case[];
  loading: boolean;
  error: string;
  storageMode: CaseStorageMode;
  getCase(caseId: string): Case | undefined;
  saveCaseInput(
    input: CaseInput,
    status: CaseStatus,
    existingCaseId?: string,
    workflow?: ClinicalWorkflow
  ): Promise<Case>;
  applyEngineSnapshot(caseId: string, snapshot: ClinicalSessionSnapshot): Promise<Case | undefined>;
  archiveCase(caseId: string): Promise<void>;
  deleteCase(caseId: string): Promise<void>;
  clearCases(): Promise<void>;
  refresh(): Promise<void>;
  clearError(): void;
}

const CaseStoreContext = createContext<CaseStoreValue | null>(null);

function sortCases(cases: Case[]) {
  return [...cases].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to synchronize clinical cases.";
}

export function CaseStoreProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: CaseRepository;
}) {
  const repositoryRef = useRef<CaseRepository>(
    repository ?? createCaseRepository(configuredCaseStorageMode)
  );
  const activeRepository = repositoryRef.current;
  const casesRef = useRef<Case[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const commitCases = useCallback(
    (nextCases: Case[]) => {
      const sorted = sortCases(nextCases);
      casesRef.current = sorted;
      setCases(sorted);
      if (activeRepository.mode === "server") {
        // Server storage is authoritative. This browser copy is a hydrated cache
        // used only by legacy synchronous presentation helpers.
        replaceLocalCases(sorted, false);
      }
      return sorted;
    },
    [activeRepository.mode]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const loaded = await activeRepository.list();
      commitCases(loaded);
      setError("");
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [activeRepository, commitCases]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getCase = useCallback(
    (caseId: string) => casesRef.current.find((caseRecord) => caseRecord.id === caseId),
    []
  );

  const saveCaseInput = useCallback(
    async (
      input: CaseInput,
      status: CaseStatus,
      existingCaseId?: string,
      workflow?: ClinicalWorkflow
    ) => {
      const currentCases = casesRef.current;
      const existing = existingCaseId
        ? currentCases.find((caseRecord) => caseRecord.id === existingCaseId)
        : undefined;
      const nextCase = buildCaseRecord(input, status, existing, workflow);
      try {
        const saved = await activeRepository.save(nextCase);
        commitCases([
          saved,
          ...casesRef.current.filter((item) => item.id !== saved.id),
        ]);
        setError("");
        return saved;
      } catch (saveError) {
        setError(errorMessage(saveError));
        throw saveError;
      }
    },
    [activeRepository, commitCases]
  );

  const applyEngineSnapshot = useCallback(
    async (caseId: string, snapshot: ClinicalSessionSnapshot) => {
      const existing = casesRef.current.find((caseRecord) => caseRecord.id === caseId);
      if (!existing) return undefined;
      const nextCase = mergeEngineSnapshot(existing, snapshot);
      try {
        const saved = await activeRepository.save(nextCase);
        commitCases([
          saved,
          ...casesRef.current.filter((item) => item.id !== saved.id),
        ]);
        setError("");
        return saved;
      } catch (saveError) {
        setError(errorMessage(saveError));
        throw saveError;
      }
    },
    [activeRepository, commitCases]
  );

  const archiveCase = useCallback(
    async (caseId: string) => {
      try {
        await activeRepository.archive(caseId);
        commitCases(casesRef.current.filter((item) => item.id !== caseId));
        setError("");
      } catch (archiveError) {
        setError(errorMessage(archiveError));
        throw archiveError;
      }
    },
    [activeRepository, commitCases]
  );

  const deleteCase = useCallback(
    async (caseId: string) => {
      try {
        await activeRepository.delete(caseId);
        commitCases(casesRef.current.filter((item) => item.id !== caseId));
        setError("");
      } catch (deleteError) {
        setError(errorMessage(deleteError));
        throw deleteError;
      }
    },
    [activeRepository, commitCases]
  );

  const clearAllCases = useCallback(async () => {
    try {
      await activeRepository.clear();
      commitCases([]);
      clearLocalCases(false);
      setError("");
    } catch (clearError) {
      setError(errorMessage(clearError));
      throw clearError;
    }
  }, [activeRepository, commitCases]);

  const value = useMemo<CaseStoreValue>(
    () => ({
      cases,
      loading,
      error,
      storageMode: activeRepository.mode,
      getCase,
      saveCaseInput,
      applyEngineSnapshot,
      archiveCase,
      deleteCase,
      clearCases: clearAllCases,
      refresh,
      clearError: () => setError(""),
    }),
    [
      cases,
      loading,
      error,
      activeRepository.mode,
      getCase,
      saveCaseInput,
      applyEngineSnapshot,
      archiveCase,
      deleteCase,
      clearAllCases,
      refresh,
    ]
  );

  return <CaseStoreContext.Provider value={value}>{children}</CaseStoreContext.Provider>;
}

export function useCaseStore() {
  const value = useContext(CaseStoreContext);
  if (!value) {
    throw new Error("useCaseStore must be used inside CaseStoreProvider");
  }
  return value;
}
