import { useState } from "react";
import { clearCases, getCases } from "../data/caseStore";

export default function Settings() {
  const [caseCount, setCaseCount] = useState(() => getCases().length);

  const handleExport = () => {
    const cases = getCases();
    if (cases.length === 0) return;

    const blob = new Blob([JSON.stringify(cases, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `meddxagent-cases-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (caseCount === 0) return;

    const confirmed = window.confirm(
      "Remove every locally stored MEDDxAgent case from this browser? This cannot be undone."
    );

    if (!confirmed) return;
    clearCases();
    setCaseCount(0);
  };

  return (
    <div className="app-page max-w-[960px]">
      <div className="app-page-header">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
          Workspace
        </p>
        <h1 className="text-[38px] font-medium leading-[1.03] tracking-[-0.05em] text-neutral-950 sm:text-[48px]">
          Settings
        </h1>
        <p className="mt-5 max-w-[620px] text-[14px] leading-[1.7] text-neutral-600">
          Only controls that are genuinely active in the current frontend are shown here.
        </p>
      </div>

      <section className="border-t border-neutral-300 pt-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-14">
          <div>
            <h2 className="text-[14px] font-medium text-neutral-950">Runtime</h2>
            <p className="mt-2 text-[12px] leading-[1.6] text-neutral-500">
              Current application state.
            </p>
          </div>

          <div className="border-y border-neutral-200">
            <div className="flex items-start justify-between gap-8 border-b border-neutral-200 py-5">
              <div>
                <p className="text-[13px] font-medium text-neutral-900">Diagnostic engine</p>
                <p className="mt-1.5 text-[12px] leading-[1.6] text-neutral-500">
                  No frontend API connection is configured yet.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-neutral-300 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                Not connected
              </span>
            </div>

            <div className="flex items-start justify-between gap-8 py-5">
              <div>
                <p className="text-[13px] font-medium text-neutral-900">Case persistence</p>
                <p className="mt-1.5 text-[12px] leading-[1.6] text-neutral-500">
                  Case inputs are stored in this browser only.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-neutral-950 bg-neutral-950 px-2.5 py-1 text-[10px] font-medium text-white">
                Local
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 border-t border-neutral-300 pt-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-14">
          <div>
            <h2 className="text-[14px] font-medium text-neutral-950">Workspace data</h2>
            <p className="mt-2 text-[12px] leading-[1.6] text-neutral-500">
              Manage data created in this browser.
            </p>
          </div>

          <div className="border-y border-neutral-200">
            <div className="flex flex-col gap-5 border-b border-neutral-200 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[13px] font-medium text-neutral-900">Export cases</p>
                <p className="mt-1.5 text-[12px] leading-[1.6] text-neutral-500">
                  Download {caseCount === 1 ? "1 local case" : `${caseCount} local cases`} as JSON.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={caseCount === 0}
                className="shrink-0 rounded-full border border-neutral-300 px-4 py-2.5 text-[12px] font-medium text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Export JSON
              </button>
            </div>

            <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[13px] font-medium text-neutral-900">Clear local workspace</p>
                <p className="mt-1.5 text-[12px] leading-[1.6] text-neutral-500">
                  Permanently remove every locally stored case from this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={caseCount === 0}
                className="shrink-0 rounded-full border border-neutral-950 px-4 py-2.5 text-[12px] font-medium text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                Clear cases
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
