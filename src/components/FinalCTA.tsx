import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function FinalCTA() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal-section landing-final-cta"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="landing-final-cta-panel">
          <div className="reveal-item">
            <p className="eyebrow mb-5 text-neutral-500">Workspace</p>
            <h2 className="landing-final-cta-title">
              Start with the case. Keep the diagnostic process inspectable.
            </h2>
            <p className="landing-final-cta-copy">
              Create a structured patient case now. Diagnostic outputs remain separate until the MEDDxAgent engine is connected and run.
            </p>
          </div>

          <div className="landing-final-cta-actions reveal-item reveal-delay-1">
            <Link
              to="/app"
              className="marketing-cta px-6 py-3 text-[14px]"
            >
              Open workspace
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
            <a
              href="#research"
              className="marketing-secondary-action text-[13px]"
            >
              Review the research
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
