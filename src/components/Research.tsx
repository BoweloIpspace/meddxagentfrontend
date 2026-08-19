import { useScrollReveal } from "../hooks/useScrollReveal";

const benchmarks = [
  {
    name: "DDxPlus",
    type: "Dermatological",
    accuracy: 84.2,
    patients: "1,683",
  },
  {
    name: "ICraftMD",
    type: "Clinical Vignettes",
    accuracy: 79.8,
    patients: "2,400",
  },
  {
    name: "RareBench",
    type: "Rare Diseases",
    accuracy: 71.5,
    patients: "892",
  },
];

const metrics = [
  { label: "Top-1 Accuracy", value: "84.2%" },
  { label: "Top-3 Accuracy", value: "93.7%" },
  { label: "F1 Score", value: "0.87" },
  { label: "Mean Reciprocal Rank", value: "0.91" },
];

export default function Research() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="research"
      className="reveal-section section-space border-t border-neutral-100"
      data-revealed={revealed}
    >
      <div className="site-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Text */}
          <div className="reveal-item">
            <p className="eyebrow">
              Research
            </p>
            <h2 className="section-title mb-6">
              Designed to evaluate differential diagnosis.
            </h2>
            <p className="body-copy max-w-[500px]">
              MEDDxAgent provides comprehensive benchmarks for evaluating AI
              systems on clinical differential diagnosis across multiple medical
              domains.
            </p>

            {/* Metrics */}
            <div className="mt-14 grid grid-cols-2 gap-10">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-[28px] lg:text-[32px] font-semibold text-neutral-900 tracking-[-0.02em]">
                    {m.value}
                  </div>
                  <div className="text-[13px] text-neutral-400 mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Benchmark cards */}
          <div className="reveal-item reveal-delay-2 reveal-visual space-y-px bg-neutral-200 rounded-lg overflow-hidden border border-neutral-200">
            {benchmarks.map((bench) => (
              <div key={bench.name} className="bg-white p-7 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[15px] font-semibold text-neutral-900">
                      {bench.name}
                    </h3>
                    <span className="text-[11px] text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-100">
                      {bench.type}
                    </span>
                  </div>
                  <span className="text-[14px] font-mono font-medium text-neutral-900">
                    {bench.accuracy}%
                  </span>
                </div>

                {/* Accuracy bar */}
                <div className="h-[3px] rounded-full bg-neutral-100 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-neutral-900"
                    style={{ width: `${bench.accuracy}%` }}
                  />
                </div>

                <span className="text-[12px] text-neutral-400">
                  {bench.patients} patients
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
