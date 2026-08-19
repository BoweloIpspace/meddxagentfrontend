import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function FinalCTA() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal-section border-t border-neutral-200 py-32 sm:py-40 lg:py-48"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="reveal-item max-w-[920px] text-[44px] font-medium leading-[0.99] tracking-[-0.055em] text-neutral-950 sm:text-[58px] lg:text-[76px]">
            Build the case from what you know. Keep the output inspectable.
          </h2>

          <div className="reveal-item reveal-delay-1 flex flex-wrap items-center gap-x-6 gap-y-4 lg:pb-2">
            <Link
              to="/app"
              className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-white"
            >
              Open workspace
            </Link>
            <a href="#research" className="secondary-link text-[14px] font-medium">
              View research <span className="link-arrow">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
