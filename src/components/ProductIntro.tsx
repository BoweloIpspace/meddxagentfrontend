import { useScrollReveal } from "../hooks/useScrollReveal";

export default function ProductIntro() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="reveal-section section-space border-t border-neutral-200 bg-white"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-28">
          <div>
            <p className="reveal-item eyebrow">About the product</p>
            <h2 className="reveal-item reveal-delay-1 section-title max-w-[620px]">
              A research framework for differential diagnosis.
            </h2>
          </div>

          <div className="reveal-item reveal-delay-2 max-w-[660px] lg:pt-1">
            <div className="space-y-7">
              <p className="body-copy">
                MEDDxAgent brings history-taking, retrieval, and diagnostic reasoning into a modular
                workflow built for clinical AI research.
              </p>
              <p className="body-copy">
                The interface keeps patient input separate from engine output, then presents ranked
                differentials and supporting artifacts only when the diagnostic workflow returns them.
              </p>
              <p className="body-copy">
                The goal is inspectable research behavior rather than presentation-only certainty:
                no fabricated confidence scores, benchmark claims, evidence, or patient history are added by the frontend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
