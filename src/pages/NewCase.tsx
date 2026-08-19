import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { caseToInput, getCase, saveCaseInput } from "../data/caseStore";
import type { CaseInput } from "../types";

const emptyCaseInput: CaseInput = {
  patientId: "",
  age: "",
  sex: "",
  chiefComplaint: "",
  initialInformation: "",
  medicalHistory: "",
  medications: "",
  knownConditions: "",
  riskFactors: "",
};

export default function NewCase() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const existingCase = id ? getCase(id) : undefined;
  const [recordId, setRecordId] = useState(id);
  const [form, setForm] = useState<CaseInput>(() =>
    existingCase ? caseToInput(existingCase) : emptyCaseInput
  );
  const [saved, setSaved] = useState(false);

  if (id && !existingCase) {
    return (
      <div className="app-page max-w-[760px]">
        <div className="border-t border-neutral-300 py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">Case unavailable</p>
          <h1 className="mt-5 max-w-[640px] text-[34px] font-medium leading-[1.06] tracking-[-0.045em] text-neutral-950">
            This case cannot be edited because it is not in the local workspace.
          </h1>
          <p className="mt-4 max-w-[520px] text-[14px] leading-[1.7] text-neutral-600">
            The case may have been cleared from this browser or created on another device.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/cases" className="button-primary rounded-full px-4 py-2.5 text-[13px] font-medium text-white">
              View cases
            </Link>
            <Link to="/cases/new" className="text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-950">
              New case →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const updateField = <K extends keyof CaseInput>(key: K, value: CaseInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const savedCase = saveCaseInput(form, "ready", recordId);
    navigate(`/case/${savedCase.id}`);
  };

  const handleSaveDraft = () => {
    const savedCase = saveCaseInput(form, "draft", recordId);
    setRecordId(savedCase.id);
    setSaved(true);
    navigate(`/case/${savedCase.id}/edit`, { replace: true });
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="app-page max-w-[980px]">
      <div className="app-page-header grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
            {existingCase || recordId ? "Edit case" : "New case"}
          </p>
          <h1 className="max-w-[760px] text-[38px] font-medium leading-[1.03] tracking-[-0.05em] text-neutral-950 sm:text-[48px]">
            {existingCase || recordId ? "Update patient context" : "Create a patient case"}
          </h1>
          <p className="mt-5 max-w-[650px] text-[14px] leading-[1.7] text-neutral-600">
            Enter only information that is actually available. The case is stored locally and no
            diagnostic result is generated or implied from this form.
          </p>
        </div>
        <span className="hidden rounded-full border border-neutral-300 px-3 py-1.5 text-[10px] font-medium text-neutral-600 sm:inline-flex">
          Local workspace
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <section className="app-section border-t border-neutral-300 pt-10">
          <div className="form-section-title">
            <div className="flex items-start gap-4">
              <span className="form-section-index">01</span>
              <div>
                <h2 className="text-[15px] font-medium tracking-[-0.015em] text-neutral-950">
                  Required case context
                </h2>
                <p className="mt-1.5 text-[12px] text-neutral-500">
                  These fields are required before the case can be marked ready.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="patient-id" className="field-label">Patient ID</label>
                <input
                  id="patient-id"
                  type="text"
                  value={form.patientId}
                  onChange={(event) => updateField("patientId", event.target.value)}
                  placeholder="Institution or study ID"
                  required
                  className="field-control font-mono placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label htmlFor="patient-age" className="field-label">Age</label>
                <input
                  id="patient-age"
                  type="number"
                  value={form.age}
                  onChange={(event) => updateField("age", event.target.value)}
                  placeholder="Age"
                  min={0}
                  max={150}
                  required
                  className="field-control placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label htmlFor="patient-sex" className="field-label">Sex</label>
                <select
                  id="patient-sex"
                  value={form.sex}
                  onChange={(event) => updateField("sex", event.target.value as CaseInput["sex"])}
                  required
                  className="field-control appearance-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="chief-complaint" className="field-label">Chief complaint</label>
              <input
                id="chief-complaint"
                type="text"
                value={form.chiefComplaint}
                onChange={(event) => updateField("chiefComplaint", event.target.value)}
                placeholder="Primary reason for presentation"
                required
                className="field-control placeholder:text-neutral-400"
              />
            </div>

            <div>
              <label htmlFor="initial-information" className="field-label">Initial information</label>
              <textarea
                id="initial-information"
                rows={6}
                value={form.initialInformation}
                onChange={(event) => updateField("initialInformation", event.target.value)}
                placeholder="Presenting symptoms, relevant observations, vital signs, investigations, and other known context"
                required
                className="field-control resize-none leading-[1.65] placeholder:text-neutral-400"
              />
            </div>
          </div>
        </section>

        <section className="app-section">
          <div className="form-section-title">
            <div className="flex items-start gap-4">
              <span className="form-section-index">02</span>
              <div>
                <h2 className="text-[15px] font-medium tracking-[-0.015em] text-neutral-950">
                  Additional context
                </h2>
                <p className="mt-1.5 text-[12px] text-neutral-500">
                  Optional information that can be passed to the diagnostic workflow later.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <label htmlFor="medical-history" className="field-label">Medical history</label>
              <textarea
                id="medical-history"
                rows={4}
                value={form.medicalHistory}
                onChange={(event) => updateField("medicalHistory", event.target.value)}
                placeholder="Relevant past medical history"
                className="field-control resize-none leading-[1.65] placeholder:text-neutral-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="medications" className="field-label">Current medications</label>
                <input
                  id="medications"
                  type="text"
                  value={form.medications}
                  onChange={(event) => updateField("medications", event.target.value)}
                  placeholder="Current medications"
                  className="field-control placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label htmlFor="known-conditions" className="field-label">Known conditions</label>
                <input
                  id="known-conditions"
                  type="text"
                  value={form.knownConditions}
                  onChange={(event) => updateField("knownConditions", event.target.value)}
                  placeholder="Known diagnoses or conditions"
                  className="field-control placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="risk-factors" className="field-label">Relevant risk factors</label>
              <input
                id="risk-factors"
                type="text"
                value={form.riskFactors}
                onChange={(event) => updateField("riskFactors", event.target.value)}
                placeholder="Family history, travel, exposure, occupation, or other relevant risk"
                className="field-control placeholder:text-neutral-400"
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button
            type="submit"
            className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium text-white"
          >
            {existingCase || recordId ? "Save and continue" : "Create case"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-[13px] font-medium text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
          >
            {saved ? "Draft saved" : "Save draft"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cases")}
            className="px-3 py-3 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
