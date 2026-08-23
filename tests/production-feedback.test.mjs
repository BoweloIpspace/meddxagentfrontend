import assert from "node:assert/strict";
import test from "node:test";

import {
  humanizeApiError,
  requestLabel,
  updateRequestActivity,
} from "../.test-dist/meddxFeedback.js";

test("clinical request labels stay specific for long-running workflow actions", () => {
  assert.equal(
    requestLabel("/api/v1/clinical/sessions/session-1/question"),
    "Generating targeted history question"
  );
  assert.equal(
    requestLabel("/api/v1/clinical/sessions/session-1/history/finish"),
    "Finalizing clinical history"
  );
  assert.equal(
    requestLabel("/api/v1/clinical/sessions/session-1/run"),
    "Running MEDDxAgent diagnosis pipeline"
  );
  assert.equal(
    requestLabel("/api/v1/clinical/sessions"),
    "Preparing clinical session"
  );
});

test("server case and lifecycle requests have explicit loading labels", () => {
  assert.equal(requestLabel("/api/v1/cases"), "Loading clinical cases");
  assert.equal(requestLabel("/api/v1/cases/CASE-1"), "Syncing clinical case");
  assert.equal(
    requestLabel("/api/v1/cases/CASE-1/archive"),
    "Archiving clinical case"
  );
  assert.equal(
    requestLabel("/api/v1/clinical/sessions/session-1/archive"),
    "Archiving clinical session"
  );
});

test("overlapping requests keep the loading status visible until all work completes", () => {
  const active = new Map();
  const first = { id: "request-1", label: "Preparing clinical session" };
  const second = { id: "request-2", label: "Generating targeted history question" };

  assert.equal(updateRequestActivity(active, "start", first), first.label);
  assert.equal(updateRequestActivity(active, "start", second), second.label);
  assert.equal(updateRequestActivity(active, "end", second), first.label);
  assert.equal(updateRequestActivity(active, "end", first), null);
  assert.equal(active.size, 0);
});

test("ending an unknown request does not clear a real active request", () => {
  const active = new Map();
  const real = { id: "request-1", label: "Running MEDDxAgent diagnosis pipeline" };

  updateRequestActivity(active, "start", real);
  assert.equal(
    updateRequestActivity(active, "end", { id: "missing", label: "ignored" }),
    real.label
  );
});

test("common production API failures remain clinician-readable", () => {
  assert.match(
    humanizeApiError("OpenAI insufficient_quota", 429),
    /no available quota/i
  );
  assert.match(
    humanizeApiError("invalid_api_key", 401),
    /cannot authenticate/i
  );
  assert.match(
    humanizeApiError("Clinical session not found", 404),
    /session is no longer available/i
  );
  assert.match(
    humanizeApiError("Too many requests", 429),
    /temporarily rate-limited/i
  );
  assert.match(
    humanizeApiError("upstream failure", 500),
    /could not complete this request/i
  );
});

test("application authentication and expired-session errors stay actionable", () => {
  assert.match(
    humanizeApiError("Authentication required", 401),
    /authenticated account is required/i
  );
  assert.match(
    humanizeApiError("Not authorized", 403),
    /not authorized/i
  );
  assert.match(
    humanizeApiError("Clinical session expired", 410),
    /no longer active/i
  );
});

test("specific validation errors are preserved instead of being hidden", () => {
  assert.equal(
    humanizeApiError("answer exceeds the maximum allowed length", 400),
    "answer exceeds the maximum allowed length"
  );
});
