import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="pt-28 pb-36 sm:pt-32 sm:pb-44 lg:pt-36 lg:pb-48">
      <div className="site-container">
        <div className="max-w-[1020px]">
          <h1
            className="hero-heading-reveal motion-delay-1 text-[44px] sm:text-[56px] md:text-[66px] lg:text-[78px] xl:text-[84px] font-semibold tracking-[-0.04em] leading-[1.02] text-neutral-900"
          >
            Evidence-assisted
            <br className="hidden sm:block" />
            differential diagnosis.
          </h1>

          <p
            className="hero-reveal motion-delay-2 mt-8 sm:mt-10 text-[17px] sm:text-[18px] text-neutral-500 leading-[1.7] max-w-[520px]"
          >
            MEDDxAgent is an AI-assisted framework for interactive differential
            diagnosis, combining structured history-taking, evidence retrieval,
            and diagnostic reasoning.
          </p>

          <div
            className="hero-reveal motion-delay-3 mt-10 sm:mt-12 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            <Link
              to="/app"
              className="button-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neutral-900 text-white text-[15px] font-medium tracking-[-0.01em]"
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
      </div>
    </section>
  );
}
