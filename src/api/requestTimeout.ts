export const DEFAULT_MEDDX_REQUEST_TIMEOUT_MS = 120_000;
const MIN_MEDDX_REQUEST_TIMEOUT_MS = 5_000;
const MAX_MEDDX_REQUEST_TIMEOUT_MS = 600_000;

export function resolveRequestTimeoutMs(rawValue: unknown) {
  if (typeof rawValue !== "string" || !rawValue.trim()) {
    return DEFAULT_MEDDX_REQUEST_TIMEOUT_MS;
  }

  const parsed = Number(rawValue);
  if (
    !Number.isFinite(parsed) ||
    parsed < MIN_MEDDX_REQUEST_TIMEOUT_MS ||
    parsed > MAX_MEDDX_REQUEST_TIMEOUT_MS
  ) {
    return DEFAULT_MEDDX_REQUEST_TIMEOUT_MS;
  }

  return Math.trunc(parsed);
}

export function createRequestControl(
  externalSignal: AbortSignal | null | undefined,
  timeoutMs: number
) {
  const controller = new AbortController();
  let timedOut = false;

  const abortFromCaller = () => controller.abort(externalSignal?.reason);
  if (externalSignal?.aborted) {
    abortFromCaller();
  } else {
    externalSignal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    cleanup: () => {
      clearTimeout(timeoutId);
      externalSignal?.removeEventListener("abort", abortFromCaller);
    },
  };
}
