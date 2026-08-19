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
      <div className="app-page max-w-[760px] text-center">
        <div className="py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Case unavailable</p>
          <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.035em] text-slate-950">
            This case cannot be edited because it is not in the local workspace.
          </h1>
          <p className="mx-auto mt-3 max-w-[500px] text-[13px] leading-[1.65] text-slate-400">
            The case may have been cleared from this browser or created on another device.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Link to="/cases" className="rounded-xl bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white">
              View cases
            </Link>
            <Link to="/cases/new" className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600">
              New case
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
    <div className="app-page max-w-[920px]">
      <div className="app-page-header flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {existingCase || recordId ? "Edit case" : "New case"}
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[34px]">
            {existingCase || recordId ? "Update patient context" : "Create a patient case"}
          </h1>
          <p className="mt-3 max-w-[620px] text-[14px] leading-[1.7] text-slate-500">
            Enter only information that is actually available. The case is stored locally and no
            diagnostic result is generated or implied from this form.
          </p>
        </div>
        <span className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-500 sm:inline-flex">
          Local workspace
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <section className="app-section">
          <div className="form-section-title">
            <div className="flex items-start gap-3">
              <span className="form-section-index">01</span>
              <div>
                <h2 className="text-[14px] font-semibold tracking-[-0.015em] text-slate-950">
                  Required case context
                </h2>
                <p className="mt-1 text-[12px] text-slate-400">
                  These fields are required before the case can be marked ready.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="patient-id" className="field-label">Patient ID</label>
                <input
                  id="patient-id"
                  type="text"
                  value={form.patientId}
                  onChange={(event) => updateField("patientId", event.target.value)}
                  placeholder="Institution or study ID"
                  required
                  className="field-control font-mono placeholder:text-slate-300"
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
                  className="field-control placeholder:text-slate-300"
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
                className="field-control placeholder:text-slate-300"
              />
            </div>

            <div>
              <label htmlFor="initial-information" className="field-label">Initial information</label>
              <textarea
                id="initial-information"
                rows={5}
                value={form.initialInformation}
                onChange={(event) => updateField("initialInformation", event.target.value)}
                placeholder="Presenting symptoms, relevant observations, vital signs, investigations, and other known context"
                required
                className="field-control resize-none leading-[1.65] placeholder:text-slate-300"
              />
            </div>
          </div>
        </section>

        <section className="app-section">
          <div className="form-section-title">
            <div className="flex items-start gap-3">
              <span className="form-section-index">02</span>
              <div>
                <h2 className="text-[14px] font-semibold tracking-[-0.015em] text-slate-950">
                  Additional context
                </h2>
                <p className="mt-1 text-[12px] text-slate-400">
                  Optional information that can be passed to the diagnostic workflow later.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="medical-history" className="field-label">Medical history</label>
              <textarea
                id="medical-history"
                rows={3}
                value={form.medicalHistory}
                onChange={(event) => updateField("medicalHistory", event.target.value)}
                placeholder="Relevant past medical history"
                className="field-control resize-none leading-[1.65] placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="medications" className="field-label">Current medications</label>
                <input
                  id="medications"
                  type="text"
                  value={form.medications}
                  onChange={(event) => updateField("medications", event.target.value)}
                  placeholder="Current medications"
                  className="field-control placeholder:text-slate-300"
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
                  className="field-control placeholder:text-slate-300"
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
                className="field-control placeholder:text-slate-300"
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button
            type="submit"
            className="button-primary button-accent inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[13px] font-semibold text-white"
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
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            {saved ? "Draft saved" : "Save draft"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cases")}
            className="rounded-xl px-4 py-3 text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
