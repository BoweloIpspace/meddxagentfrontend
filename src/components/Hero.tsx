import { Link } from "react-router-dom";

const workflow = [
  { index: "01", label: "Patient context", detail: "Structured case input" },
  { index: "02", label: "History-taking", detail: "Targeted dialogue" },
  { index: "03", label: "Retrieval", detail: "Relevant context" },
  { index: "04", label: "Differential", detail: "Ranked engine output" },
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

            <h1 className="hero-heading-reveal motion-delay-1 text-[46px] font-semibold leading-[0.99] tracking-[-0.052em] text-slate-950 sm:text-[58px] md:text-[68px] lg:text-[76px]">
              Differential diagnosis,
              <span className="block text-slate-400">with evidence in the loop.</span>
            </h1>

            <p className="hero-reveal motion-delay-2 mt-8 max-w-[590px] text-[17px] leading-[1.72] text-slate-500 sm:text-[18px]">
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

          <div className="hero-reveal motion-delay-2 hero-preview" aria-label="MEDDxAgent workflow illustration">
            <div className="hero-preview-inner">
              <div className="hero-preview-topbar">
                <div className="flex items-center gap-3">
                  <div className="hero-preview-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    MEDDxAgent workspace
                  </span>
                </div>
                <span className="preview-status">Workflow</span>
              </div>

              <div className="hero-preview-body">
                <div className="hero-preview-content">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="preview-label">System flow</p>
                      <p className="mt-2 text-[16px] font-semibold tracking-[-0.025em] text-slate-900">
                        Input stays separate from engine output.
                      </p>
                      <p className="mt-1 max-w-[360px] text-[10px] leading-[1.55] text-slate-400">
                        The interface presents each stage without preloading patient data, diagnoses, or performance claims.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 border-y border-slate-100">
                    {workflow.map((step) => (
                      <div key={step.index} className="preview-diagnosis-row">
                        <span className="preview-rank">{step.index}</span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-700">{step.label}</p>
                          <p className="mt-1 text-[9px] text-slate-400">{step.detail}</p>
                        </div>
                        <span className="text-[9px] font-medium text-slate-300">Stage</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="preview-label">Frontend</p>
                      <p className="mt-2 text-[10px] font-medium text-slate-600">Real case input only</p>
                      <p className="mt-2 text-[9px] leading-[1.55] text-slate-400">
                        No seeded patient or diagnostic content.
                      </p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/55 p-4">
                      <p className="preview-label text-blue-500">Engine boundary</p>
                      <p className="mt-2 text-[10px] font-medium text-blue-700">Output appears when returned</p>
                      <p className="mt-2 text-[9px] leading-[1.55] text-blue-500">
                        Differential, rationale, dialogue, and retrieval content remain engine-owned.
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
