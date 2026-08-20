import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCase } from "../data/caseStore";
import type {
  CaseStatus,
  DiagnosisClassification,
  DifferentialEntry,
  ManagementPlan,
} from "../types";

const statusLabels: Record<CaseStatus, string> = {
  draft: "Draft",
  ready: "Ready",
  active: "In progress",
  completed: "Completed",
  error: "Needs attention",
};

const classificationLabels: Record<DiagnosisClassification, string> = {
  "most-likely": "Most likely",
  possible: "Possible",
  "must-not-miss": "Must not miss",
  confirmed: "Confirmed",
  "needs-investigation": "Needs investigation",
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-[13px] leading-[1.65] text-slate-600">{value}</p>
    </div>
  );
}

function FindingList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "emerald" | "slate" | "amber" | "rose";
}) {
  const toneClasses = {
    emerald: "border-emerald-200 bg-emerald-50/60",
    slate: "border-slate-200 bg-slate-50/70",
    amber: "border-amber-200 bg-amber-50/60",
    rose: "border-rose-200 bg-rose-50/60",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <p className="text-[12px] font-semibold text-slate-800">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-[12px] leading-[1.55] text-slate-600">
              <span aria-hidden="true">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[12px] text-slate-400">None recorded.</p>
      )}
    </div>
  );
}

function StructuredList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="text-[12px] font-semibold text-slate-900">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-[12px] leading-[1.6] text-slate-600">
            <span className="text-blue-500" aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ManagementSection({ plan }: { plan?: ManagementPlan }) {
  if (!plan) return null;

  const groups = [
    ["Immediate management", plan.immediate],
    ["Definitive treatment", plan.definitive],
    ["Supportive management", plan.supportive],
    ["Monitoring", plan.monitoring],
    ["Escalation", plan.escalation],
    ["Follow-up / reassessment", plan.followUp],
  ] as const;

  if (!groups.some(([, items]) => items?.length)) return null;

  return (
    <div className="mt-8 border-t border-slate-100 pt-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Management if confirmed</p>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {groups.map(([title, items]) =>
          items?.length ? <StructuredList key={title} title={title} items={items} /> : null
        )}
      </div>
    </div>
  );
}

function DiagnosisDetail({ entry, rationale }: { entry: DifferentialEntry; rationale: string }) {
  const hasStructuredDetail = Boolean(
    entry.supportingEvidence?.length ||
      entry.againstEvidence?.length ||
      entry.confirmationNeeds?.length ||
      entry.discriminators?.length ||
      entry.management
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] text-blue-600">Diagnosis {entry.rank}</p>
          <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-slate-950">{entry.diagnosis}</h2>
        </div>
        {entry.classification && (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
            {classificationLabels[entry.classification]}
          </span>
        )}
      </div>

      {hasStructuredDetail ? (
        <div className="mt-7 grid gap-7 md:grid-cols-2">
          <StructuredList title="Why this diagnosis is plausible" items={entry.supportingEvidence} />
          <StructuredList title="What makes it less likely" items={entry.againstEvidence} />
          <StructuredList title="What should be confirmed" items={entry.confirmationNeeds} />
          <StructuredList title="What could change the ranking" items={entry.discriminators} />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[12px] font-semibold text-slate-700">Structured diagnosis detail is not available yet.</p>
          <p className="mt-1 text-[12px] leading-[1.6] text-slate-400">
            The frontend is ready for supporting evidence, contradictory evidence, confirmation criteria, discriminators, and management, but it will not invent them without MEDDxAgent/application-layer output.
          </p>
        </div>
      )}

      {rationale.trim() && (
        <div className="mt-7 border-t border-slate-100 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">MEDDxAgent rationale</p>
          <p className="mt-3 whitespace-pre-wrap text-[12px] leading-[1.7] text-slate-600">{rationale}</p>
        </div>
      )}

      <ManagementSection plan={entry.management} />
    </div>
  );
}

