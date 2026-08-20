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
  "Patient",
  "Complaint",
  "History",
  "Summary",
  "Examination",
  "Investigations",
  "Differential",
] as const;

const stepTitles = [
  "Patient information",
  "Chief complaint",
  "Targeted history",
  "History summary",
  "Physical examination",
  "Investigations",
  "Differential diagnosis",
] as const;

const stepDescriptions = [
  "Capture only clinically relevant context. No patient name or patient ID is required.",
  "Record the main presenting problem and any information already known at presentation.",
  "Capture complaint-specific follow-up questions and clinically relevant responses.",
  "Organise the history into positive findings, negatives, risks and urgent concerns.",
  "Record the examination findings that materially affect the differential diagnosis.",
  "Capture investigations, why they were requested and results when available.",
  "Review the structured consultation and the ranked output returned by MEDDxAgent.",
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

function WorkflowProgress({ step }: { step: number }) {
  return (
    <ol className="consultation-steps" aria-label="Consultation progress">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const state = stepNumber === step ? "current" : stepNumber < step ? "complete" : "upcoming";
        return (
          <li key={label} className={`consultation-step consultation-step-${state}`}>
            <span className="consultation-step-number">{stepNumber}</span>
            <span className="consultation-step-label">{label}</span>
          </li>
        );
      })}
    </ol>
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
  return (
    <div className={`finding-card finding-card-${tone}`}>
      <label>{label}</label>
      <textarea
        rows={5}
        value={listToLines(value)}
        onChange={(event) => onChange(linesToList(event.target.value))}
        placeholder="One finding per line"
        className="clinical-control clinical-textarea"
      />
    </div>
  );
}

