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
  CASE_STORE_CHANGED_EVENT,
  buildCaseRecord,
  clearCases as clearLocalCases,
  mergeEngineSnapshot,
  removeLocalCase,
  replaceLocalCases,
  type CaseStoreChangedDetail,
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
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const commitCases = useCallback(
    (nextCases: Case[]) => {
      const sorted = sortCases(nextCases);
      setCases(sorted);
      if (activeRepository.mode === "server") {
        // The existing consultation screen reads the browser cache synchronously.
        // In server mode this is only a hydrated cache; the backend remains authoritative.
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

  useEffect(() => {
    const handleCacheMutation = (event: Event) => {
      const detail = (event as CustomEvent<CaseStoreChangedDetail>).detail;
      if (!detail) return;
      const nextCases = sortCases(detail.cases);
      setCases(nextCases);

      if (activeRepository.mode !== "server") return;

      void (async () => {
        try {
          for (const caseId of detail.changedCaseIds) {
            const changed = nextCases.find((caseRecord) => caseRecord.id === caseId);
            if (changed) await activeRepository.save(changed);
          }
          for (const caseId of detail.deletedCaseIds) {
            await activeRepository.delete(caseId);
          }
          setError("");
        } catch (syncError) {
          setError(errorMessage(syncError));
        }
      })();
    };

    window.addEventListener(CASE_STORE_CHANGED_EVENT, handleCacheMutation as EventListener);
    return () => {
      window.removeEventListener(CASE_STORE_CHANGED_EVENT, handleCacheMutation as EventListener);
    };
  }, [activeRepository]);

  const getCase = useCallback(
    (caseId: string) => cases.find((caseRecord) => caseRecord.id === caseId),
    [cases]
  );

  const saveCaseInput = useCallback(
    async (
      input: CaseInput,
      status: CaseStatus,
      existingCaseId?: string,
      workflow?: ClinicalWorkflow
    ) => {
      const existing = existingCaseId
        ? cases.find((caseRecord) => caseRecord.id === existingCaseId)
        : undefined;
      const nextCase = buildCaseRecord(input, status, existing, workflow);
      try {
        const saved = await activeRepository.save(nextCase);
        const nextCases = commitCases([
          saved,
          ...cases.filter((item) => item.id !== saved.id),
        ]);
        if (activeRepository.mode === "local") replaceLocalCases(nextCases, false);
        setError("");
        return saved;
      } catch (saveError) {
        setError(errorMessage(saveError));
        throw saveError;
      }
    },
    [activeRepository, cases, commitCases]
  );

  const applyEngineSnapshot = useCallback(
    async (caseId: string, snapshot: ClinicalSessionSnapshot) => {
      const existing = cases.find((caseRecord) => caseRecord.id === caseId);
      if (!existing) return undefined;
      const nextCase = mergeEngineSnapshot(existing, snapshot);
      try {
        const saved = await activeRepository.save(nextCase);
        const nextCases = commitCases([
          saved,
          ...cases.filter((item) => item.id !== saved.id),
        ]);
        if (activeRepository.mode === "local") replaceLocalCases(nextCases, false);
        setError("");
        return saved;
      } catch (saveError) {
        setError(errorMessage(saveError));
        throw saveError;
      }
    },
    [activeRepository, cases, commitCases]
  );

  const archiveCase = useCallback(
    async (caseId: string) => {
      try {
        await activeRepository.archive(caseId);
        const nextCases = cases.filter((item) => item.id !== caseId);
        commitCases(nextCases);
        if (activeRepository.mode === "local") removeLocalCase(caseId, false);
        setError("");
      } catch (archiveError) {
        setError(errorMessage(archiveError));
        throw archiveError;
      }
    },
    [activeRepository, cases, commitCases]
  );

  const deleteCase = useCallback(
    async (caseId: string) => {
      try {
        await activeRepository.delete(caseId);
        const nextCases = cases.filter((item) => item.id !== caseId);
        commitCases(nextCases);
        if (activeRepository.mode === "local") removeLocalCase(caseId, false);
        setError("");
      } catch (deleteError) {
        setError(errorMessage(deleteError));
        throw deleteError;
      }
    },
    [activeRepository, cases, commitCases]
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