export default function ActiveCase() {
  const { id } = useParams<{ id: string }>();
  const caseRecord = id ? getCase(id) : undefined;
  const [selectedRank, setSelectedRank] = useState<number | null>(null);

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
            <Link to="/cases" className="rounded-xl bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white">View cases</Link>
            <Link to="/cases/new" className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600">New case</Link>
          </div>
        </div>
      </div>
    );
  }

  const { patient, workflow } = caseRecord;
  const hasDiagnosticOutput = caseRecord.differential.length > 0;
  const selectedEntry =
    caseRecord.differential.find((entry) => entry.rank === selectedRank) ?? caseRecord.differential[0];
  const hasHistorySummary = Object.values(workflow.historySummary).some((items) => items.length > 0);
  const examinationValues = Object.values(workflow.examination).filter(Boolean);
  const hasExamination = examinationValues.length > 0;

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
            {patient.age ? `${patient.age}y` : "Age not entered"}
            {patient.sex ? ` · ${patient.sex}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/case/${caseRecord.id}/edit`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            Edit consultation
          </Link>
          <Link to="/cases" className="rounded-xl px-3 py-2.5 text-[12px] font-medium text-slate-400 transition-colors hover:text-slate-700">
            All cases
          </Link>
        </div>
      </div>

      <section className="border-t border-slate-100 pt-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Clinical history summary</p>
            {hasHistorySummary ? (
              <div className="grid gap-4 md:grid-cols-2">
                <FindingList title="Key positive findings" items={workflow.historySummary.positiveFindings} tone="emerald" />
                <FindingList title="Important negative findings" items={workflow.historySummary.negativeFindings} tone="slate" />
                <FindingList title="Risk factors" items={workflow.historySummary.riskFactors} tone="amber" />
                <FindingList title="Red flags / urgent concerns" items={workflow.historySummary.redFlags} tone="rose" />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-[12px] text-slate-400">
                No structured history summary recorded yet.
              </div>
            )}
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Differential</p>
                <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-slate-950">Ranked diagnosis</h2>
              </div>
              {caseRecord.currentIteration > 0 && (
                <span className="font-mono text-[10px] text-slate-400">Iteration {caseRecord.currentIteration}</span>
              )}
            </div>

            {hasDiagnosticOutput ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {caseRecord.differential.map((entry) => {
                  const active = selectedEntry?.rank === entry.rank;
                  return (
                    <button
                      key={`${entry.rank}-${entry.diagnosis}`}
                      type="button"
                      onClick={() => setSelectedRank(entry.rank)}
                      className={`flex w-full items-center gap-4 border-b border-slate-100 px-4 py-4 text-left transition-colors last:border-0 ${active ? "bg-blue-50/70" : "hover:bg-slate-50"}`}
                    >
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-[10px] ${active ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-500"}`}>
                        {entry.rank}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold text-slate-800">{entry.diagnosis}</span>
                        {entry.classification && (
                          <span className="mt-1 block text-[10px] text-slate-400">{classificationLabels[entry.classification]}</span>
                        )}
                      </span>
                      <span className="text-blue-500" aria-hidden="true">→</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-5 py-7">
                <p className="text-[13px] font-semibold text-slate-800">Awaiting MEDDxAgent</p>
                <p className="mt-2 text-[12px] leading-[1.65] text-slate-400">
                  No ranked differential has been generated. The frontend will not substitute mock diagnoses for engine output.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="app-section">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Patient context</p>
            <div className="rounded-2xl border border-slate-200 bg-white px-5">
              <DetailRow label="Initial information" value={patient.initialInformation} />
              <DetailRow label="Relevant medical history" value={patient.medicalHistory} />
              <DetailRow label="Current medications" value={patient.medications} />
              <DetailRow label="Known conditions" value={patient.knownConditions} />
              <DetailRow label="Known risk factors" value={patient.riskFactors} />
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Targeted history</p>
            <div className="rounded-2xl border border-slate-200 bg-white px-5">
              {workflow.historyQuestions.length > 0 ? (
                workflow.historyQuestions.map((item, index) => (
                  <div key={item.id} className="border-b border-slate-100 py-4 last:border-0">
                    <p className="font-mono text-[10px] text-blue-600">Q{String(index + 1).padStart(2, "0")}</p>
                    <p className="mt-2 text-[12px] font-semibold text-slate-800">{item.question || "Question not entered"}</p>
                    <p className="mt-1 text-[12px] leading-[1.6] text-slate-500">{item.answer || "No answer recorded"}</p>
                  </div>
                ))
              ) : (
                <p className="py-6 text-[12px] text-slate-400">No targeted history questions recorded.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="app-section">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Physical examination</p>
            {hasExamination ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-5">
                <DetailRow label="General appearance" value={workflow.examination.generalAppearance} />
                <DetailRow label="Respiratory distress" value={workflow.examination.respiratoryDistress} />
                <DetailRow label="Cyanosis" value={workflow.examination.cyanosis} />
                <DetailRow label="Pallor" value={workflow.examination.pallor} />
                <DetailRow label="Respiratory rate" value={workflow.examination.respiratoryRate} />
                <DetailRow label="Oxygen saturation" value={workflow.examination.oxygenSaturation} />
                <DetailRow label="Heart rate" value={workflow.examination.heartRate} />
                <DetailRow label="Blood pressure" value={workflow.examination.bloodPressure} />
                <DetailRow label="Temperature" value={workflow.examination.temperature} />
                <DetailRow label="Respiratory examination" value={workflow.examination.respiratoryExam} />
                <DetailRow label="Cardiovascular examination" value={workflow.examination.cardiovascularExam} />
                <DetailRow label="Other findings" value={workflow.examination.otherFindings} />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-[12px] text-slate-400">No examination findings recorded.</div>
            )}
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Investigations</p>
            {workflow.investigations.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {workflow.investigations.map((item) => (
                  <div key={item.id} className="border-b border-slate-100 p-5 last:border-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-[13px] font-semibold text-slate-800">{item.name || "Unnamed investigation"}</p>
                      <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.06em] text-slate-400">{item.category}</span>
                    </div>
                    {item.rationale && <p className="mt-2 text-[12px] leading-[1.6] text-slate-400">{item.rationale}</p>}
                    {item.result && <p className="mt-3 rounded-xl bg-blue-50/60 px-3 py-2.5 text-[12px] leading-[1.6] text-blue-800">{item.result}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-[12px] text-slate-400">No investigations recorded.</div>
            )}
          </div>
        </div>
      </section>

      {selectedEntry && (
        <section className="app-section">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Interactive differential</p>
          <DiagnosisDetail entry={selectedEntry} rationale={caseRecord.rationale} />
        </section>
      )}

      {(caseRecord.dialogueHistory.trim() || caseRecord.ragContent.trim()) && (
        <section className="app-section">
          <div className="grid gap-6 md:grid-cols-2">
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
        </section>
      )}
    </div>
  );
}
