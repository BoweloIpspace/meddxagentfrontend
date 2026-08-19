import { Link } from "react-router-dom";

const workflow = [
  { index: "01", label: "Patient context", detail: "Structured case input" },
  { index: "02", label: "History-taking", detail: "Targeted dialogue" },
  { index: "03", label: "Evidence retrieval", detail: "Relevant context" },
  { index: "04", label: "Differential", detail: "Ranked engine output" },
];

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container">
        <div className="hero-grid">
          <div className="max-w-[820px]">
            <div className="hero-reveal motion-delay-1 hero-kicker">
              Clinical AI research workspace
            </div>

            <h1 className="hero-heading-reveal motion-delay-1 text-[50px] font-medium leading-[0.98] tracking-[-0.058em] text-neutral-950 sm:text-[64px] md:text-[78px] lg:text-[92px]">
              Evidence-assisted
              <span className="block text-neutral-500">differential diagnosis.</span>
            </h1>

            <p className="hero-reveal motion-delay-2 mt-9 max-w-[650px] text-[17px] leading-[1.7] text-neutral-600 sm:text-[19px]">
              MEDDxAgent brings patient context, history-taking, evidence retrieval, and diagnostic
              reasoning into one inspectable research workflow.
            </p>

            <div className="hero-reveal motion-delay-3 mt-11 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                to="/app"
                className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-white"
              >
                Open workspace
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="secondary-link text-[14px] font-medium"
              >
                See how it works
                <span className="link-arrow">↗</span>
              </a>
            </div>
          </div>

          <div className="hero-reveal motion-delay-2 self-end pb-2">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
              Workflow
            </p>
            <div className="hero-workflow">
              {workflow.map((step) => (
                <div key={step.index} className="hero-workflow-row">
                  <span className="hero-workflow-index">{step.index}</span>
                  <span className="hero-workflow-label">{step.label}</span>
                  <span className="hero-workflow-detail">{step.detail}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[440px] text-[11px] leading-[1.6] text-neutral-500">
              No sample patient data or diagnostic output is preloaded into the workspace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
