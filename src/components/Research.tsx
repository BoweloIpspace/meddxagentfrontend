import { useScrollReveal } from "../hooks/useScrollReveal";

const researchPrinciples = [
  {
    title: "Reproducible inputs",
    description: "Evaluation starts from explicit patient context rather than presentation-only examples.",
  },
  {
    title: "Inspectable outputs",
    description: "Ranked differentials and supporting workflow artifacts can be reviewed independently of the interface.",
  },
  {
    title: "Evidence before claims",
    description: "Benchmark numbers belong in the product only when they are backed by recorded, reproducible experiment results.",
  },
];

export default function Research() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="research"
      className="reveal-section section-space border-t border-neutral-200 bg-white"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="grid items-start gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-28">
          <div className="reveal-item">
            <p className="eyebrow">Research</p>
            <h2 className="section-title max-w-[620px]">
              Evaluation without hard-coded performance claims.
            </h2>
            <p className="body-copy mt-7 max-w-[600px]">
              MEDDxAgent is a research-oriented diagnostic framework. The interface stays deliberately
              separate from benchmark claims until those results come from reproducible runs.
            </p>
          </div>

          <div className="reveal-item reveal-delay-2 border-t border-neutral-300">
            {researchPrinciples.map((item, index) => (
              <div key={item.title} className="grid gap-5 border-b border-neutral-200 py-8 sm:grid-cols-[48px_1fr]">
                <span className="font-mono text-[10px] text-neutral-400">0{index + 1}</span>
                <div>
                  <h3 className="text-[16px] font-medium tracking-[-0.015em] text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[580px] text-[13px] leading-[1.7] text-neutral-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
