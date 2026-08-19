import { Link } from "react-router-dom";

const previewRows = [
  { rank: "01", name: "Leading hypothesis", detail: "Supported by current history", status: "Review" },
  { rank: "02", name: "Alternative hypothesis", detail: "Evidence still being weighed", status: "Evidence" },
  { rank: "03", name: "Additional consideration", detail: "Lower-priority consideration", status: "Monitor" },
];

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container">
        <div className="hero-grid">
          <div className="max-w-[720px]">
            <div className="hero-reveal motion-delay-1 hero-kicker">
              Evidence-assisted clinical research workspace
            </div>

            <h1 className="hero-heading-reveal motion-delay-1 text-[46px] sm:text-[58px] md:text-[68px] lg:text-[76px] font-semibold tracking-[-0.052em] leading-[0.99] text-slate-950">
              Differential diagnosis,
              <span className="block text-slate-400">with evidence in the loop.</span>
            </h1>

            <p className="hero-reveal motion-delay-2 mt-8 max-w-[590px] text-[17px] sm:text-[18px] leading-[1.72] text-slate-500">
              One focused workspace for structured history-taking, evidence retrieval, and iterative
              diagnostic reasoning—designed for research and clinical decision support.
            </p>

            <div className="hero-reveal motion-delay-3 mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/app"
                className="button-primary button-accent inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white"
              >
                Open workspace
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-[14px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
              >
                See the workflow
              </a>
            </div>

            <p className="hero-reveal motion-delay-3 mt-7 text-[11px] font-medium text-slate-400">
              Human review required · Research-oriented workflow
            </p>
          </div>

          <div className="hero-reveal motion-delay-2 hero-preview">
            <div className="hero-preview-inner">
              <div className="hero-preview-topbar">
                <div className="flex items-center gap-3">
                  <div className="hero-preview-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Current diagnosis
                  </span>
                </div>
                <span className="preview-status">Iteration 3</span>
              </div>

              <div className="hero-preview-body">
                <div className="hero-preview-content">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="preview-label">Case</p>
                      <p className="mt-2 text-[16px] font-semibold tracking-[-0.025em] text-slate-900">
                        Evolving differential
                      </p>
                      <p className="mt-1 text-[10px] leading-[1.5] text-slate-400">
                        History and retrieved evidence are reviewed together.
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                      In progress
                    </span>
                  </div>

                  <div className="mt-7 border-y border-slate-100">
                    {previewRows.map((row) => (
                      <div key={row.rank} className="preview-diagnosis-row">
                        <span className="preview-rank">{row.rank}</span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-700">{row.name}</p>
                          <p className="mt-1 text-[9px] text-slate-400">{row.detail}</p>
                        </div>
                        <span className="preview-status">{row.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="preview-label">History</p>
                      <p className="mt-2 text-[10px] font-medium text-slate-600">Targeted questioning</p>
                      <div className="preview-line mt-4 w-[78%]" />
                      <div className="preview-line w-[58%]" />
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/55 p-4">
                      <p className="preview-label text-blue-500">Evidence</p>
                      <p className="mt-2 text-[10px] font-medium text-blue-700">Relevant context surfaced</p>
                      <p className="mt-2 text-[9px] leading-[1.55] text-blue-500">
                        Retrieved evidence stays adjacent to the evolving diagnostic view.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
