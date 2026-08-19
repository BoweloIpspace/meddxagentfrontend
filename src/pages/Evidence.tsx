import { evidenceSources, evidenceSummary } from "../data/mockData";

export default function Evidence() {
  return (
    <div className="app-page max-w-[800px]">
      <div className="app-page-header">
        <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-4">
          Evidence
        </h1>
        <p className="text-[15px] text-neutral-400 leading-[1.6] max-w-[520px]">
          Retrieved clinical evidence from PubMed, medical literature, and knowledge bases
          supporting the current differential.
        </p>
      </div>

      {/* Search query */}
      <div className="mb-16">
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Search query
        </p>
        <p className="text-[14px] font-mono text-neutral-600 bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-100">
          acute shortness of breath + worsening cough + pleuritic chest pain
        </p>
      </div>

      {/* Sources */}
      <div className="mb-20">
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          Sources ({evidenceSources.length})
        </p>
        <div className="space-y-6">
          {evidenceSources.map((e, i) => (
            <div key={i} className="border border-neutral-100 rounded-lg p-8 hover:border-neutral-200 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <span className="text-[12px] text-neutral-400 block mb-1">{e.type}</span>
                  <h3 className="text-[15px] font-medium text-neutral-900 leading-snug">
                    {e.title}
                  </h3>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                  e.relevance === "High"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500"
                }`}>
                  {e.relevance}
                </span>
              </div>
              <p className="text-[14px] text-neutral-500 leading-[1.65]">
                {e.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence summary */}
      <div>
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Evidence summary
        </p>
        <div className="bg-neutral-50 rounded-lg p-8 border border-neutral-100">
          <p className="text-[15px] text-neutral-600 leading-[1.75]">
            {evidenceSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
