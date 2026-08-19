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
      className="reveal-section section-space border-t border-neutral-200 bg-white"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="mb-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <p className="reveal-item eyebrow mb-0">Diagnostic pipeline</p>
          <h2 className="reveal-item reveal-delay-1 section-title max-w-[850px]">
            A clear path from presentation to differential.
          </h2>
        </div>

        <div className="reveal-item reveal-delay-2 reveal-visual grid gap-x-8 gap-y-10 border-t border-neutral-300 pt-6 md:grid-cols-2 lg:grid-cols-5">
          {pipelineSteps.map((step, index) => (
            <div
              key={step.number}
              className={`pipeline-step min-h-[190px] py-4 lg:px-7 ${index === 0 ? "lg:pl-0" : "lg:border-l lg:border-neutral-200"}`}
            >
              <span className="font-mono text-[10px] text-neutral-400">{step.number}</span>
              <h3 className="mt-10 text-[15px] font-medium tracking-[-0.015em] text-neutral-950">
                {step.label}
              </h3>
              <p className="mt-3 text-[13px] leading-[1.7] text-neutral-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
