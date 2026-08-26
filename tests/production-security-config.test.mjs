import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const vercelConfig = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));

function productionHeaders() {
  const rule = vercelConfig.headers?.find((entry) => entry.source === "/(.*)");
  assert.ok(rule, "Vercel must apply production security headers to all routes");
  return new Map(rule.headers.map(({ key, value }) => [key, value]));
}

test("Vercel applies baseline production security headers", () => {
  const headers = productionHeaders();
  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("X-Frame-Options"), "DENY");
  assert.equal(headers.get("Referrer-Policy"), "no-referrer");
  assert.equal(headers.get("Permissions-Policy"), "camera=(), microphone=(), geolocation=()");
  assert.equal(headers.get("Strict-Transport-Security"), "max-age=31536000");
});

test("SPA rewrite remains intact with security headers enabled", () => {
  assert.deepEqual(vercelConfig.rewrites, [
    { source: "/(.*)", destination: "/index.html" },
  ]);
});
