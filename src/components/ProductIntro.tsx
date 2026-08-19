import { useScrollReveal } from "../hooks/useScrollReveal";

export default function ProductIntro() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="reveal-section section-space border-t border-neutral-100"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-14 lg:gap-24">
          {/* Left: heading */}
          <div>
            <p className="reveal-item eyebrow">
              About the product
            </p>
            <h2 className="reveal-item reveal-delay-1 section-title max-w-[500px]">
              A research framework for differential diagnosis.
            </h2>
          </div>

          {/* Right: body text */}
          <div className="reveal-item reveal-delay-2 max-w-[590px] lg:pt-1">
            <div className="space-y-6">
              <p className="body-copy">
                MEDDxAgent combines interactive history-taking, retrieval-augmented
evidence from PubMed, and structured diagnostic reasoning — all within a
modular, explainable framework designed for clinical AI research.
              </p>
              <p className="body-copy">
                The system iteratively refines its diagnostic hypothesis through
                targeted clinical questions and evidence retrieval, producing a
                fully transparent, ranked differential diagnosis at each stage.
              </p>
              <p className="body-copy">
                Every step of the reasoning process is logged and explainable,
                making MEDDxAgent suitable for rigorous evaluation of AI-assisted
                clinical decision support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
