import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  buildDDxPatientInitialInfo,
  caseToInput,
  createEmptyClinicalWorkflow,
  getCase,
  saveCaseInput,
} from "../data/caseStore";
import type { CaseInput, ClinicalWorkflow } from "../types";

const steps = [
  "Patient",
  "Complaint + history",
  "Examination",
  "Investigations",
  "Engine review",
  "Run",
] as const;

const stepTitles = [
  "Patient information",
  "Complaint & targeted history",
  "Physical examination",
  "Investigations",
  "Engine input review",
  "Run MEDDxAgent",
] as const;

const stepDescriptions = [
  "",
  "Record the presenting problem and information already known before MEDDxAgent history taking.",
  "Record observed examination findings that should be available to DDxDriver.",
  "Add investigation results already available to the clinician.",
  "Review the exact clinical information assembled for DDxDriver before the engine handoff.",
  "Hand the prepared patient context to MEDDxAgent for history taking, retrieval and differential diagnosis.",
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

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
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

function EngineStage({
  number,
  title,
  copy,
  status,
  tone = "neutral",
}: {
  number: string;
  title: string;
  copy: string;
  status: string;
  tone?: "neutral" | "ready" | "complete";
}) {
  return (
    <div className={`meddx-engine-stage meddx-engine-stage-${tone}`}>
      <span className="meddx-engine-stage-number">{number}</span>
      <div className="meddx-engine-stage-copy">
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
      <span className="meddx-engine-stage-status">{status}</span>
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
  const investigationCount = workflow.investigations.filter((item) => item.name.trim() || item.result.trim()).length;

  return (
    <aside className="consultation-summary-card">
      <div>
        <p className="consultation-summary-eyebrow">MEDDxAgent intake</p>
        <p className="consultation-summary-step">Step {step} of {steps.length}</p>
      </div>

      <div className="consultation-summary-divider" />

      <div className="consultation-summary-copy">
        {step === 1 && <p>Building the patient context that will be serialized into DDxDriver patient initial information.</p>}
        {step === 2 && <p>{form.chiefComplaint || "Add the presenting complaint."} MEDDxAgent owns targeted question generation.</p>}
        {step === 3 && <p>Observed examination findings are appended to the engine patient context.</p>}
        {step === 4 && <p>{investigationCount} investigation result{investigationCount === 1 ? "" : "s"} available for the engine context.</p>}
        {step === 5 && <p>This page is read-only. It shows the clinical payload assembled from every retained intake field.</p>}
        {step === 6 && <p>The prepared case is ready for the DDxDriver orchestration flow.</p>}
      </div>

      <div className="consultation-status-card">
        <span className="consultation-status-dot" />
        <div>
          <strong>
            {step === 1
              ? "Building patient context"
              : step === 2
                ? "History-taking entry point"
                : step === 5
                  ? "Reviewing engine input"
                  : step === 6
                    ? "Ready for MEDDxAgent"
                    : `${stepTitles[step - 1]} in progress`}
          </strong>
          <span>{step < steps.length ? `Next: ${stepTitles[step]}` : "Engine handoff follows"}</span>
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
        <div>
          <dt>History</dt>
          <dd>{answeredHistory ? `${answeredHistory} responses` : "Engine controlled"}</dd>
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

  const updateExamination = (key: keyof ClinicalWorkflow["examination"], value: string) => {
    setWorkflow((current) => ({
      ...current,
      examination: { ...current.examination, [key]: value },
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
  const answeredHistory = workflow.historyQuestions.filter((item) => item.answer.trim()).length;
  const enginePayload = buildDDxPatientInitialInfo(form, workflow);

  return (
    <div className="consultation-page">
      <div className="consultation-page-heading">
        <p className="consultation-page-eyebrow">New consultation</p>
        <h1>{stepTitles[step - 1]}</h1>
        {step !== 1 && <p>{stepDescriptions[step - 1]}</p>}
      </div>

      <WorkflowProgress step={step} />

      <form onSubmit={handleFinish}>
        <div className="consultation-layout">
          <section className="consultation-card">
            <div className="consultation-card-heading">
              <div>
                <p className="consultation-card-eyebrow">
                  {step === 2 || step === 5 || step === 6 ? "MEDDxAgent stage" : "Clinical context"}
                </p>
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
                    <legend>Sex</legend>
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
                  <span>Initial clinical information</span>
                  <textarea
                    id="initial-information"
                    rows={6}
                    value={form.initialInformation}
                    onChange={(event) => updateField("initialInformation", event.target.value)}
                    placeholder="Symptoms, duration, onset, severity and other information already known before targeted history"
                    className="clinical-control clinical-textarea"
                  />
                </label>

                <div className="clinical-section-heading meddx-history-heading">
                  <div>
                    <h3>MEDDxAgent targeted history</h3>
                  </div>
                  <div className="meddx-history-actions">
                    <button
                      type="button"
                      className="clinical-button clinical-button-primary"
                      disabled
                      title="Available when the MEDDxAgent application layer is connected"
                    >
                      Generate next question
                    </button>
                  </div>
                </div>

                {workflow.historyQuestions.length === 0 ? (
                  <div className="meddx-history-empty">
                    <div className="meddx-history-empty-icon">?</div>
                    <strong>Awaiting the first MEDDxAgent question</strong>
                    <p>The doctor-question field is intentionally absent. DDxDriver/history taking must supply the question before a patient response can be entered.</p>
                  </div>
                ) : (
                  <div className="clinical-stack meddx-dialogue-stack">
                    {workflow.historyQuestions.map((item, index) => (
                      <div key={item.id} className="clinical-module meddx-dialogue-turn">
                        <div className="clinical-module-heading">
                          <span>TURN {String(index + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="meddx-engine-question">
                          <span>MEDDxAgent question</span>
                          <strong>{item.question || "Question unavailable"}</strong>
                        </div>
                        <label className="clinical-field">
                          <span>Patient response</span>
                          <textarea
                            rows={4}
                            value={item.answer}
                            onChange={(event) =>
                              setWorkflow((current) => ({
                                ...current,
                                historyQuestions: current.historyQuestions.map((question) =>
                                  question.id === item.id ? { ...question, answer: event.target.value } : question
                                ),
                              }))
                            }
                            placeholder="Record the patient's response"
                            className="clinical-control clinical-textarea"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
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
                          onChange={(event) => updateExamination(key as keyof ClinicalWorkflow["examination"], event.target.value)}
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
                    onChange={(event) => updateExamination("bloodPressure", event.target.value)}
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
                        onChange={(event) => updateExamination(key as keyof ClinicalWorkflow["examination"], event.target.value)}
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
                      onChange={(event) => updateExamination("respiratoryExam", event.target.value)}
                      placeholder="Inspection, palpation, percussion, auscultation"
                      className="clinical-control clinical-textarea"
                    />
                  </label>
                  <label className="clinical-field">
                    <span>Cardiovascular examination</span>
                    <textarea
                      rows={5}
                      value={workflow.examination.cardiovascularExam}
                      onChange={(event) => updateExamination("cardiovascularExam", event.target.value)}
                      placeholder="JVP, heart sounds, murmurs, oedema, perfusion"
                      className="clinical-control clinical-textarea"
                    />
                  </label>
                </div>

                <div className="clinical-grid clinical-grid-2">
                  <label className="clinical-field">
                    <span>Abdominal examination</span>
                    <textarea
                      rows={5}
                      value={workflow.examination.abdominalExam}
                      onChange={(event) => updateExamination("abdominalExam", event.target.value)}
                      placeholder="Inspection, tenderness, guarding, masses, organomegaly, bowel sounds"
                      className="clinical-control clinical-textarea"
                    />
                  </label>
                  <label className="clinical-field">
                    <span>Neurological examination</span>
                    <textarea
                      rows={5}
                      value={workflow.examination.neurologicalExam}
                      onChange={(event) => updateExamination("neurologicalExam", event.target.value)}
                      placeholder="Mental status, cranial nerves, motor, sensory, reflexes, coordination"
                      className="clinical-control clinical-textarea"
                    />
                  </label>
                </div>

                <label className="clinical-field">
                  <span>Other examination findings</span>
                  <textarea
                    rows={4}
                    value={workflow.examination.otherFindings}
                    onChange={(event) => updateExamination("otherFindings", event.target.value)}
                    placeholder="Other complaint-specific or clinically significant findings"
                    className="clinical-control clinical-textarea"
                  />
                </label>
              </div>
            )}

            {step === 4 && (
              <div className="consultation-fields">
                <div className="clinical-section-heading">
                  <div>
                    <h3>Available investigation results</h3>
                  </div>
                  <button type="button" onClick={addInvestigation} className="clinical-button clinical-button-secondary">
                    + Add investigation
                  </button>
                </div>

                {workflow.investigations.length === 0 ? (
                  <button type="button" onClick={addInvestigation} className="clinical-empty-control">
                    <strong>Add an available investigation</strong>
                    <span>Only the test name and available result are sent into the clinical engine context.</span>
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

                        <label className="clinical-field">
                          <span>Investigation name</span>
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
                            placeholder="Chest X-ray"
                            className="clinical-control"
                          />
                        </label>

                        <label className="clinical-field">
                          <span>Available result</span>
                          <textarea
                            rows={4}
                            value={item.result}
                            onChange={(event) =>
                              setWorkflow((current) => ({
                                ...current,
                                investigations: current.investigations.map((investigation) =>
                                  investigation.id === item.id ? { ...investigation, result: event.target.value } : investigation
                                ),
                              }))
                            }
                            placeholder="Result / interpretation available to the clinician"
                            className="clinical-control clinical-textarea"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="consultation-fields">
                <div className="meddx-profile-review">
                  <div>
                    <p className="meddx-profile-eyebrow">DDxDriver handoff</p>
                    <h3>Patient initial information</h3>
                    <p>This review is read-only. Every editable intake field that remains in the consultation is represented in this payload or in engine-generated dialogue.</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Clinical payload</dt>
                      <dd>{enginePayload ? "Ready" : "Empty"}</dd>
                    </div>
                    <div>
                      <dt>Dialogue responses</dt>
                      <dd>{answeredHistory}</dd>
                    </div>
                  </dl>
                </div>

                <div className="clinical-module meddx-engine-input-review">
                  <div className="clinical-module-heading">
                    <span>PATIENT_INITIAL_INFO</span>
                  </div>
                  <pre>{enginePayload || "No clinical information has been entered yet."}</pre>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="consultation-fields meddx-run-fields">
                <div className="clinical-case-ready meddx-case-ready">
                  <p>Engine handoff</p>
                  <h3>{form.chiefComplaint || "Clinical consultation"}</h3>
                  <span>{form.age ? `${form.age}y` : "Age not entered"}{form.sex ? ` · ${form.sex}` : ""}</span>
                </div>

                <div className="meddx-run-panel">
                  <div className="meddx-run-panel-heading">
                    <div>
                      <p className="meddx-profile-eyebrow">MEDDxAgent sequence</p>
                      <h3>DDxDriver orchestration</h3>
                    </div>
                    <button
                      type="button"
                      className="clinical-button clinical-button-primary meddx-run-disabled"
                      disabled
                      title="Available when the MEDDxAgent application layer is connected"
                    >
                      Run MEDDxAgent
                    </button>
                  </div>

                  <div className="meddx-engine-pipeline">
                    <EngineStage
                      number="01"
                      title="History taking"
                      copy="DDxDriver/history taking generates the doctor questions and records the resulting dialogue."
                      status={answeredHistory ? `${answeredHistory} responses captured` : "Engine controlled"}
                      tone={answeredHistory ? "complete" : "ready"}
                    />
                    <EngineStage
                      number="02"
                      title="Evidence retrieval"
                      copy="The RAG agent creates its own search instruction and retrieves relevant disease evidence."
                      status="Engine controlled"
                    />
                    <EngineStage
                      number="03"
                      title="Differential diagnosis"
                      copy="The diagnosis agent creates or updates the ranked differential from accumulated information."
                      status={diagnosticEntries.length ? "Output available" : "Awaiting engine run"}
                      tone={diagnosticEntries.length ? "complete" : "neutral"}
                    />
                  </div>
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
                  <div className="clinical-empty-output meddx-empty-output">
                    <strong>Awaiting MEDDxAgent output</strong>
                    <p>Ranked diagnoses, rationale, dialogue history and retrieved evidence appear only after the real engine returns them.</p>
                  </div>
                )}

                <div className="meddx-output-contract">
                  <div>
                    <span>01</span>
                    <strong>Ranked differential</strong>
                    <p>Final DDx list from the diagnosis workflow.</p>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Rationale</strong>
                    <p>Engine-provided diagnostic rationale when available.</p>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Dialogue history</strong>
                    <p>Doctor/patient history-taking conversation.</p>
                  </div>
                  <div>
                    <span>04</span>
                    <strong>Retrieved evidence</strong>
                    <p>RAG content returned by the engine.</p>
                  </div>
                </div>
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
              Prepare case for MEDDxAgent <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
