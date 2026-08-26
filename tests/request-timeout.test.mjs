import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_MEDDX_REQUEST_TIMEOUT_MS,
  createRequestControl,
  resolveRequestTimeoutMs,
} from "../.test-dist/requestTimeout.js";

test("request timeout configuration uses a bounded production default", () => {
  assert.equal(resolveRequestTimeoutMs(undefined), DEFAULT_MEDDX_REQUEST_TIMEOUT_MS);
  assert.equal(resolveRequestTimeoutMs("120000"), 120000);
  assert.equal(resolveRequestTimeoutMs("4999"), DEFAULT_MEDDX_REQUEST_TIMEOUT_MS);
  assert.equal(resolveRequestTimeoutMs("600001"), DEFAULT_MEDDX_REQUEST_TIMEOUT_MS);
  assert.equal(resolveRequestTimeoutMs("invalid"), DEFAULT_MEDDX_REQUEST_TIMEOUT_MS);
});

test("request control forwards caller cancellation", () => {
  const caller = new AbortController();
  const control = createRequestControl(caller.signal, 60_000);

  caller.abort("cancelled-by-caller");

  assert.equal(control.signal.aborted, true);
  assert.equal(control.didTimeout(), false);
  control.cleanup();
});

test("request control aborts when its timeout expires", async () => {
  const control = createRequestControl(undefined, 10);
  await new Promise((resolve) => setTimeout(resolve, 30));

  assert.equal(control.signal.aborted, true);
  assert.equal(control.didTimeout(), true);
  control.cleanup();
});
