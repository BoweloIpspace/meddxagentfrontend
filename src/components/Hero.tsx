import { Link } from "react-router-dom";

const previewRows = [
  { rank: "01", name: "Leading hypothesis", status: "Review" },
  { rank: "02", name: "Alternative hypothesis", status: "Evidence" },
  { rank: "03", name: "Additional consideration", status: "Monitor" },
];

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container">
        <div className="hero-grid">
          <div className="max-w-[760px]">
            <div className="hero-reveal motion-delay-1 hero-kicker">
              Evidence-assisted clinical research workspace
            </div>

            <h1 className="hero-heading-reveal motion-delay-1 text-[46px] sm:text-[58px] md:text-[68px] lg:text-[76px] font-semibold tracking-[-0.052em] leading-[0.99] text-slate-950">
              Differential diagnosis,
              <span className="block text-slate-400">with evidence in the loop.</span>
            </h1>

            <p className="hero-reveal motion-delay-2 mt-7 sm:mt-8 max-w-[600px] text-[17px] sm:text-[18px] leading-[1.72] text-slate-500">
              MEDDxAgent brings structured history-taking, evidence retrieval, and diagnostic
              reasoning into one focused workspace designed for research and clinical decision support.
            </p>

            <div className="hero-reveal motion-delay-3 mt-9 flex flex-wrap items-center gap-3">
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
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-[14px] font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-white hover:text-slate-950"
              >
                See how it works
              </a>
            </div>

            <div className="hero-reveal motion-delay-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-medium text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                Human review required
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                Research-oriented workflow
              </span>
            </div>
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
                  <span className="text-[10px] font-semibold tracking-[-0.01em] text-slate-500">
                    MEDDxAgent workspace
                  </span>
                </div>
                <span className="preview-status">Preview</span>
              </div>

              <div className="hero-preview-body">
                <aside className="hero-preview-sidebar">
                  <p className="preview-label">Case context</p>
                  <div className="preview-line w-[72%]" />
                  <div className="preview-line w-[54%]" />

                  <div className="mt-8">
                    <p className="preview-label">Signals</p>
                    <div className="mt-3 space-y-2.5">
                      {["Presenting history", "Clinical context", "New evidence"].map((item) => (
                        <div key={item} className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <span className="text-[9px] font-medium text-slate-500">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <p className="text-[9px] font-semibold text-blue-700">Evidence retrieval</p>
                    <p className="mt-1 text-[9px] leading-[1.45] text-blue-500">
                      Relevant context is surfaced alongside the evolving differential.
                    </p>
                  </div>
                </aside>

                <div className="hero-preview-content">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="preview-label">Differential workspace</p>
                      <p className="mt-2 text-[16px] font-semibold tracking-[-0.025em] text-slate-900">
                        Ranked diagnostic considerations
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                      Iterative
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-100 px-4">
                    {previewRows.map((row) => (
                      <div key={row.rank} className="preview-diagnosis-row">
                        <span className="preview-rank">{row.rank}</span>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-700">{row.name}</p>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-slate-300"
                              style={{ width: row.rank === "01" ? "82%" : row.rank === "02" ? "58%" : "39%" }}
                            />
                          </div>
                        </div>
                        <span className="preview-status">{row.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                      <p className="preview-label">History</p>
                      <p className="mt-2 text-[10px] font-medium text-slate-600">Targeted questioning</p>
                      <div className="preview-line mt-3 w-[85%]" />
                      <div className="preview-line w-[64%]" />
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                      <p className="preview-label">Evidence</p>
                      <p className="mt-2 text-[10px] font-medium text-slate-600">Retrieved context</p>
                      <div className="preview-line mt-3 w-[74%]" />
                      <div className="preview-line w-[90%]" />
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
