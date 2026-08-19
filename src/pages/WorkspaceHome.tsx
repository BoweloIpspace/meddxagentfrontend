import { Link } from "react-router-dom";
import { getCases } from "../data/caseStore";

const statusLabel = {
  draft: "Draft",
  ready: "Ready",
  active: "In progress",
  completed: "Completed",
  error: "Needs attention",
} as const;

export default function WorkspaceHome() {
  const cases = getCases();
  const latestCase = cases[0];

  return (
    <div className="app-page max-w-[1040px]">
      <div className="app-page-header flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Workspace
          </p>
          <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[34px]">
            Start with the patient information you actually have.
          </h1>
          <p className="mt-3 max-w-[680px] text-[14px] leading-[1.7] text-slate-500">
            Cases created here are stored on this device. MEDDxAgent output stays empty until the
            diagnostic engine is connected and run, so the interface never invents results.
          </p>
        </div>
        <Link
          to="/cases/new"
          className="button-primary button-accent inline-flex shrink-0 items-center justify-center rounded-xl px-5 py-3 text-[13px] font-semibold text-white"
        >
          New case
        </Link>
      </div>

      {latestCase ? (
        <div className="grid gap-8 border-t border-slate-100 pt-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] text-slate-400">{latestCase.id}</span>
              <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                {statusLabel[latestCase.status]}
              </span>
            </div>
            <h2 className="mt-4 text-[21px] font-semibold tracking-[-0.025em] text-slate-950">
              {latestCase.patient.chiefComplaint || "Untitled case"}
            </h2>
            <p className="mt-2 text-[13px] text-slate-500">
              {latestCase.patient.id || "Patient ID not entered"}
              {latestCase.patient.age ? ` · ${latestCase.patient.age}y` : ""}
              {latestCase.patient.sex ? ` · ${latestCase.patient.sex}` : ""}
            </p>
            <p className="mt-4 max-w-[680px] text-[13px] leading-[1.65] text-slate-400">
              Updated {new Date(latestCase.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={latestCase.status === "draft" ? `/case/${latestCase.id}/edit` : `/case/${latestCase.id}`}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800"
            >
              {latestCase.status === "draft" ? "Continue draft" : "Open case"}
            </Link>
            <Link
              to="/cases"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              All cases
            </Link>
          </div>
        </div>
      ) : (
        <div className="border-t border-slate-100 py-16 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </div>
          <h2 className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-slate-900">
            No cases yet
          </h2>
          <p className="mx-auto mt-2 max-w-[460px] text-[13px] leading-[1.65] text-slate-400">
            Create the first case from real patient context. No sample cases are preloaded.
          </p>
          <Link
            to="/cases/new"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Create first case
          </Link>
        </div>
      )}
    </div>
  );
}
