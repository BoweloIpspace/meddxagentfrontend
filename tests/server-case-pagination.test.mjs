import assert from "node:assert/strict";
import test from "node:test";

import {
  clearAllServerCases,
  SERVER_CASE_PAGE_SIZE,
} from "../.test-dist/data/serverCasePagination.js";

test("server case clear drains every backend page", async () => {
  const remaining = Array.from({ length: 1201 }, (_, index) => ({ id: `case-${index}` }));
  const deleted = [];
  const pageSizes = [];

  await clearAllServerCases(
    async (limit) => {
      pageSizes.push(limit);
      return remaining.slice(0, limit);
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
  assert.deepEqual(pageSizes, [SERVER_CASE_PAGE_SIZE, SERVER_CASE_PAGE_SIZE, SERVER_CASE_PAGE_SIZE]);
});

test("server case clear rejects invalid page sizes", async () => {
  await assert.rejects(
    clearAllServerCases(async () => [], async () => {}, SERVER_CASE_PAGE_SIZE + 1),
    RangeError
  );
});
