import { activities } from "../data/mockData";
import type { AgentStage } from "../types";

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

export default function Activity() {
  return (
    <div className="app-page max-w-[720px]">
      <div className="app-page-header">
        <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-4">
          Activity
        </h1>
        <p className="text-[15px] text-neutral-400 leading-[1.6] max-w-[520px]">
          Chronological trace of the diagnostic process. Every interaction, retrieval,
          and reasoning step is logged for transparency.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-neutral-100" />

        <div className="space-y-4">
          {activities.map((a) => (
            <div key={a.id} className="relative flex gap-5 py-8">
              {/* Dot */}
              <div className="relative z-10 shrink-0 mt-1">
                <div className={`w-[10px] h-[10px] rounded-full ${stageColors[a.stage]} ring-4 ring-white`} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[12px] font-mono text-neutral-300">{a.timestamp}</span>
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    {stageLabels[a.stage]}
                  </span>
                </div>
                <h3 className="text-[14px] font-medium text-neutral-900 mb-0.5">{a.title}</h3>
                <p className="text-[13px] text-neutral-400 leading-[1.5]">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
