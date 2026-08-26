import assert from "node:assert/strict";
import test from "node:test";

import {
  clearAllServerCases,
  loadAllServerCases,
  SERVER_CASE_PAGE_SIZE,
} from "../.test-dist/data/serverCasePagination.js";

test("server case list loads every backend page", async () => {
  const source = Array.from({ length: 1201 }, (_, index) => ({ id: `case-${index}` }));
  const calls = [];

  const cases = await loadAllServerCases(async (limit, offset) => {
    calls.push({ limit, offset });
    return source.slice(offset, offset + limit);
  });

  assert.equal(cases.length, 1201);
  assert.deepEqual(calls, [
    { limit: SERVER_CASE_PAGE_SIZE, offset: 0 },
    { limit: SERVER_CASE_PAGE_SIZE, offset: 500 },
    { limit: SERVER_CASE_PAGE_SIZE, offset: 1000 },
  ]);
  assert.equal(new Set(cases.map((item) => item.id)).size, 1201);
});

test("server case clear drains every backend page", async () => {
  const remaining = Array.from({ length: 1201 }, (_, index) => ({ id: `case-${index}` }));
  const deleted = [];
  const calls = [];

  await clearAllServerCases(
    async (limit, offset) => {
      calls.push({ limit, offset });
      return remaining.slice(offset, offset + limit);
    },
    async (caseId) => {
      deleted.push(caseId);
      const index = remaining.findIndex((item) => item.id === caseId);
      assert.notEqual(index, -1);
      remaining.splice(index, 1);
    }
  );

  assert.equal(remaining.length, 0);
  assert.equal(deleted.length, 1201);
  assert.deepEqual(calls, [
    { limit: SERVER_CASE_PAGE_SIZE, offset: 0 },
    { limit: SERVER_CASE_PAGE_SIZE, offset: 0 },
    { limit: SERVER_CASE_PAGE_SIZE, offset: 0 },
  ]);
});

test("server case pagination rejects invalid page sizes", async () => {
  await assert.rejects(
    loadAllServerCases(async () => [], SERVER_CASE_PAGE_SIZE + 1),
    RangeError
  );
  await assert.rejects(
    clearAllServerCases(async () => [], async () => {}, SERVER_CASE_PAGE_SIZE + 1),
    RangeError
  );
});
