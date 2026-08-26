export const SERVER_CASE_PAGE_SIZE = 500;

type ServerCaseIdentity = { id: string };

type CasePageLoader<T extends ServerCaseIdentity> = (
  limit: number,
  offset: number
) => Promise<T[]>;

export async function loadAllServerCases<T extends ServerCaseIdentity>(
  listCases: CasePageLoader<T>,
  pageSize = SERVER_CASE_PAGE_SIZE
): Promise<T[]> {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > SERVER_CASE_PAGE_SIZE) {
    throw new RangeError(`Server case page size must be between 1 and ${SERVER_CASE_PAGE_SIZE}`);
  }

  const allCases: T[] = [];
  let offset = 0;
  while (true) {
    const cases = await listCases(pageSize, offset);
    allCases.push(...cases);
    if (cases.length < pageSize) return allCases;
    offset += cases.length;
  }
}

export async function clearAllServerCases(
  listCases: CasePageLoader<ServerCaseIdentity>,
  deleteCase: (caseId: string) => Promise<void>,
  pageSize = SERVER_CASE_PAGE_SIZE
) {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > SERVER_CASE_PAGE_SIZE) {
    throw new RangeError(`Server case page size must be between 1 and ${SERVER_CASE_PAGE_SIZE}`);
  }

  while (true) {
    // Always drain the first page because deleting rows changes subsequent offsets.
    const cases = await listCases(pageSize, 0);
    if (cases.length === 0) return;

    for (const caseRecord of cases) {
      await deleteCase(caseRecord.id);
    }

    if (cases.length < pageSize) return;
  }
}
