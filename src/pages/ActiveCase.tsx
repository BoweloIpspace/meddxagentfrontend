import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { activeCase, caseHistory } from "../data/mockData";
import type { AgentStage, Case } from "../types";

type Tab = "activity" | "history" | "evidence" | "strategy";

const stageLabels: Record<AgentStage, string> = {
  history_taking: "History Taking",
  knowledge_retrieval: "Knowledge Retrieval",
  diagnosis_strategy: "Diagnosis Strategy",
  complete: "Complete",
};

const stageColors: Record<AgentStage, string> = {
  history_taking: "bg-slate-300",
  knowledge_retrieval: "bg-blue-400",
  diagnosis_strategy: "bg-slate-600",
  complete: "bg-slate-900",
};

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-[12px] leading-[1.6] text-slate-400">
      {children}
    </div>
  );
}

function PatientPanel({ caseData }: { caseData: Case }) {
  const { patient } = caseData;

  return (
    <div className="space-y-9">
      <div>
        <p className="text-[11px] font-mono text-slate-300 mb-2">{patient.id}</p>
        <h2 className="text-[17px] font-semibold text-slate-900 tracking-[-0.01em]">
          {patient.age}y {patient.sex}
        </h2>
        <p className="text-[13px] text-slate-500 mt-1 leading-[1.55]">
          {patient.chiefComplaint}
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-4">
          Confirmed symptoms
        </p>
        {patient.confirmedSymptoms.length > 0 ? (
          <ul className="space-y-3">
            {patient.confirmedSymptoms.map((symptom) => (
              <li key={symptom} className="text-[13px] text-slate-600 flex items-start gap-2.5">
                <span className="mt-[7px] h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                {symptom}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-slate-400">No confirmed symptoms recorded.</p>
        )}
      </div>

      {patient.newlyDiscovered.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-4">
            Newly discovered
          </p>
          <ul className="space-y-3">
            {patient.newlyDiscovered.map((item) => (
              <li key={item} className="text-[13px] text-slate-600 flex items-start gap-2.5">
                <span className="mt-[7px] h-1 w-1 rounded-full bg-blue-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="h-px bg-slate-100" />

      <div className="space-y-5">
        {patient.medicalHistory && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-1">History</p>
            <p className="text-[13px] text-slate-500 leading-[1.55]">{patient.medicalHistory}</p>
          </div>
        )}
        {patient.medications && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-1">Medications</p>
            <p className="text-[13px] text-slate-500 leading-[1.55]">{patient.medications}</p>
          </div>
        )}
        {patient.riskFactors && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-1">Risk factors</p>
            <p className="text-[13px] text-slate-500 leading-[1.55]">{patient.riskFactors}</p>
          </div>
        )}
        {!patient.medicalHistory && !patient.medications && !patient.riskFactors && (
          <p className="text-[12px] text-slate-400">No additional clinical context recorded.</p>
        )}
      </div>
    </div>
  );
}

function ActivityPanel({
  caseData,
  tab,
  setTab,
  selectedIteration,
  onSelectIteration,
}: {
  caseData: Case;
  tab: Tab;
  setTab: (tab: Tab) => void;
  selectedIteration: number;
  onSelectIteration: (iteration: number) => void;
}) {
  const iteration = caseData.iterations.find((item) => item.iteration === selectedIteration);

  const tabs: { id: Tab; label: string }[] = [
    { id: "activity", label: "Activity" },
    { id: "history", label: "History" },
    { id: "evidence", label: "Evidence" },
    { id: "strategy", label: "Strategy" },
  ];

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-9 flex gap-1 border-b border-slate-100 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-[12px] font-medium transition-colors ${
              tab === item.id
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {tab === "activity" && (
          caseData.activities.length > 0 ? (
            <div>
              {caseData.activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 border-b border-slate-50 py-5 last:border-0">
                  <span className="w-10 shrink-0 pt-0.5 text-[11px] font-mono text-slate-300">
                    {activity.timestamp}
                  </span>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${stageColors[activity.stage]}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        {stageLabels[activity.stage]}
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-slate-900">{activity.title}</p>
                    <p className="mt-0.5 text-[12px] leading-[1.55] text-slate-400">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>No activity has been recorded for this case in the frontend demo.</EmptyState>
          )
        )}

        {tab === "history" && (
          caseData.historyQuestions.length > 0 ? (
            <div className="space-y-6">
              <p className="max-w-[620px] text-[13px] leading-[1.65] text-slate-400">
                Targeted questions used to refine the patient profile and evolving differential.
              </p>
              {caseData.historyQuestions.map((question, index) => (
                <div key={index} className="border-b border-slate-100 pb-6 last:border-0">
                  <div className="flex items-start gap-3">
                    <span className="w-10 shrink-0 pt-1 text-[10px] font-mono text-slate-300">{question.timestamp}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-500">MEDDxAgent</p>
                      <p className="mt-1.5 text-[13px] leading-[1.6] text-slate-700">{question.question}</p>
                      <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Patient response</p>
                        <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">{question.response}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>No structured history questions are available for this case in the demo.</EmptyState>
          )
        )}

        {tab === "evidence" && (
          caseData.evidence.length > 0 ? (
            <div className="space-y-8">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Sources</p>
                <div className="divide-y divide-slate-100 border-y border-slate-100">
                  {caseData.evidence.map((source, index) => (
                    <div key={index} className="py-5">
                      <div className="mb-1.5 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[13px] font-medium text-slate-900">{source.title}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{source.type}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          source.relevance === "High"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {source.relevance}
                        </span>
                      </div>
                      <p className="text-[12px] leading-[1.6] text-slate-500">{source.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>

              {caseData.evidenceSummary && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Evidence summary</p>
                  <p className="rounded-xl bg-blue-50/50 p-4 text-[13px] leading-[1.7] text-slate-600">
                    {caseData.evidenceSummary}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <EmptyState>No retrieved evidence is available for this case in the demo.</EmptyState>
          )
        )}

        {tab === "strategy" && (
          iteration ? (
            <div className="space-y-8">
              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    Iteration {iteration.iteration}
                  </p>
                  <p className="text-[11px] font-mono text-slate-300">{iteration.timestamp}</p>
                </div>
                <p className="text-[13px] leading-[1.7] text-slate-600">{iteration.evidenceSummary}</p>
              </div>

              {iteration.changes.length > 0 && (
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Changes</p>
                  <div className="divide-y divide-slate-100 border-y border-slate-100">
                    {iteration.changes.map((change, index) => (
                      <div key={index} className="flex items-center gap-3 py-3">
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          change.direction === "up"
                            ? "bg-blue-500"
                            : change.direction === "down"
                            ? "bg-slate-300"
                            : "bg-slate-500"
                        }`} />
                        <span className="flex-1 text-[13px] text-slate-700">{change.diagnosis}</span>
                        <span className="text-[11px] text-slate-400">
                          {change.direction === "new" ? "New" : `#${change.previousRank} → #${change.newRank}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Iteration history</p>
                <div className="flex flex-wrap gap-2">
                  {caseData.iterations.map((item) => (
                    <button
                      key={item.iteration}
                      type="button"
                      onClick={() => onSelectIteration(item.iteration)}
                      className={`rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors ${
                        item.iteration === selectedIteration
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      Iteration {item.iteration}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState>Iteration-level strategy data is not available for this case in the demo.</EmptyState>
          )
        )}
      </div>
    </div>
  );
}

function DifferentialPanel({
  caseData,
  selectedIteration,
  onSelectIteration,
}: {
  caseData: Case;
  selectedIteration: number;
  onSelectIteration: (iteration: number) => void;
}) {
  const iteration = caseData.iterations.find((item) => item.iteration === selectedIteration);
  const differential = iteration?.differential ?? caseData.differential;
  const availableIterations = new Set(caseData.iterations.map((item) => item.iteration));
  if (caseData.iterations.length === 0) availableIterations.add(caseData.currentIteration);

  const confidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High":
        return "text-blue-700";
      case "Moderate":
        return "text-slate-500";
      case "Low":
        return "text-slate-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Differential</p>
        <p className="mt-1 text-[12px] text-slate-400">
          Viewing iteration {selectedIteration} of {caseData.currentIteration}
        </p>
      </div>

      {differential.length > 0 ? (
        <div>
          {differential.map((entry) => (
            <div key={`${selectedIteration}-${entry.rank}`} className="border-b border-slate-100 py-4 last:border-0">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 shrink-0 text-[11px] font-mono text-slate-300">
                  {String(entry.rank).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[13px] font-medium leading-[1.45] text-slate-900">
                      {entry.diagnosis}
                    </span>
                    {entry.change && (
                      <span className="text-[10px] text-slate-400">
                        {entry.change.direction === "new" ? "New" : entry.change.direction === "up" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className={`text-[11px] ${confidenceColor(entry.confidence)}`}>{entry.confidence}</span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-400"
                        style={{
                          width:
                            entry.confidence === "High"
                              ? "85%"
                              : entry.confidence === "Moderate"
                              ? "55%"
                              : "25%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>No differential has been recorded for this case.</EmptyState>
      )}

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Iterations</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: caseData.maxIterations }, (_, index) => {
            const iterationNumber = index + 1;
            const available = availableIterations.has(iterationNumber);
            return (
              <button
                key={iterationNumber}
                type="button"
                disabled={!available}
                onClick={() => available && onSelectIteration(iterationNumber)}
                aria-label={`View iteration ${iterationNumber}`}
                className={`grid h-8 w-8 place-items-center rounded-lg border text-[11px] font-mono transition-colors ${
                  iterationNumber === selectedIteration
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : available
                    ? "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                }`}
              >
                {iterationNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ActiveCase() {
  const { id } = useParams();
  const caseData = useMemo(
    () => (id ? caseHistory.find((item) => item.id === id) ?? activeCase : activeCase),
    [id]
  );

  const [tab, setTab] = useState<Tab>("activity");
  const [mobilePanel, setMobilePanel] = useState<"patient" | "activity" | "differential">("activity");
  const [selectedIteration, setSelectedIteration] = useState(caseData.currentIteration);

  useEffect(() => {
    setSelectedIteration(caseData.currentIteration);
    setTab("activity");
  }, [caseData]);

  return (
    <div className="app-page">
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-slate-950">
              {caseData.status === "active" ? "Active diagnosis" : "Case review"}
            </h1>
            <span className="text-[10px] font-mono text-slate-300">{caseData.id}</span>
          </div>
          <p className="text-[13px] leading-[1.55] text-slate-400">
            Iteration {selectedIteration} · {caseData.patient.chiefComplaint}
          </p>
        </div>
        <span className={`hidden rounded-full px-3 py-1.5 text-[10px] font-semibold sm:inline-flex ${
          caseData.status === "active"
            ? "bg-blue-50 text-blue-700"
            : caseData.status === "completed"
            ? "bg-slate-100 text-slate-600"
            : "border border-slate-200 bg-white text-slate-500"
        }`}>
          {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
        </span>
      </div>

      <div className="lg:hidden mb-8 flex gap-1 border-b border-slate-100 pb-3">
        {(["patient", "activity", "differential"] as const).map((panel) => (
          <button
            key={panel}
            type="button"
            onClick={() => setMobilePanel(panel)}
            className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${
              mobilePanel === panel ? "bg-blue-50 text-blue-700" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {panel === "patient" ? "Patient" : panel === "activity" ? "Activity" : "Differential"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:gap-8 xl:grid-cols-[260px_minmax(0,1fr)_320px] xl:gap-12">
        <aside
          className={`lg:border-r lg:border-slate-100 lg:pr-7 xl:pr-9 ${
            mobilePanel !== "patient" ? "hidden lg:block" : ""
          }`}
        >
          <PatientPanel caseData={caseData} />
        </aside>

        <div className={`min-w-0 ${mobilePanel !== "activity" ? "hidden lg:block" : ""}`}>
          <ActivityPanel
            caseData={caseData}
            tab={tab}
            setTab={setTab}
            selectedIteration={selectedIteration}
            onSelectIteration={setSelectedIteration}
          />
        </div>

        <aside
          className={`lg:border-l lg:border-slate-100 lg:pl-7 xl:pl-9 ${
            mobilePanel !== "differential" ? "hidden lg:block" : ""
          }`}
        >
          <DifferentialPanel
            caseData={caseData}
            selectedIteration={selectedIteration}
            onSelectIteration={setSelectedIteration}
          />
        </aside>
      </div>
    </div>
  );
}
