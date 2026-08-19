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
      className="reveal-section section-space border-t border-neutral-200 bg-white"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="mb-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <p className="reveal-item eyebrow mb-0">Capabilities</p>
          <h2 className="reveal-item reveal-delay-1 section-title max-w-[850px]">
            Focused tools for diagnostic research.
          </h2>
        </div>

        <div className="reveal-item reveal-delay-2 reveal-visual grid gap-8 border-t border-neutral-300 pt-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className={`min-h-[210px] py-4 lg:px-8 ${index === 0 ? "lg:pl-0" : "lg:border-l lg:border-neutral-200"}`}
            >
              <span className="font-mono text-[10px] text-neutral-400">0{index + 1}</span>
              <h3 className="mt-10 text-[16px] font-medium tracking-[-0.02em] text-neutral-950">
                {capability.title}
              </h3>
              <p className="mt-3 text-[13px] leading-[1.7] text-neutral-500">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
