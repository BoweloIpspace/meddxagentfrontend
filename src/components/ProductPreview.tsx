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
    description: "Relevant medical literature and knowledge are surfaced",
    number: "03",
  },
  {
    label: "Diagnostic reasoning",
    description: "Structured hypothesis refinement across iterations",
    number: "04",
  },
  {
    label: "Differential diagnosis",
    description: "A ranked diagnostic view is produced for review",
    number: "05",
  },
];

export default function ProductPreview() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="product"
      className="reveal-section section-space border-t border-slate-100 bg-white"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="mb-16 max-w-[620px] lg:mb-20">
          <p className="reveal-item eyebrow">Diagnostic pipeline</p>
          <h2 className="reveal-item reveal-delay-1 section-title">
            A clear path from presentation to differential.
          </h2>
        </div>

        <div className="reveal-item reveal-delay-2 reveal-visual grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-5">
          {pipelineSteps.map((step, index) => (
            <div key={step.number} className="pipeline-step border-t border-slate-200 pt-5">
              <div className="mb-7 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-slate-300">{step.number}</span>
                {index < pipelineSteps.length - 1 && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hidden text-slate-300 lg:block"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                )}
              </div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
                {step.label}
              </h3>
              <p className="mt-2 text-[12px] leading-[1.65] text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
