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
    <div className="app-page max-w-[1120px]">
      <div className="app-page-header grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
            Workspace
          </p>
          <h1 className="max-w-[820px] text-[38px] font-medium leading-[1.03] tracking-[-0.05em] text-neutral-950 sm:text-[48px]">
            Start with the patient information you actually have.
          </h1>
          <p className="mt-5 max-w-[720px] text-[15px] leading-[1.7] text-neutral-600">
            Cases are stored on this device. Diagnostic output stays empty until the MEDDxAgent
            engine is connected and run.
          </p>
        </div>
        <Link
          to="/cases/new"
          className="button-primary inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-[13px] font-medium text-white"
        >
          New case
        </Link>
      </div>

      {latestCase ? (
        <div className="grid gap-10 border-t border-neutral-300 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] text-neutral-500">{latestCase.id}</span>
              <span className="rounded-full border border-neutral-300 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                {statusLabel[latestCase.status]}
              </span>
            </div>
            <h2 className="mt-5 max-w-[760px] text-[28px] font-medium leading-[1.12] tracking-[-0.035em] text-neutral-950">
              {latestCase.patient.chiefComplaint || "Untitled case"}
            </h2>
            <p className="mt-3 text-[13px] text-neutral-600">
              {latestCase.patient.id || "Patient ID not entered"}
              {latestCase.patient.age ? ` · ${latestCase.patient.age}y` : ""}
              {latestCase.patient.sex ? ` · ${latestCase.patient.sex}` : ""}
            </p>
            <p className="mt-6 text-[11px] text-neutral-500">
              Updated {new Date(latestCase.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <Link
              to={latestCase.status === "draft" ? `/case/${latestCase.id}/edit` : `/case/${latestCase.id}`}
              className="button-primary rounded-full px-4 py-2.5 text-[13px] font-medium text-white"
            >
              {latestCase.status === "draft" ? "Continue draft" : "Open case"}
            </Link>
            <Link
              to="/cases"
              className="inline-flex items-center py-2.5 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-950"
            >
              All cases →
            </Link>
          </div>
        </div>
      ) : (
        <div className="border-t border-neutral-300 py-20">
          <div className="max-w-[620px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
              No cases yet
            </p>
            <h2 className="mt-5 text-[30px] font-medium tracking-[-0.04em] text-neutral-950">
              Create the first case when you’re ready.
            </h2>
            <p className="mt-4 max-w-[520px] text-[14px] leading-[1.7] text-neutral-600">
              Nothing is preloaded. Only patient information entered in this workspace will appear here.
            </p>
            <Link
              to="/cases/new"
              className="button-primary mt-7 inline-flex rounded-full px-4 py-2.5 text-[13px] font-medium text-white"
            >
              Create first case
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
