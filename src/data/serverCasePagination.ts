export const SERVER_CASE_PAGE_SIZE = 500;

type ServerCaseIdentity = { id: string };

export async function clearAllServerCases(
  listCases: (limit: number) => Promise<ServerCaseIdentity[]>,
  deleteCase: (caseId: string) => Promise<void>,
  pageSize = SERVER_CASE_PAGE_SIZE
) {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > SERVER_CASE_PAGE_SIZE) {
    throw new RangeError(`Server case page size must be between 1 and ${SERVER_CASE_PAGE_SIZE}`);
  }

  while (true) {
    const cases = await listCases(pageSize);
    if (cases.length === 0) return;

    for (const caseRecord of cases) {
      await deleteCase(caseRecord.id);
    }

    if (cases.length < pageSize) return;
  }
}
