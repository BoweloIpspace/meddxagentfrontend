const steps = [
  {
    number: "01",
    title: "Patient",
    subtitle: "Initial Presentation",
    description:
      "The diagnostic process begins with the patient's initial presentation — symptoms, demographics, and chief complaint.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: "cyan",
    gradient: "from-cyan-400/20 to-cyan-500/5",
    borderColor: "border-cyan-500/20",
    dotColor: "bg-cyan-400",
    lineColor: "from-cyan-500",
  },
  {
    number: "02",
    title: "History Taking",
    subtitle: "Interactive Elicitation",
    description:
      "An AI-driven history-taking simulator asks targeted clinical questions to refine the patient profile iteratively.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "violet",
    gradient: "from-cyan-500/20 to-violet-500/5",
    borderColor: "border-violet-500/20",
    dotColor: "bg-violet-400",
    lineColor: "from-cyan-500 to-violet-500",
  },
  {
    number: "03",
    title: "Evidence Retrieval",
    subtitle: "PubMed & Knowledge Base",
    description:
      "A specialized retrieval agent searches PubMed, medical literature, and clinical knowledge bases for relevant evidence.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    color: "violet",
    gradient: "from-violet-400/20 to-violet-500/5",
    borderColor: "border-violet-500/20",
    dotColor: "bg-violet-500",
    lineColor: "from-violet-500",
  },
  {
    number: "04",
    title: "Diagnostic Reasoning",
    subtitle: "Multi-Agent Analysis",
    description:
      "A diagnosis strategy agent synthesizes patient data and retrieved evidence through structured multi-step reasoning.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="m6.41 6.41-2.83-2.83" />
        <path d="M2 12h4" />
        <path d="m6.41 17.59-2.83 2.83" />
        <path d="M12 18v4" />
        <path d="m17.59 17.59 2.83 2.83" />
        <path d="M18 12h4" />
        <path d="m17.59 6.41 2.83-2.83" />
      </svg>
    ),
    color: "rose",
    gradient: "from-violet-500/20 to-rose-500/5",
    borderColor: "border-rose-500/20",
    dotColor: "bg-rose-400",
    lineColor: "from-violet-500 to-rose-500",
  },
  {
    number: "05",
    title: "Differential Diagnosis",
    subtitle: "Ranked Output",
    description:
      "A ranked differential diagnosis with supporting evidence, confidence scores, and full explainability of the reasoning process.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    color: "amber",
    gradient: "from-rose-500/20 to-amber-500/5",
    borderColor: "border-amber-500/20",
    dotColor: "bg-amber-400",
    lineColor: "from-rose-500 to-amber-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 lg:py-36">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm text-cyan-400 font-medium uppercase tracking-widest mb-4">
            Diagnostic Pipeline
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            How <span className="gradient-text">MEDDxAgent</span> Works
          </h2>
          <p className="mt-5 text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            From initial patient presentation to ranked differential diagnosis
            — a modular, iterative pipeline designed for clinical AI research.
          </p>
        </div>

        {/* Pipeline */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-amber-500/30" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step) => (
              <div key={step.number} className="relative group">
                {/* Dot on the connecting line — desktop */}
                <div className="hidden lg:flex absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-5 h-5 rounded-full ${step.dotColor} ring-4 ring-slate-950 flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>

                {/* Card */}
                <div className={`relative mt-10 lg:mt-16 rounded-2xl glass-panel p-6 lg:p-5 hover:bg-white/[0.04] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/20`}>
                  {/* Gradient accent top */}
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${step.lineColor} opacity-40 rounded-full`} />

                  <div className="flex items-start gap-4 lg:flex-col lg:gap-0">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} border ${step.borderColor} flex items-center justify-center text-white shrink-0 lg:mb-4`}>
                      {step.icon}
                    </div>

                    <div className="flex-1">
                      <span className="text-xs font-mono text-slate-500 block mb-1">
                        {step.number}
                      </span>
                      <h3 className="text-lg font-semibold text-white mb-0.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">{step.subtitle}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
