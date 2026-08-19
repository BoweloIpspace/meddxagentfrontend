import { useScrollReveal } from "../hooks/useScrollReveal";

const capabilities = [
  {
    title: "Differential Diagnosis",
    description:
      "Ranked diagnostic candidates with supporting context and a transparent iteration history.",
  },
  {
    title: "Evidence Retrieval",
    description:
      "Relevant literature and knowledge are surfaced alongside the evolving diagnostic view.",
  },
  {
    title: "Interactive History-Taking",
    description:
      "Structured clinical questioning helps refine the patient profile across the workflow.",
  },
  {
    title: "Benchmark Evaluation",
    description:
      "Research workflows can be inspected across supported clinical evaluation datasets.",
  },
];

export default function Capabilities() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal-section section-space border-t border-slate-100 bg-slate-50/45"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="mb-16 max-w-[620px] lg:mb-20">
          <p className="reveal-item eyebrow">Capabilities</p>
          <h2 className="reveal-item reveal-delay-1 section-title">
            Focused tools for diagnostic research.
          </h2>
        </div>

        <div className="reveal-item reveal-delay-2 reveal-visual grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className={`min-h-[180px] py-2 lg:px-8 ${index === 0 ? "lg:pl-0" : "lg:border-l lg:border-slate-200"}`}
            >
              <span className="text-[10px] font-mono text-slate-300">0{index + 1}</span>
              <h3 className="mt-8 text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
                {capability.title}
              </h3>
              <p className="mt-3 text-[13px] leading-[1.7] text-slate-400">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
