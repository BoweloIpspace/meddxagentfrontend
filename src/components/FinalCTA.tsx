import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function FinalCTA() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal-section py-32 sm:py-40 lg:py-52 border-t border-neutral-100"
      data-revealed={revealed}
    >
      <div className="site-container text-center">
        <h2 className="reveal-item text-[40px] sm:text-[52px] lg:text-[64px] font-semibold tracking-[-0.04em] leading-[1.0] text-neutral-900 mb-10">
          Explore MEDDxAgent.
        </h2>

        <div className="reveal-item reveal-delay-1 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <Link
            to="/app"
            className="button-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 text-white text-[15px] font-medium tracking-[-0.01em]"
          >
            Explore MEDDxAgent
          </Link>
          <a
            href="#research"
            className="secondary-link text-[15px] text-neutral-400"
          >
            View the research →
          </a>
        </div>
      </div>
    </section>
  );
}
