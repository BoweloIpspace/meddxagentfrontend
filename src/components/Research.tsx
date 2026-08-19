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
      className="reveal-section section-space border-t border-slate-100"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="reveal-item">
            <p className="eyebrow">Research</p>
            <h2 className="section-title max-w-[560px]">
              Evaluation without hard-coded performance claims.
            </h2>
            <p className="body-copy mt-6 max-w-[560px]">
              MEDDxAgent is a research-oriented diagnostic framework. The interface stays deliberately
              separate from benchmark claims until those results come from reproducible runs.
            </p>
          </div>

          <div className="reveal-item reveal-delay-2 border-t border-slate-200">
            {researchPrinciples.map((item, index) => (
              <div key={item.title} className="grid gap-4 border-b border-slate-100 py-7 sm:grid-cols-[44px_1fr]">
                <span className="font-mono text-[11px] text-slate-300">0{index + 1}</span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[560px] text-[13px] leading-[1.7] text-slate-400">
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
