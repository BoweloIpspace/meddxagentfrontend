import { useScrollReveal } from "../hooks/useScrollReveal";

const capabilities = [
  {
    title: "Differential Diagnosis",
    description:
      "Ranked diagnostic candidates with confidence scores, supporting evidence, and full transparency.",
  },
  {
    title: "Evidence Retrieval",
    description:
      "Automated PubMed and medical literature retrieval to support each diagnostic candidate.",
  },
  {
    title: "Interactive History-Taking",
    description:
      "Structured clinical questioning to iteratively refine the patient profile and diagnostic hypothesis.",
  },
  {
    title: "Benchmark Evaluation",
    description:
      "Comprehensive evaluation across dermatological, respiratory, and rare disease clinical datasets.",
  },
];

export default function Capabilities() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal-section section-space border-t border-neutral-100"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="max-w-[620px] mb-14 lg:mb-[76px]">
          <p className="reveal-item eyebrow">
            Capabilities
          </p>
          <h2 className="reveal-item reveal-delay-1 section-title">
            What MEDDxAgent does.
          </h2>
        </div>

        <div className="reveal-item reveal-delay-2 reveal-visual grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="bg-white p-8 lg:p-10 min-h-[190px]"
            >
              <h3 className="text-[16px] font-semibold text-neutral-900 mb-3 tracking-[-0.01em]">
                {cap.title}
              </h3>
              <p className="text-[14px] text-neutral-400 leading-[1.65]">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