function ConsultationSummary({
  step,
  form,
  workflow,
}: {
  step: number;
  form: CaseInput;
  workflow: ClinicalWorkflow;
}) {
  const answeredHistory = workflow.historyQuestions.filter((item) => item.answer.trim()).length;
  const investigationCount = workflow.investigations.length;

  return (
    <aside className="consultation-summary-card">
      <div>
        <p className="consultation-summary-eyebrow">Consultation</p>
        <p className="consultation-summary-step">Step {step} of {steps.length}</p>
      </div>

      <div className="consultation-summary-divider" />

      <div className="consultation-summary-copy">
        {step === 1 && (
          <p>Patient identifiers are intentionally excluded. Collect only information needed for differential diagnosis.</p>
        )}
        {step === 2 && (
          <p>{form.chiefComplaint || "Add the presenting complaint before moving into targeted history."}</p>
        )}
        {step === 3 && (
          <p>{answeredHistory} answered history question{answeredHistory === 1 ? "" : "s"} recorded for this consultation.</p>
        )}
        {step === 4 && (
          <p>{workflow.historySummary.positiveFindings.length} positive findings and {workflow.historySummary.redFlags.length} red flags currently captured.</p>
        )}
        {step === 5 && (
          <p>Record only examination findings that are observed or available. Empty fields remain explicitly unknown.</p>
        )}
        {step === 6 && (
          <p>{investigationCount} investigation{investigationCount === 1 ? "" : "s"} recorded. MEDDxAgent recommendations are not fabricated by the frontend.</p>
        )}
        {step === 7 && (
          <p>The structured consultation is ready. Ranked diagnoses appear only when real MEDDxAgent output exists.</p>
        )}
      </div>

      <div className="consultation-status-card">
        <span className="consultation-status-dot" />
        <div>
          <strong>
            {step === 1
              ? "Ready for structured history"
              : step === 7
                ? "Ready for MEDDxAgent"
                : `${stepTitles[step - 1]} in progress`}
          </strong>
          <span>{step < steps.length ? `Next: ${stepTitles[step]}` : "Final consultation step"}</span>
        </div>
      </div>

      <dl className="consultation-mini-details">
        <div>
          <dt>Age</dt>
          <dd>{form.age || "—"}</dd>
        </div>
        <div>
          <dt>Sex</dt>
          <dd>{form.sex || "—"}</dd>
        </div>
        <div>
          <dt>Complaint</dt>
          <dd>{form.chiefComplaint || "Not entered"}</dd>
        </div>
      </dl>
    </aside>
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
      <div className="consultation-page consultation-empty-state">
        <p className="consultation-page-eyebrow">Case unavailable</p>
        <h1>This case is not in the local workspace.</h1>
        <div className="consultation-empty-actions">
          <Link to="/cases" className="clinical-button clinical-button-primary">View cases</Link>
          <Link to="/cases/new" className="clinical-button clinical-button-secondary">New consultation</Link>
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
    <div className="consultation-page">
      <div className="consultation-page-heading">
        <p className="consultation-page-eyebrow">New consultation</p>
        <h1>{stepTitles[step - 1]}</h1>
        <p>{stepDescriptions[step - 1]}</p>
      </div>

      <WorkflowProgress step={step} />

      <form onSubmit={handleFinish}>
        <div className="consultation-layout">
          <section className="consultation-card">
            <div className="consultation-card-heading">
              <div>
                <p className="consultation-card-eyebrow">Clinical context</p>
                <h2>{stepTitles[step - 1]}</h2>
              </div>
              <span className="consultation-card-count">{step}/{steps.length}</span>
            </div>

            {step === 1 && (
              <div className="consultation-fields">
                <div className="clinical-grid clinical-grid-2">
                  <label className="clinical-field" htmlFor="patient-age">
                    <span>Age</span>
                    <input
                      id="patient-age"
                      type="number"
                      min={0}
                      max={150}
                      value={form.age}
                      onChange={(event) => updateField("age", event.target.value)}
                      placeholder="45"
                      className="clinical-control"
                    />
                  </label>

                  <fieldset className="clinical-field">
                    <legend>Sex / gender</legend>
                    <div className="clinical-segmented">
                      {(["Male", "Female", "Other"] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => updateField("sex", value)}
                          className={form.sex === value ? "active" : ""}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <label className="clinical-field" htmlFor="known-conditions">
                  <span>Relevant chronic conditions</span>
                  <input
                    id="known-conditions"
                    value={form.knownConditions}
                    onChange={(event) => updateField("knownConditions", event.target.value)}
                    placeholder="Hypertension, Type 2 diabetes"
                    className="clinical-control"
                  />
                </label>

                <label className="clinical-field" htmlFor="medications">
                  <span>Current medications</span>
                  <input
                    id="medications"
                    value={form.medications}
                    onChange={(event) => updateField("medications", event.target.value)}
                    placeholder="Amlodipine 5 mg, Metformin 500 mg"
                    className="clinical-control"
                  />
                </label>

                <div className="clinical-grid clinical-grid-2">
                  <label className="clinical-field" htmlFor="medical-history">
                    <span>Other relevant background</span>
                    <textarea
                      id="medical-history"
                      rows={4}
                      value={form.medicalHistory}
                      onChange={(event) => updateField("medicalHistory", event.target.value)}
                      placeholder="Allergies, travel, exposure, pregnancy status or other clinically relevant context"
                      className="clinical-control clinical-textarea"
                    />
                  </label>

                  <label className="clinical-field" htmlFor="risk-factors">
                    <span>Known risk factors</span>
                    <textarea
                      id="risk-factors"
                      rows={4}
                      value={form.riskFactors}
                      onChange={(event) => updateField("riskFactors", event.target.value)}
                      placeholder="Smoking, immobility, family history, occupation or exposure"
                      className="clinical-control clinical-textarea"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="consultation-fields">
                <label className="clinical-field" htmlFor="chief-complaint">
                  <span>Main presenting complaint</span>
                  <input
                    id="chief-complaint"
                    value={form.chiefComplaint}
                    onChange={(event) => updateField("chiefComplaint", event.target.value)}
                    placeholder="Shortness of breath"
                    className="clinical-control clinical-control-prominent"
                  />
                </label>

                <label className="clinical-field" htmlFor="initial-information">
                  <span>Initial presentation context</span>
                  <textarea
                    id="initial-information"
                    rows={7}
                    value={form.initialInformation}
                    onChange={(event) => updateField("initialInformation", event.target.value)}
                    placeholder="Optional details already known at presentation"
                    className="clinical-control clinical-textarea"
                  />
                </label>

                <div className="clinical-info-panel">
                  <span className="clinical-info-icon">i</span>
                  <div>
                    <strong>Targeted history comes next</strong>
                    <p>Complaint-specific follow-up questions can be entered manually until the real MEDDxAgent application layer supplies them.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="consultation-fields">
                <div className="clinical-section-heading">
                  <div>
                    <h3>Complaint-specific follow-up</h3>
                    <p>Capture targeted clinician questions and the patient responses that materially affect the differential.</p>
                  </div>
                  <button type="button" onClick={addHistoryQuestion} className="clinical-button clinical-button-secondary">
                    + Add question
                  </button>
                </div>

                {workflow.historyQuestions.length === 0 ? (
                  <button type="button" onClick={addHistoryQuestion} className="clinical-empty-control">
                    <strong>Add the first targeted history question</strong>
                    <span>Questions and answers are stored with this case.</span>
                  </button>
                ) : (
                  <div className="clinical-stack">
                    {workflow.historyQuestions.map((item, index) => (
                      <div key={item.id} className="clinical-module">
                        <div className="clinical-module-heading">
                          <span>Q{String(index + 1).padStart(2, "0")}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setWorkflow((current) => ({
                                ...current,
                                historyQuestions: current.historyQuestions.filter((question) => question.id !== item.id),
                              }))
                            }
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
                          className="clinical-control"
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
                          className="clinical-control clinical-textarea"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="consultation-fields">
                <p className="clinical-section-copy">Organise the history into clinically meaningful findings. These fields stay structured for the MEDDxAgent integration layer.</p>
                <div className="clinical-grid clinical-grid-2">
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
              <div className="consultation-fields">
                <div className="clinical-grid clinical-grid-4">
                  {[
                    ["respiratoryRate", "Respiratory rate", "breaths/min"],
                    ["oxygenSaturation", "Oxygen saturation", "%"],
                    ["heartRate", "Heart rate", "beats/min"],
                    ["temperature", "Temperature", "°C"],
                  ].map(([key, label, unit]) => (
                    <label className="clinical-field" key={key}>
                      <span>{label}</span>
                      <div className="clinical-unit-control">
                        <input
                          value={workflow.examination[key as keyof ClinicalWorkflow["examination"]]}
                          onChange={(event) =>
                            setWorkflow((current) => ({
                              ...current,
                              examination: { ...current.examination, [key]: event.target.value },
                            }))
                          }
                          className="clinical-control"
                        />
                        <em>{unit}</em>
                      </div>
                    </label>
                  ))}
                </div>

                <label className="clinical-field">
                  <span>Blood pressure</span>
                  <input
                    value={workflow.examination.bloodPressure}
                    onChange={(event) =>
                      setWorkflow((current) => ({
                        ...current,
                        examination: { ...current.examination, bloodPressure: event.target.value },
                      }))
                    }
                    placeholder="135/85 mmHg"
                    className="clinical-control"
                  />
                </label>

                <div className="clinical-grid clinical-grid-2">
                  {[
                    ["generalAppearance", "General appearance"],
                    ["respiratoryDistress", "Respiratory distress"],
                    ["cyanosis", "Cyanosis"],
                    ["pallor", "Pallor"],
                  ].map(([key, label]) => (
                    <label className="clinical-field" key={key}>
                      <span>{label}</span>
                      <input
                        value={workflow.examination[key as keyof ClinicalWorkflow["examination"]]}
                        onChange={(event) =>
                          setWorkflow((current) => ({
                            ...current,
                            examination: { ...current.examination, [key]: event.target.value },
                          }))
                        }
                        placeholder="Enter observed finding"
                        className="clinical-control"
                      />
                    </label>
                  ))}
                </div>

                <div className="clinical-grid clinical-grid-2">
                  <label className="clinical-field">
                    <span>Respiratory examination</span>
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
                      className="clinical-control clinical-textarea"
                    />
                  </label>
                  <label className="clinical-field">
                    <span>Cardiovascular examination</span>
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
                      className="clinical-control clinical-textarea"
                    />
                  </label>
                </div>

                <label className="clinical-field">
                  <span>Other examination findings</span>
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
                    className="clinical-control clinical-textarea"
                  />
                </label>
              </div>
            )}

            {step === 6 && (
              <div className="consultation-fields">
                <div className="clinical-section-heading">
                  <div>
                    <h3>Investigations and results</h3>
                    <p>Capture initial, targeted or conditional investigations and results when available.</p>
                  </div>
                  <button type="button" onClick={addInvestigation} className="clinical-button clinical-button-secondary">
                    + Add investigation
                  </button>
                </div>

                {workflow.investigations.length === 0 ? (
                  <button type="button" onClick={addInvestigation} className="clinical-empty-control">
                    <strong>Add an investigation</strong>
                    <span>Record why it is being requested and the result when available.</span>
                  </button>
                ) : (
                  <div className="clinical-stack">
                    {workflow.investigations.map((item, index) => (
                      <div key={item.id} className="clinical-module">
                        <div className="clinical-module-heading">
                          <span>INV {String(index + 1).padStart(2, "0")}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setWorkflow((current) => ({
                                ...current,
                                investigations: current.investigations.filter((investigation) => investigation.id !== item.id),
                              }))
                            }
                          >
                            Remove
                          </button>
                        </div>

                        <div className="clinical-grid clinical-grid-investigation">
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
                            className="clinical-control"
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
                            className="clinical-control"
                          >
                            {Object.entries(investigationCategoryLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="clinical-grid clinical-grid-2">
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
                            className="clinical-control clinical-textarea"
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
                            className="clinical-control clinical-textarea"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 7 && (
              <div className="consultation-fields">
                <div className="clinical-case-ready">
                  <p>Case ready</p>
                  <h3>{form.chiefComplaint || "Clinical consultation"}</h3>
                  <span>{form.age ? `${form.age}y` : "Age not entered"}{form.sex ? ` · ${form.sex}` : ""}</span>
                </div>

                {diagnosticEntries.length > 0 ? (
                  <div className="clinical-differential-list">
                    {diagnosticEntries.map((entry) => (
                      <div key={`${entry.rank}-${entry.diagnosis}`}>
                        <span>{entry.rank}</span>
                        <strong>{entry.diagnosis}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="clinical-empty-output">
                    <strong>Awaiting real MEDDxAgent output</strong>
                    <p>The frontend does not invent diagnoses, probabilities, discriminators or management while the engine/API integration is unavailable.</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <ConsultationSummary step={step} form={form} workflow={workflow} />
        </div>

        {error && <div className="clinical-error">{error}</div>}

        <div className="consultation-actions">
          <div>
            {step > 1 && (
              <button type="button" onClick={handleBack} className="clinical-button clinical-button-secondary">
                Back
              </button>
            )}
            <button type="button" onClick={handleSaveDraft} className="clinical-button clinical-button-ghost">
              {saved ? "Draft saved" : "Save draft"}
            </button>
          </div>

          {step < steps.length ? (
            <button type="button" onClick={handleNext} className="clinical-button clinical-button-primary">
              Save & continue <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="submit" className="clinical-button clinical-button-primary">
              Save consultation <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
