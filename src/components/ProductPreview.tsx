import { useScrollReveal } from "../hooks/useScrollReveal";

const pipelineSteps = [
  {
    label: "Patient presentation",
    description: "Initial symptoms, demographics, and chief complaint",
    number: "01",
  },
  {
    label: "History taking",
    description: "Interactive elicitation through targeted clinical questions",
    number: "02",
  },
  {
    label: "Evidence retrieval",
    description: "Automated search of PubMed and medical literature",
    number: "03",
  },
  {
    label: "Diagnostic reasoning",
    description: "Structured multi-step reasoning and hypothesis refinement",
    number: "04",
  },
  {
    label: "Differential diagnosis",
    description: "Ranked diagnostic output with confidence and evidence",
    number: "05",
  },
];

export default function ProductPreview() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="product"
      className="reveal-section section-space border-t border-neutral-100"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="max-w-[620px] mb-14 lg:mb-[76px]">
          <p className="reveal-item eyebrow">
            Diagnostic pipeline
          </p>
          <h2 className="reveal-item reveal-delay-1 section-title">
            From presentation to differential.
          </h2>
        </div>

        {/* Pipeline visual */}
        <div className="reveal-item reveal-delay-2 reveal-visual border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50/60">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            {pipelineSteps.map((step, i) => (
              <div
                key={step.number}
                className={`pipeline-step reveal-item relative min-h-[180px] p-7 lg:min-h-[210px] lg:p-8 ${
                  i === 0 ? "" : `reveal-delay-${i}`
                }`}
              >
                <span className="text-[11px] font-mono text-neutral-300 block mb-5">
                  {step.number}
                </span>
                <h3 className="text-[15px] font-semibold text-neutral-900 mb-2 tracking-[-0.01em] leading-snug">
                  {step.label}
                </h3>
                <p className="text-[13px] text-neutral-400 leading-[1.6]">
                  {step.description}
                </p>

                {/* Arrow between steps on desktop */}
                {i < pipelineSteps.length - 1 && (
                  <div className="pipeline-arrow hidden lg:block absolute top-1/2 -right-[7px] z-10">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-300"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
