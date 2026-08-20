import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  caseToInput,
  createEmptyClinicalWorkflow,
  getCase,
  saveCaseInput,
} from "../data/caseStore";
import type {
  CaseInput,
  ClinicalSummary,
  ClinicalWorkflow,
  InvestigationCategory,
} from "../types";

const steps = [
  "Patient information",
  "Chief complaint",
  "Targeted history",
  "History summary",
  "Physical examination",
  "Investigations",
  "Differential diagnosis",
] as const;

const emptyCaseInput: CaseInput = {
  age: "",
  sex: "",
  chiefComplaint: "",
  initialInformation: "",
  medicalHistory: "",
  medications: "",
  knownConditions: "",
  riskFactors: "",
};

const investigationCategoryLabels: Record<InvestigationCategory, string> = {
  initial: "Initial / essential",
  targeted: "Targeted",
  conditional: "Conditional",
};

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

function linesToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToLines(value: string[]) {
  return value.join("\n");
}

function StepHeader({ step }: { step: number }) {
  const progress = (step / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Consultation workflow
          </p>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.035em] text-slate-950 sm:text-[30px]">
            {step}. {steps[step - 1]}
          </h1>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          {step}/{steps.length}
        </span>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function FindingTextarea({
  label,
  tone,
  value,
  onChange,
}: {
  label: string;
  tone: "emerald" | "slate" | "amber" | "rose";
  value: string[];
  onChange: (items: string[]) => void;
}) {
  const toneClasses = {
    emerald: "border-emerald-200 bg-emerald-50/60",
    slate: "border-slate-200 bg-slate-50/70",
    amber: "border-amber-200 bg-amber-50/60",
    rose: "border-rose-200 bg-rose-50/60",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <label className="text-[12px] font-semibold text-slate-800">{label}</label>
      <textarea
        rows={5}
        value={listToLines(value)}
        onChange={(event) => onChange(linesToList(event.target.value))}
        placeholder="One finding per line"
        className="mt-3 w-full resize-none rounded-xl border border-white/80 bg-white px-3.5 py-3 text-[13px] leading-[1.6] text-slate-700 outline-none placeholder:text-slate-300 focus:border-blue-300"
      />
    </div>
  );
}

export default function NewCase() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const existingCase = id ? getCase(id) : undefined;
  const [recordId, setRecordId] = useState(id);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<CaseInput>(() =>
    existingCase ? caseToInput(existingCase) : emptyCaseInput
  );
  const [workflow, setWorkflow] = useState<ClinicalWorkflow>(() =>
    existingCase?.workflow ?? createEmptyClinicalWorkflow()
  );

  if (id && !existingCase) {
    return (
      <div className="app-page max-w-[760px] text-center">
        <div className="py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Case unavailable</p>
          <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.035em] text-slate-950">
            This case cannot be edited because it is not in the local workspace.
          </h1>
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
    setError("");
  };

  const updateSummary = (key: keyof ClinicalSummary, value: string[]) => {
    setWorkflow((current) => ({
      ...current,
      historySummary: { ...current.historySummary, [key]: value },
    }));
  };

  const persist = (status: "draft" | "ready") => {
    const savedCase = saveCaseInput(form, status, recordId, workflow);
    if (!recordId) {
      setRecordId(savedCase.id);
      navigate(`/case/${savedCase.id}/edit`, { replace: true });
    }
    return savedCase;
  };

  const validateStep = () => {
    if (step === 1 && (!form.age.trim() || !form.sex)) {
      setError("Age and sex are required before continuing.");
      return false;
    }
    if (step === 2 && !form.chiefComplaint.trim()) {
      setError("Enter the chief complaint before continuing.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    persist("draft");
    setStep((current) => Math.min(current + 1, steps.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveDraft = () => {
    persist("draft");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const handleFinish = (event: React.FormEvent) => {
    event.preventDefault();
    const savedCase = persist("ready");
    navigate(`/case/${savedCase.id}`);
  };

  const addHistoryQuestion = () => {
    setWorkflow((current) => ({
      ...current,
      historyQuestions: [
        ...current.historyQuestions,
        { id: makeId("history"), question: "", answer: "" },
      ],
    }));
  };

  const addInvestigation = () => {
    setWorkflow((current) => ({
      ...current,
      investigations: [
        ...current.investigations,
        { id: makeId("investigation"), name: "", category: "initial", rationale: "", result: "" },
      ],
    }));
  };

  const diagnosticEntries = existingCase?.differential ?? [];

  return (
    <div className="app-page max-w-[980px]">
      <form onSubmit={handleFinish}>
        <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:p-8">
          <StepHeader step={step} />

          {step === 1 && (
            <div className="space-y-7">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-[12px] leading-[1.6] text-blue-800">
                MEDDxAgent does not require a patient name or patient ID. Capture only clinically relevant context.
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="patient-age" className="field-label">Age</label>
                  <input
                    id="patient-age"
                    type="number"
                    min={0}
                    max={150}
                    value={form.age}
                    onChange={(event) => updateField("age", event.target.value)}
                    placeholder="Age"
                    className="field-control placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="field-label">Sex / gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Male", "Female", "Other"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField("sex", value)}
                        className={`rounded-xl border px-3 py-3 text-[12px] font-semibold transition-colors ${
                          form.sex === value
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-500 hover:border-blue-200"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="known-conditions" className="field-label">Relevant chronic conditions</label>
                <input
                  id="known-conditions"
                  value={form.knownConditions}
                  onChange={(event) => updateField("knownConditions", event.target.value)}
                  placeholder="e.g. hypertension, diabetes, COPD"
                  className="field-control placeholder:text-slate-300"
                />
              </div>

              <div>
                <label htmlFor="medications" className="field-label">Current medications</label>
                <input
                  id="medications"
                  value={form.medications}
                  onChange={(event) => updateField("medications", event.target.value)}
                  placeholder="Relevant existing medications"
                  className="field-control placeholder:text-slate-300"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="medical-history" className="field-label">Other relevant background</label>
                  <textarea
                    id="medical-history"
                    rows={4}
                    value={form.medicalHistory}
                    onChange={(event) => updateField("medicalHistory", event.target.value)}
                    placeholder="Previous disease, procedures, allergies, pregnancy status, travel, exposure..."
                    className="field-control resize-none leading-[1.6] placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label htmlFor="risk-factors" className="field-label">Known risk factors</label>
                  <textarea
                    id="risk-factors"
                    rows={4}
                    value={form.riskFactors}
                    onChange={(event) => updateField("riskFactors", event.target.value)}
                    placeholder="Smoking, immobility, family history, occupation, exposure..."
                    className="field-control resize-none leading-[1.6] placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="chief-complaint" className="field-label">Main presenting complaint</label>
                <input
                  id="chief-complaint"
                  value={form.chiefComplaint}
                  onChange={(event) => updateField("chiefComplaint", event.target.value)}
                  placeholder="e.g. Shortness of breath"
                  className="field-control text-[15px] placeholder:text-slate-300"
                />
              </div>
              <div>
                <label htmlFor="initial-information" className="field-label">Initial presentation context</label>
                <textarea
                  id="initial-information"
                  rows={6}
                  value={form.initialInformation}
                  onChange={(event) => updateField("initialInformation", event.target.value)}
                  placeholder="Optional details already known at presentation"
                  className="field-control resize-none leading-[1.65] placeholder:text-slate-300"
                />
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-[12px] font-semibold text-blue-900">Targeted history comes next</p>
                <p className="mt-1 text-[12px] leading-[1.6] text-blue-700">
                  The workflow is structured to receive complaint-specific follow-up questions from MEDDxAgent. Until that integration is connected, questions can be entered manually rather than fabricated by the frontend.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Complaint-specific follow-up</h2>
                  <p className="mt-1 max-w-[640px] text-[12px] leading-[1.6] text-slate-400">
                    MEDDxAgent-generated questions will populate this section when the application layer is connected. You can capture targeted clinician questions and answers now.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addHistoryQuestion}
                  className="shrink-0 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-[12px] font-semibold text-blue-700"
                >
                  + Add question
                </button>
              </div>

              {workflow.historyQuestions.length === 0 ? (
                <button
                  type="button"
                  onClick={addHistoryQuestion}
                  className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center"
                >
                  <span className="text-[13px] font-semibold text-slate-700">Add the first targeted history question</span>
                  <span className="mt-1 block text-[12px] text-slate-400">Questions and answers are stored with this case.</span>
                </button>
              ) : (
                <div className="space-y-4">
                  {workflow.historyQuestions.map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] text-blue-600">Q{String(index + 1).padStart(2, "0")}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setWorkflow((current) => ({
                              ...current,
                              historyQuestions: current.historyQuestions.filter((question) => question.id !== item.id),
                            }))
                          }
                          className="text-[11px] font-medium text-slate-300 hover:text-rose-500"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        value={item.question}
                        onChange={(event) =>
                          setWorkflow((current) => ({
                            ...current,
                            historyQuestions: current.historyQuestions.map((question) =>
                              question.id === item.id ? { ...question, question: event.target.value } : question
                            ),
                          }))
                        }
                        placeholder="Targeted question"
                        className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-300 focus:border-blue-300"
                      />
                      <textarea
                        rows={3}
                        value={item.answer}
                        onChange={(event) =>
                          setWorkflow((current) => ({
                            ...current,
                            historyQuestions: current.historyQuestions.map((question) =>
                              question.id === item.id ? { ...question, answer: event.target.value } : question
                            ),
                          }))
                        }
                        placeholder="Patient answer / clinically relevant response"
                        className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-[13px] leading-[1.6] text-slate-700 outline-none placeholder:text-slate-300 focus:border-blue-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="mb-5 max-w-[680px] text-[12px] leading-[1.6] text-slate-400">
                Organise the history into clinically meaningful findings. These fields are stored as structured data and can later be populated by the MEDDxAgent application layer.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <FindingTextarea
                  label="Key positive findings"
                  tone="emerald"
                  value={workflow.historySummary.positiveFindings}
                  onChange={(value) => updateSummary("positiveFindings", value)}
                />
                <FindingTextarea
                  label="Important negative findings"
                  tone="slate"
                  value={workflow.historySummary.negativeFindings}
                  onChange={(value) => updateSummary("negativeFindings", value)}
                />
                <FindingTextarea
                  label="Risk factors"
                  tone="amber"
                  value={workflow.historySummary.riskFactors}
                  onChange={(value) => updateSummary("riskFactors", value)}
                />
                <FindingTextarea
                  label="Red flags / urgent concerns"
                  tone="rose"
                  value={workflow.historySummary.redFlags}
                  onChange={(value) => updateSummary("redFlags", value)}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-7">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["respiratoryRate", "Respiratory rate", "breaths/min"],
                  ["oxygenSaturation", "Oxygen saturation", "%"],
                  ["heartRate", "Heart rate", "beats/min"],
                  ["temperature", "Temperature", "°C"],
                ].map(([key, label, unit]) => (
                  <div key={key}>
                    <label className="field-label">{label}</label>
                    <div className="relative">
                      <input
                        value={workflow.examination[key as keyof ClinicalWorkflow["examination"]]}
                        onChange={(event) =>
                          setWorkflow((current) => ({
                            ...current,
                            examination: { ...current.examination, [key]: event.target.value },
                          }))
                        }
                        className="field-control pr-20"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="field-label">Blood pressure</label>
                <input
                  value={workflow.examination.bloodPressure}
                  onChange={(event) =>
                    setWorkflow((current) => ({
                      ...current,
                      examination: { ...current.examination, bloodPressure: event.target.value },
                    }))
                  }
                  placeholder="e.g. 135/85 mmHg"
                  className="field-control placeholder:text-slate-300"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  ["generalAppearance", "General appearance"],
                  ["respiratoryDistress", "Respiratory distress"],
                  ["cyanosis", "Cyanosis"],
                  ["pallor", "Pallor"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="field-label">{label}</label>
                    <input
                      value={workflow.examination[key as keyof ClinicalWorkflow["examination"]]}
                      onChange={(event) =>
                        setWorkflow((current) => ({
                          ...current,
                          examination: { ...current.examination, [key]: event.target.value },
                        }))
                      }
                      placeholder="Enter observed finding"
                      className="field-control placeholder:text-slate-300"
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="field-label">Respiratory examination</label>
                  <textarea
                    rows={5}
                    value={workflow.examination.respiratoryExam}
                    onChange={(event) =>
                      setWorkflow((current) => ({
                        ...current,
                        examination: { ...current.examination, respiratoryExam: event.target.value },
                      }))
                    }
                    placeholder="Inspection, palpation, percussion, auscultation"
                    className="field-control resize-none leading-[1.6] placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="field-label">Cardiovascular examination</label>
                  <textarea
                    rows={5}
                    value={workflow.examination.cardiovascularExam}
                    onChange={(event) =>
                      setWorkflow((current) => ({
                        ...current,
                        examination: { ...current.examination, cardiovascularExam: event.target.value },
                      }))
                    }
                    placeholder="JVP, heart sounds, murmurs, oedema, perfusion"
                    className="field-control resize-none leading-[1.6] placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Other examination findings</label>
                <textarea
                  rows={4}
                  value={workflow.examination.otherFindings}
                  onChange={(event) =>
                    setWorkflow((current) => ({
                      ...current,
                      examination: { ...current.examination, otherFindings: event.target.value },
                    }))
                  }
                  placeholder="Other complaint-specific or clinically significant findings"
                  className="field-control resize-none leading-[1.6] placeholder:text-slate-300"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Investigations and results</h2>
                  <p className="mt-1 max-w-[640px] text-[12px] leading-[1.6] text-slate-400">
                    Capture initial, targeted, or conditional investigations. MEDDxAgent recommendations should populate this structure only when the real engine is connected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addInvestigation}
                  className="shrink-0 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-[12px] font-semibold text-blue-700"
                >
                  + Add investigation
                </button>
              </div>

              {workflow.investigations.length === 0 ? (
                <button
                  type="button"
                  onClick={addInvestigation}
                  className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center"
                >
                  <span className="text-[13px] font-semibold text-slate-700">Add an investigation</span>
                  <span className="mt-1 block text-[12px] text-slate-400">Record why it is being requested and the result when available.</span>
                </button>
              ) : (
                <div className="space-y-4">
                  {workflow.investigations.map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] text-blue-600">INV {String(index + 1).padStart(2, "0")}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setWorkflow((current) => ({
                              ...current,
                              investigations: current.investigations.filter((investigation) => investigation.id !== item.id),
                            }))
                          }
                          className="text-[11px] font-medium text-slate-300 hover:text-rose-500"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_190px]">
                        <input
                          value={item.name}
                          onChange={(event) =>
                            setWorkflow((current) => ({
                              ...current,
                              investigations: current.investigations.map((investigation) =>
                                investigation.id === item.id ? { ...investigation, name: event.target.value } : investigation
                              ),
                            }))
                          }
                          placeholder="Investigation name"
                          className="rounded-xl border border-slate-200 px-3.5 py-3 text-[13px] outline-none placeholder:text-slate-300 focus:border-blue-300"
                        />
                        <select
                          value={item.category}
                          onChange={(event) =>
                            setWorkflow((current) => ({
                              ...current,
                              investigations: current.investigations.map((investigation) =>
                                investigation.id === item.id
                                  ? { ...investigation, category: event.target.value as InvestigationCategory }
                                  : investigation
                              ),
                            }))
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[12px] text-slate-600 outline-none focus:border-blue-300"
                        >
                          {Object.entries(investigationCategoryLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <textarea
                          rows={3}
                          value={item.rationale}
                          onChange={(event) =>
                            setWorkflow((current) => ({
                              ...current,
                              investigations: current.investigations.map((investigation) =>
                                investigation.id === item.id ? { ...investigation, rationale: event.target.value } : investigation
                              ),
                            }))
                          }
                          placeholder="Why requested / what it helps assess"
                          className="resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-[12px] leading-[1.6] outline-none placeholder:text-slate-300 focus:border-blue-300"
                        />
                        <textarea
                          rows={3}
                          value={item.result}
                          onChange={(event) =>
                            setWorkflow((current) => ({
                              ...current,
                              investigations: current.investigations.map((investigation) =>
                                investigation.id === item.id ? { ...investigation, result: event.target.value } : investigation
                              ),
                            }))
                          }
                          placeholder="Result / interpretation"
                          className="resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-[12px] leading-[1.6] outline-none placeholder:text-slate-300 focus:border-blue-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Case ready</p>
                <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-slate-950">
                  {form.chiefComplaint || "Clinical consultation"}
                </h2>
                <p className="mt-2 text-[12px] leading-[1.6] text-slate-500">
                  {form.age ? `${form.age}y` : "Age not entered"}{form.sex ? ` · ${form.sex}` : ""}
                </p>
              </div>

              {diagnosticEntries.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  {diagnosticEntries.map((entry) => (
                    <div key={`${entry.rank}-${entry.diagnosis}`} className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 font-mono text-[10px] text-blue-700">
                        {entry.rank}
                      </span>
                      <p className="text-[14px] font-semibold text-slate-800">{entry.diagnosis}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-6 py-9">
                  <p className="text-[14px] font-semibold text-slate-900">Awaiting real MEDDxAgent output</p>
                  <p className="mt-2 max-w-[680px] text-[12px] leading-[1.7] text-slate-500">
                    The consultation data is now structured for History → Examination → Investigations → Ranked Differential. The frontend will not invent diagnoses, probabilities, discriminators, or management while the engine/API integration is unavailable.
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-600"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-xl px-3 py-2.5 text-[12px] font-medium text-slate-400 hover:text-slate-700"
              >
                {saved ? "Draft saved" : "Save draft"}
              </button>
            </div>

            {step < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="button-primary button-accent inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-semibold text-white"
              >
                Save & continue
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button
                type="submit"
                className="button-primary button-accent inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-semibold text-white"
              >
                Save consultation
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
