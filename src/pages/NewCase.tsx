import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewCase() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [started, setStarted] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setStarted(true);
    setTimeout(() => {
      navigate("/app");
    }, 800);
  };

  const handleSaveDraft = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="app-page max-w-[900px]">
      <div className="app-page-header">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-blue-600">
          New case
        </p>
        <h1 className="text-[30px] sm:text-[34px] font-semibold tracking-[-0.04em] leading-[1.08] text-slate-950">
          Start a differential
        </h1>
        <p className="mt-3 max-w-[590px] text-[14px] leading-[1.7] text-slate-500">
          Enter the information currently available. MEDDxAgent will use it as the starting
          context for the diagnostic workflow.
        </p>
      </div>

      <form onSubmit={handleStart}>
        <section className="app-section">
          <div className="form-section-title">
            <div>
              <h2 className="text-[14px] font-semibold tracking-[-0.015em] text-slate-950">
                Patient information
              </h2>
              <p className="mt-1 text-[12px] text-slate-400">
                Core demographics and presenting complaint.
              </p>
            </div>
          </div>

          <div className="space-y-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="field-label">Patient ID</label>
                <input
                  type="text"
                  placeholder="PT-0000"
                  className="field-control font-mono placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="field-label">Age</label>
                <input
                  type="number"
                  placeholder="—"
                  min={0}
                  max={150}
                  className="field-control placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="field-label">Sex</label>
                <select className="field-control appearance-none">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Chief complaint</label>
              <input
                type="text"
                placeholder="e.g. Acute shortness of breath with worsening cough"
                className="field-control placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="field-label">Initial information</label>
              <textarea
                rows={4}
                placeholder="Presenting symptoms, vital signs, and initial observations..."
                className="field-control resize-none leading-[1.65] placeholder:text-slate-300"
              />
            </div>
          </div>
        </section>

        <section className="app-section">
          <div className="form-section-title">
            <div>
              <h2 className="text-[14px] font-semibold tracking-[-0.015em] text-slate-950">
                Additional context
              </h2>
              <p className="mt-1 text-[12px] text-slate-400">
                Optional information that may help refine the differential.
              </p>
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <label className="field-label">Medical history</label>
              <textarea
                rows={3}
                placeholder="Relevant past medical history..."
                className="field-control resize-none leading-[1.65] placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label">Current medications</label>
                <input
                  type="text"
                  placeholder="e.g. Metformin 500mg"
                  className="field-control placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="field-label">Known conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Type 2 diabetes"
                  className="field-control placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Relevant risk factors</label>
              <input
                type="text"
                placeholder="e.g. Family history, travel, occupational exposure"
                className="field-control placeholder:text-slate-300"
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button
            type="submit"
            disabled={started}
            className="button-primary button-accent inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[13px] font-semibold text-white disabled:cursor-wait disabled:opacity-70"
          >
            {started ? "Starting..." : "Start differential diagnosis"}
            {!started && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            {saved ? "Saved ✓" : "Save draft"}
          </button>
          <p className="w-full text-[10px] leading-[1.5] text-slate-300 sm:ml-auto sm:w-auto">
            Review entered information before starting.
          </p>
        </div>
      </form>
    </div>
  );
}
