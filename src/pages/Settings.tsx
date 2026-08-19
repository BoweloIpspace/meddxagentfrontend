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
    <div className="app-page max-w-[860px]">
      <div className="app-page-header">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Workspace
        </p>
        <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[34px]">
          Settings
        </h1>
        <p className="mt-3 max-w-[620px] text-[14px] leading-[1.7] text-slate-500">
          Only controls that are genuinely active in the current frontend are shown here.
        </p>
      </div>

      <section className="border-t border-slate-100 pt-8">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div>
            <h2 className="text-[14px] font-semibold text-slate-900">Runtime</h2>
            <p className="mt-1 text-[12px] leading-[1.6] text-slate-400">
              Current application state.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-6 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[13px] font-medium text-slate-800">Diagnostic engine</p>
                <p className="mt-1 text-[12px] leading-[1.55] text-slate-400">
                  No frontend API connection is configured yet.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                Not connected
              </span>
            </div>

            <div className="flex items-start justify-between gap-6 px-5 py-4">
              <div>
                <p className="text-[13px] font-medium text-slate-800">Case persistence</p>
                <p className="mt-1 text-[12px] leading-[1.55] text-slate-400">
                  Case inputs are stored in this browser only.
                </p>
              </div>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                Local
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-slate-100 pt-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div>
            <h2 className="text-[14px] font-semibold text-slate-900">Workspace data</h2>
            <p className="mt-1 text-[12px] leading-[1.6] text-slate-400">
              Manage data created in this browser.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[13px] font-medium text-slate-800">Export cases</p>
                  <p className="mt-1 text-[12px] leading-[1.55] text-slate-400">
                    Download {caseCount === 1 ? "1 local case" : `${caseCount} local cases`} as JSON.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={caseCount === 0}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Export JSON
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[13px] font-medium text-slate-800">Clear local workspace</p>
                  <p className="mt-1 text-[12px] leading-[1.55] text-slate-400">
                    Permanently remove every locally stored case from this browser.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={caseCount === 0}
                  className="rounded-xl border border-rose-200 px-4 py-2.5 text-[12px] font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear cases
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
