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
import { buildCaseRecord, mergeEngineSnapshot } from "./caseStore";
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

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const loaded = await activeRepository.list();
      setCases(sortCases(loaded));
      setError("");
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [activeRepository]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
        setCases((current) =>
          sortCases([saved, ...current.filter((item) => item.id !== saved.id)])
        );
        setError("");
        return saved;
      } catch (saveError) {
        setError(errorMessage(saveError));
        throw saveError;
      }
    },
    [activeRepository, cases]
  );

  const applyEngineSnapshot = useCallback(
    async (caseId: string, snapshot: ClinicalSessionSnapshot) => {
      const existing = cases.find((caseRecord) => caseRecord.id === caseId);
      if (!existing) return undefined;
      const nextCase = mergeEngineSnapshot(existing, snapshot);
      try {
        const saved = await activeRepository.save(nextCase);
        setCases((current) =>
          sortCases([saved, ...current.filter((item) => item.id !== saved.id)])
        );
        setError("");
        return saved;
      } catch (saveError) {
        setError(errorMessage(saveError));
        throw saveError;
      }
    },
    [activeRepository, cases]
  );

  const archiveCase = useCallback(
    async (caseId: string) => {
      try {
        await activeRepository.archive(caseId);
        setCases((current) => current.filter((item) => item.id !== caseId));
        setError("");
      } catch (archiveError) {
        setError(errorMessage(archiveError));
        throw archiveError;
      }
    },
    [activeRepository]
  );

  const deleteCase = useCallback(
    async (caseId: string) => {
      try {
        await activeRepository.delete(caseId);
        setCases((current) => current.filter((item) => item.id !== caseId));
        setError("");
      } catch (deleteError) {
        setError(errorMessage(deleteError));
        throw deleteError;
      }
    },
    [activeRepository]
  );

  const clearAllCases = useCallback(async () => {
    try {
      await activeRepository.clear();
      setCases([]);
      setError("");
    } catch (clearError) {
      setError(errorMessage(clearError));
      throw clearError;
    }
  }, [activeRepository]);

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
