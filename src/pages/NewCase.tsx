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
    <div className="app-page max-w-[760px]">
      {/* Header */}
      <div className="app-page-header">
        <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-4">
          New case
        </h1>
        <p className="text-[15px] text-neutral-400 leading-[1.6] max-w-[520px]">
          Begin with the information currently available. MEDDxAgent will iteratively
          gather evidence and refine the differential.
        </p>
      </div>

      <form onSubmit={handleStart}>
        {/* Patient Information */}
        <div className="app-section">
          <h2 className="text-[14px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
            Patient information
          </h2>
          <p className="text-[13px] text-neutral-400 mb-6">
            Core demographics and presenting complaint.
          </p>

          <div className="space-y-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                  Patient ID
                </label>
                <input
                  type="text"
                  placeholder="PT-0000"
                  className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="—"
                  min={0}
                  max={150}
                  className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                  Sex
                </label>
                <select className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors appearance-none">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                Chief complaint
              </label>
              <input
                type="text"
                placeholder="e.g. Acute shortness of breath with worsening cough"
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                Initial information
              </label>
              <textarea
                rows={3}
                placeholder="Presenting symptoms, vital signs, and initial observations..."
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors resize-none leading-[1.6]"
              />
            </div>
          </div>
        </div>

        {/* Optional context */}
        <div className="app-section">
          <h2 className="text-[14px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
            Additional context
          </h2>
          <p className="text-[13px] text-neutral-400 mb-6">
            Optional — provide if available.
          </p>

          <div className="space-y-7">
            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                Medical history
              </label>
              <textarea
                rows={2}
                placeholder="Relevant past medical history..."
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors resize-none leading-[1.6]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                Current medications
              </label>
              <input
                type="text"
                placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                Known conditions
              </label>
              <input
                type="text"
                placeholder="e.g. Type 2 diabetes, Hypertension"
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-2">
                Relevant risk factors
              </label>
              <input
                type="text"
                placeholder="e.g. Family history, travel, occupational exposure"
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-5 pt-10">
          <button
            type="submit"
            className="button-primary px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-[14px] font-medium"
          >
            {started ? "Starting..." : "Start differential diagnosis"}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 rounded-lg border border-neutral-200 text-[14px] font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
          >
            {saved ? "Saved ✓" : "Save draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
