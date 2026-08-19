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
    <div className="grid gap-2 border-b border-neutral-200 py-5 last:border-0 sm:grid-cols-[150px_1fr] sm:gap-6">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">{label}</p>
      <p className="text-[13px] leading-[1.7] text-neutral-700">{value}</p>
    </div>
  );
}

export default function ActiveCase() {
  const { id } = useParams<{ id: string }>();
  const caseRecord = id ? getCase(id) : undefined;

  if (!caseRecord) {
    return (
      <div className="app-page max-w-[760px]">
        <div className="border-t border-neutral-300 py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">Case unavailable</p>
          <h1 className="mt-5 max-w-[640px] text-[34px] font-medium leading-[1.06] tracking-[-0.045em] text-neutral-950">
            This case does not exist in the local workspace.
          </h1>
          <p className="mt-4 max-w-[520px] text-[14px] leading-[1.7] text-neutral-600">
            Cases are stored on this device only until backend persistence is connected.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/cases" className="button-primary rounded-full px-4 py-2.5 text-[13px] font-medium text-white">
              View cases
            </Link>
            <Link to="/cases/new" className="text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-950">
              New case →
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
      <div className="app-page-header grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] text-neutral-500">{caseRecord.id}</span>
            <span className="rounded-full border border-neutral-300 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
              {statusLabels[caseRecord.status]}
            </span>
          </div>
          <h1 className="mt-5 max-w-[860px] text-[38px] font-medium leading-[1.03] tracking-[-0.05em] text-neutral-950 sm:text-[48px]">
            {patient.chiefComplaint || "Untitled case"}
          </h1>
          <p className="mt-4 text-[13px] text-neutral-500">
            {patient.id || "Patient ID not entered"}
            {patient.age ? ` · ${patient.age}y` : ""}
            {patient.sex ? ` · ${patient.sex}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            to={`/case/${caseRecord.id}/edit`}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-[12px] font-medium text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
          >
            Edit case
          </Link>
          <Link
            to="/cases"
            className="py-2.5 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            All cases →
          </Link>
        </div>
      </div>

      <div className="grid gap-16 border-t border-neutral-300 pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <section>
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
            Patient context
          </p>
          <div className="border-y border-neutral-200">
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
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                Diagnostic output
              </p>
              <h2 className="mt-3 text-[28px] font-medium tracking-[-0.035em] text-neutral-950">
                Differential diagnosis
              </h2>
            </div>
            {caseRecord.currentIteration > 0 && (
              <span className="font-mono text-[10px] text-neutral-500">Iteration {caseRecord.currentIteration}</span>
            )}
          </div>

          {hasDiagnosticOutput ? (
            <div className="mt-8 border-y border-neutral-300">
              {caseRecord.differential.map((entry) => (
                <div key={`${entry.rank}-${entry.diagnosis}`} className="grid grid-cols-[42px_1fr] items-center gap-4 border-b border-neutral-200 py-5 last:border-0">
                  <span className="font-mono text-[10px] text-neutral-500">
                    {String(entry.rank).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] font-medium text-neutral-900">{entry.diagnosis}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 border-y border-neutral-300 py-10">
              <p className="text-[16px] font-medium text-neutral-950">Case input is ready.</p>
              <p className="mt-3 max-w-[620px] text-[13px] leading-[1.7] text-neutral-600">
                No diagnostic output has been generated. A ranked differential, rationale, dialogue history,
                and retrieved context will appear here only after the real MEDDxAgent engine is connected and run.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  to="/settings"
                  className="rounded-full border border-neutral-300 px-4 py-2.5 text-[12px] font-medium text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
                >
                  View connection status
                </Link>
                <Link
                  to={`/case/${caseRecord.id}/edit`}
                  className="py-2.5 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  Review patient input →
                </Link>
              </div>
            </div>
          )}

          {caseRecord.rationale.trim() && (
            <div className="mt-10 border-t border-neutral-200 pt-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">Rationale</p>
              <p className="mt-4 whitespace-pre-wrap text-[13px] leading-[1.75] text-neutral-700">{caseRecord.rationale}</p>
            </div>
          )}

          {hasSupportingOutput && (
            <div className="mt-12 space-y-10 border-t border-neutral-200 pt-8">
              {caseRecord.dialogueHistory.trim() && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">Dialogue history</p>
                  <p className="mt-4 whitespace-pre-wrap text-[12px] leading-[1.75] text-neutral-700">{caseRecord.dialogueHistory}</p>
                </div>
              )}
              {caseRecord.ragContent.trim() && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">Retrieved context</p>
                  <p className="mt-4 whitespace-pre-wrap text-[12px] leading-[1.75] text-neutral-700">{caseRecord.ragContent}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
