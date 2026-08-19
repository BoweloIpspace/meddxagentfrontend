import { Link, useParams } from "react-router-dom";
import { getCase } from "../data/caseStore";
import type { CaseStatus } from "../types";

const statusLabels: Record<CaseStatus, string> = {
  draft: "Draft",
  ready: "Ready",
  active: "In progress",
  completed: "Completed",
  error: "Needs attention",
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="mt-2 text-[13px] leading-[1.65] text-slate-600">{value}</p>
    </div>
  );
}

export default function ActiveCase() {
  const { id } = useParams<{ id: string }>();
  const caseRecord = id ? getCase(id) : undefined;

  if (!caseRecord) {
    return (
      <div className="app-page max-w-[760px] text-center">
        <div className="py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Case unavailable</p>
          <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.035em] text-slate-950">
            This case does not exist in the local workspace.
          </h1>
          <p className="mx-auto mt-3 max-w-[500px] text-[13px] leading-[1.65] text-slate-400">
            Cases are stored on this device only until backend persistence is connected.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Link to="/cases" className="rounded-xl bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white">
              View cases
            </Link>
            <Link to="/cases/new" className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600">
              New case
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { patient } = caseRecord;
  const hasDiagnosticOutput = caseRecord.differential.length > 0;
  const hasSupportingOutput = Boolean(
    caseRecord.rationale.trim() || caseRecord.dialogueHistory.trim() || caseRecord.ragContent.trim()
  );

  return (
    <div className="app-page">
      <div className="app-page-header flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400">{caseRecord.id}</span>
            <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
              {statusLabels[caseRecord.status]}
            </span>
          </div>
          <h1 className="mt-4 max-w-[760px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[34px]">
            {patient.chiefComplaint || "Untitled case"}
          </h1>
          <p className="mt-3 text-[13px] text-slate-400">
            {patient.id || "Patient ID not entered"}
            {patient.age ? ` · ${patient.age}y` : ""}
            {patient.sex ? ` · ${patient.sex}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/case/${caseRecord.id}/edit`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            Edit case
          </Link>
          <Link
            to="/cases"
            className="rounded-xl px-3 py-2.5 text-[12px] font-medium text-slate-400 transition-colors hover:text-slate-700"
          >
            All cases
          </Link>
        </div>
      </div>

      <div className="grid gap-10 border-t border-slate-100 pt-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <section>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Patient context
          </p>
          <div className="rounded-2xl border border-slate-200 bg-white px-5">
            <DetailRow label="Initial information" value={patient.initialInformation} />
            <DetailRow label="Medical history" value={patient.medicalHistory} />
            <DetailRow label="Current medications" value={patient.medications} />
            <DetailRow label="Known conditions" value={patient.knownConditions} />
            <DetailRow label="Risk factors" value={patient.riskFactors} />
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Diagnostic output
              </p>
              <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-slate-950">
                Differential diagnosis
              </h2>
            </div>
            {caseRecord.currentIteration > 0 && (
              <span className="font-mono text-[10px] text-slate-400">Iteration {caseRecord.currentIteration}</span>
            )}
          </div>

          {hasDiagnosticOutput ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {caseRecord.differential.map((entry) => (
                <div key={`${entry.rank}-${entry.diagnosis}`} className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 font-mono text-[10px] text-slate-500">
                    {String(entry.rank).padStart(2, "0")}
                  </span>
                  <p className="text-[14px] font-medium text-slate-800">{entry.diagnosis}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10">
              <p className="text-[14px] font-semibold text-slate-800">No diagnostic output yet</p>
              <p className="mt-2 max-w-[620px] text-[13px] leading-[1.65] text-slate-400">
                This case currently contains only the information entered in the workspace. A ranked differential,
                rationale, dialogue history, and retrieved context will appear here only after the real diagnostic engine is connected and run.
              </p>
            </div>
          )}

          {caseRecord.rationale.trim() && (
            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Rationale</p>
              <p className="mt-3 whitespace-pre-wrap text-[13px] leading-[1.75] text-slate-600">{caseRecord.rationale}</p>
            </div>
          )}

          {hasSupportingOutput && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {caseRecord.dialogueHistory.trim() && (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Dialogue history</p>
                  <p className="mt-3 whitespace-pre-wrap text-[12px] leading-[1.7] text-slate-600">{caseRecord.dialogueHistory}</p>
                </div>
              )}
              {caseRecord.ragContent.trim() && (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Retrieved context</p>
                  <p className="mt-3 whitespace-pre-wrap text-[12px] leading-[1.7] text-slate-600">{caseRecord.ragContent}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
