import { useState } from "react";
import { activeCase } from "../data/mockData";
import type { AgentStage } from "../types";

type Tab = "activity" | "history" | "evidence" | "strategy";

const stageLabels: Record<AgentStage, string> = {
  history_taking: "History Taking",
  knowledge_retrieval: "Knowledge Retrieval",
  diagnosis_strategy: "Diagnosis Strategy",
  complete: "Complete",
};

const stageColors: Record<AgentStage, string> = {
  history_taking: "bg-neutral-400",
  knowledge_retrieval: "bg-neutral-500",
  diagnosis_strategy: "bg-neutral-700",
  complete: "bg-neutral-900",
};

/* ── Left: Patient Profile ── */
function PatientPanel() {
  const { patient } = activeCase;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] font-mono text-neutral-300 mb-2">{patient.id}</p>
        <h2 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em]">
          {patient.age}y {patient.sex}
        </h2>
        <p className="text-[14px] text-neutral-500 mt-1 leading-[1.5]">
          {patient.chiefComplaint}
        </p>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Confirmed symptoms */}
      <div>
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          Confirmed symptoms
        </p>
        <ul className="space-y-3.5">
          {patient.confirmedSymptoms.map((s) => (
            <li key={s} className="text-[13px] text-neutral-600 flex items-start gap-2">
              <span className="text-neutral-300 mt-1.5 shrink-0">·</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Newly discovered */}
      {patient.newlyDiscovered.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
            Newly discovered
          </p>
          <ul className="space-y-3.5">
            {patient.newlyDiscovered.map((s) => (
              <li key={s} className="text-[13px] text-neutral-600 flex items-start gap-2">
                <span className="text-neutral-300 mt-1.5 shrink-0">·</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="h-px bg-neutral-100" />

      {/* Medical context */}
      <div className="space-y-6">
        {patient.medicalHistory && (
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              History
            </p>
            <p className="text-[13px] text-neutral-500 leading-[1.5]">{patient.medicalHistory}</p>
          </div>
        )}
        {patient.medications && (
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Medications
            </p>
            <p className="text-[13px] text-neutral-500 leading-[1.5]">{patient.medications}</p>
          </div>
        )}
        {patient.riskFactors && (
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Risk factors
            </p>
            <p className="text-[13px] text-neutral-500 leading-[1.5]">{patient.riskFactors}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Center: Activity Tabs ── */
function ActivityPanel({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const { activities, historyQuestions, evidence, evidenceSummary, iterations } = activeCase;
  const currentIteration = iterations[iterations.length - 1];

  const tabs: { id: Tab; label: string }[] = [
    { id: "activity", label: "Activity" },
    { id: "history", label: "History Taking" },
    { id: "evidence", label: "Evidence" },
    { id: "strategy", label: "Strategy" },
  ];

  return (
    <div className="flex flex-col min-h-0">
      {/* Tab bar */}
      <div className="flex gap-2 border-b border-neutral-100 mb-12">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "text-neutral-900 border-neutral-900"
                : "text-neutral-400 border-transparent hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "activity" && (
          <div className="space-y-1">
            {activities.map((a) => (
              <div key={a.id} className="flex gap-5 py-8 border-b border-neutral-50 last:border-0">
                <span className="text-[12px] font-mono text-neutral-300 shrink-0 pt-0.5 w-10">
                  {a.timestamp}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${stageColors[a.stage]}`} />
                    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                      {stageLabels[a.stage]}
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-neutral-900">{a.title}</p>
                  <p className="text-[13px] text-neutral-400 mt-0.5 leading-[1.5]">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-8">
            <p className="text-[13px] text-neutral-400 leading-[1.6]">
              To refine the differential, the engine gathers additional clinical information
              through targeted questioning.
            </p>
            <div className="space-y-8">
              {historyQuestions.map((hq, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-mono text-neutral-300 shrink-0 pt-1">{hq.timestamp}</span>
                    <div className="bg-neutral-50 rounded-lg px-4 py-3 flex-1">
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                        MEDDxAgent
                      </p>
                      <p className="text-[14px] text-neutral-700 leading-[1.5]">{hq.question}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] font-mono text-neutral-300 shrink-0 pt-1 w-10" />
                    <div className="bg-white border border-neutral-100 rounded-lg px-4 py-3 flex-1">
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                        Patient response
                      </p>
                      <p className="text-[14px] text-neutral-600 leading-[1.5]">{hq.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "evidence" && (
          <div className="space-y-10">
            {/* Search query */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Search
              </p>
              <p className="text-[14px] font-mono text-neutral-600 bg-neutral-50 rounded-lg px-4 py-3">
                acute shortness of breath + worsening cough + pleuritic chest pain
              </p>
            </div>

            {/* Sources */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Sources
              </p>            <div className="space-y-6">
              {evidence.map((e, i) => (
                  <div key={i} className="border border-neutral-100 rounded-lg p-7">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-neutral-900">{e.title}</span>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        e.relevance === "High"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}>
                        {e.relevance}
                      </span>
                    </div>
                    <p className="text-[12px] text-neutral-400 mb-1">{e.type}</p>
                    <p className="text-[13px] text-neutral-500 leading-[1.6]">{e.snippet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence summary */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Evidence summary
              </p>
              <p className="text-[14px] text-neutral-600 leading-[1.7] bg-neutral-50 rounded-lg p-5">
                {evidenceSummary}
              </p>
            </div>
          </div>
        )}

        {tab === "strategy" && currentIteration && (
          <div className="space-y-10">
            {/* Current iteration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Iteration {currentIteration.iteration}
                </p>
                <p className="text-[12px] font-mono text-neutral-300">{currentIteration.timestamp}</p>
              </div>

              <p className="text-[14px] text-neutral-600 leading-[1.7] mb-6">
                {currentIteration.evidenceSummary}
              </p>
            </div>

            {/* Changes from previous iteration */}
            {currentIteration.changes.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Changes from iteration {currentIteration.iteration - 1}
                </p>
                <div className="space-y-3">
                  {currentIteration.changes.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.direction === "up" ? "bg-neutral-900" :
                        c.direction === "down" ? "bg-neutral-300" : "bg-neutral-500"
                      }`} />
                      <span className="text-[14px] text-neutral-700 flex-1">{c.diagnosis}</span>
                      <span className="text-[13px] text-neutral-400">
                        {c.direction === "new" ? (
                          "New entry"
                        ) : (
                          <>
                            #{c.previousRank} → #{c.newRank}
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Iteration history */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Iteration history
              </p>
              <div className="space-y-4">
                {iterations.map((iter) => (
                  <div key={iter.iteration} className={`p-4 rounded-lg border ${
                    iter.iteration === currentIteration.iteration
                      ? "border-neutral-200 bg-neutral-50"
                      : "border-transparent"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-medium text-neutral-900">
                        Iteration {iter.iteration}
                      </span>
                      <span className="text-[12px] font-mono text-neutral-300">{iter.timestamp}</span>
                    </div>
                    <div className="space-y-1">
                      {iter.differential.slice(0, 3).map((d) => (
                        <div key={d.rank} className="flex items-center gap-2">
                          <span className="text-[12px] font-mono text-neutral-300 w-5">
                            {String(d.rank).padStart(2, "0")}
                          </span>
                          <span className="text-[13px] text-neutral-600">{d.diagnosis}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Right: Differential ── */
function DifferentialPanel() {
  const { differential, currentIteration, maxIterations } = activeCase;

  const confidenceColor = (c: string) => {
    switch (c) {
      case "High": return "text-neutral-900";
      case "Moderate": return "text-neutral-500";
      case "Low": return "text-neutral-300";
      default: return "text-neutral-400";
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          Differential
        </p>
        <p className="text-[12px] text-neutral-400">
          Iteration {currentIteration} of {maxIterations}
        </p>
      </div>

      <div className="space-y-1">
        {differential.map((d) => (
          <div key={d.rank} className="py-5 border-b border-neutral-50 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-mono text-neutral-300 w-5">
                  {String(d.rank).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-medium text-neutral-900">
                  {d.diagnosis}
                </span>
              </div>
              {d.change && (
                <span className={`text-[11px] ${
                  d.change.direction === "up" ? "text-neutral-900" :
                  d.change.direction === "new" ? "text-neutral-500" : "text-neutral-300"
                }`}>
                  {d.change.direction === "new" ? "New" : (
                    d.change.direction === "up" ? "↑" : "↓"
                  )}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 ml-8">
              <span className={`text-[12px] ${confidenceColor(d.confidence)}`}>
                {d.confidence}
              </span>
              {/* Confidence bar */}
              <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-400 rounded-full"
                  style={{
                    width: d.confidence === "High" ? "85%" : d.confidence === "Moderate" ? "55%" : "25%",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Iteration navigation */}
      <div className="pt-2">
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Iterations
        </p>
        <div className="flex gap-2">
          {Array.from({ length: maxIterations }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`w-8 h-8 rounded-md text-[12px] font-mono transition-colors ${
                i + 1 === currentIteration
                  ? "bg-neutral-900 text-white"
                  : i + 1 < currentIteration
                  ? "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  : "bg-neutral-50 text-neutral-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Active Case ── */
export default function ActiveCase() {
  const [tab, setTab] = useState<Tab>("activity");
  const [mobilePanel, setMobilePanel] = useState<"patient" | "activity" | "differential">("activity");

  return (
    <div className="app-page pt-8 lg:pt-14">
      {/* Case header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-neutral-900">
              Active diagnosis
            </h1>
            <span className="text-[11px] font-mono text-neutral-300">{activeCase.id}</span>
          </div>
          <p className="text-[13px] text-neutral-400">
            Iteration {activeCase.currentIteration} · {activeCase.patient.chiefComplaint}
          </p>
        </div>
      </div>

      {/* Mobile panel selector */}
      <div className="lg:hidden flex gap-2 mb-10 border-b border-neutral-100 pb-5">
        {(["patient", "activity", "differential"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setMobilePanel(p)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
              mobilePanel === p
                ? "text-neutral-900 bg-neutral-50"
                : "text-neutral-400"
            }`}
          >
            {p === "patient" ? "Patient" : p === "activity" ? "Activity" : "Differential"}
          </button>
        ))}
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 min-h-[calc(100vh-250px)]">
        {/* Left: Patient */}
        <aside className={`lg:w-[340px] shrink-0 lg:border-r lg:border-neutral-100 lg:pr-16 ${
          mobilePanel !== "patient" ? "hidden lg:block" : ""
        }`}>
          <PatientPanel />
        </aside>

        {/* Center: Activity */}
        <div className={`flex-1 min-w-0 ${
          mobilePanel !== "activity" ? "hidden lg:block" : ""
        }`}>
          <ActivityPanel tab={tab} setTab={setTab} />
        </div>

        {/* Right: Differential */}
        <aside className={`lg:w-[360px] shrink-0 lg:border-l lg:border-neutral-100 lg:pl-16 ${
          mobilePanel !== "differential" ? "hidden lg:block" : ""
        }`}>
          <DifferentialPanel />
        </aside>
      </div>
    </div>
  );
}
