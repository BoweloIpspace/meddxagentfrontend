import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCase } from "../data/caseStore";
import type {
  CaseStatus,
  DiagnosisClassification,
  DifferentialEntry,
  ManagementPlan,
} from "../types";

const statusLabels: Record<CaseStatus, string> = {
  draft: "Draft",
  ready: "Ready",
  active: "In progress",
  completed: "Completed",
  error: "Needs attention",
};

const classificationLabels: Record<DiagnosisClassification, string> = {
  "most-likely": "Most likely",
  possible: "Possible",
  "must-not-miss": "Must not miss",
  confirmed: "Confirmed",
  "needs-investigation": "Needs investigation",
};

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return <div className="case-empty-panel">{children}</div>;
}

function DetailList({ rows }: { rows: Array<[string, string | undefined]> }) {
  const visible = rows.filter(([, value]) => Boolean(value));
  if (visible.length === 0) return <EmptyPanel>No information recorded.</EmptyPanel>;

  return (
    <div className="case-detail-list">
      {visible.map(([label, value]) => (
        <div className="case-detail-row" key={label}>
          <span>{label}</span>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );
}

function FindingCard({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className={`case-finding-card case-finding-${tone}`}>
      <h3>{title}</h3>
      {items.length > 0 ? (
        <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      ) : (
        <p>None recorded.</p>
      )}
    </div>
  );
}

function StructuredList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="case-structured-list">
      <h4>{title}</h4>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function ManagementSection({ plan }: { plan?: ManagementPlan }) {
  if (!plan) return null;

  const groups = [
    ["Immediate management", plan.immediate],
    ["Definitive treatment", plan.definitive],
    ["Supportive management", plan.supportive],
    ["Monitoring", plan.monitoring],
    ["Escalation", plan.escalation],
    ["Follow-up / reassessment", plan.followUp],
  ] as const;

  if (!groups.some(([, items]) => items?.length)) return null;

  return (
    <div className="case-diagnosis-subsection">
      <p className="case-section-label">Management if confirmed</p>
      <div className="case-diagnosis-grid">
        {groups.map(([title, items]) => items?.length ? <StructuredList key={title} title={title} items={items} /> : null)}
      </div>
    </div>
  );
}

function DiagnosisDetail({ entry, rationale }: { entry: DifferentialEntry; rationale: string }) {
  const hasStructuredDetail = Boolean(
    entry.supportingEvidence?.length ||
      entry.againstEvidence?.length ||
      entry.confirmationNeeds?.length ||
      entry.discriminators?.length ||
      entry.management
  );

  return (
    <div className="case-diagnosis-detail">
      <div className="case-diagnosis-heading">
        <div>
          <p>Diagnosis {entry.rank}</p>
          <h3>{entry.diagnosis}</h3>
        </div>
        {entry.classification && <span>{classificationLabels[entry.classification]}</span>}
      </div>

      {hasStructuredDetail ? (
        <div className="case-diagnosis-grid">
          <StructuredList title="Why this diagnosis is plausible" items={entry.supportingEvidence} />
          <StructuredList title="What makes it less likely" items={entry.againstEvidence} />
          <StructuredList title="What should be confirmed" items={entry.confirmationNeeds} />
          <StructuredList title="What could change the ranking" items={entry.discriminators} />
        </div>
      ) : (
        <EmptyPanel>Structured diagnosis detail is not available yet.</EmptyPanel>
      )}

      {rationale.trim() && (
        <div className="case-diagnosis-subsection">
          <p className="case-section-label">MEDDxAgent rationale</p>
          <p className="case-long-copy">{rationale}</p>
        </div>
      )}

      <ManagementSection plan={entry.management} />
    </div>
  );
}

export default function ActiveCase() {
  const { id } = useParams<{ id: string }>();
  const caseRecord = id ? getCase(id) : undefined;
  const [selectedRank, setSelectedRank] = useState<number | null>(null);

  if (!caseRecord) {
    return (
      <div className="case-page case-page-empty">
        <p className="workspace-page-eyebrow">Case unavailable</p>
        <h1>This case does not exist in the local workspace.</h1>
        <p>Cases are stored on this device only until backend persistence is connected.</p>
        <div className="case-header-actions">
          <Link to="/cases" className="workspace-page-button workspace-page-button-primary">View cases</Link>
          <Link to="/cases/new" className="workspace-page-button">New case</Link>
        </div>
      </div>
    );
  }

  const { patient, workflow } = caseRecord;
  const hasDiagnosticOutput = caseRecord.differential.length > 0;
  const selectedEntry = caseRecord.differential.find((entry) => entry.rank === selectedRank) ?? caseRecord.differential[0];
  const hasHistorySummary = Object.values(workflow.historySummary).some((items) => items.length > 0);
  const hasExamination = Object.values(workflow.examination).some(Boolean);

  return (
    <div className="case-page">
      <header className="case-hero">
        <div>
          <div className="case-meta">
            <span>{caseRecord.id}</span>
            <span className="case-status">{statusLabels[caseRecord.status]}</span>
          </div>
          <h1>{patient.chiefComplaint || "Untitled case"}</h1>
          <p>{patient.age ? `${patient.age}y` : "Age not entered"}{patient.sex ? ` · ${patient.sex}` : ""}</p>
        </div>
        <div className="case-header-actions">
          <Link to={`/case/${caseRecord.id}/edit`} className="workspace-page-button">Edit consultation</Link>
          <Link to="/cases" className="workspace-page-button workspace-page-button-ghost">All cases</Link>
        </div>
      </header>

      <section className="case-top-grid">
        <div className="case-panel">
          <div className="case-panel-heading">
            <div>
              <p className="case-section-label">Clinical history summary</p>
              <h2>History findings</h2>
            </div>
          </div>
          {hasHistorySummary ? (
            <div className="case-findings-grid">
              <FindingCard title="Key positive findings" items={workflow.historySummary.positiveFindings} tone="emerald" />
              <FindingCard title="Important negative findings" items={workflow.historySummary.negativeFindings} tone="slate" />
              <FindingCard title="Risk factors" items={workflow.historySummary.riskFactors} tone="amber" />
              <FindingCard title="Red flags / urgent concerns" items={workflow.historySummary.redFlags} tone="rose" />
            </div>
          ) : (
            <EmptyPanel>No structured history summary recorded yet.</EmptyPanel>
          )}
        </div>

        <div className="case-panel">
          <div className="case-panel-heading">
            <div>
              <p className="case-section-label">Differential</p>
              <h2>Ranked diagnosis</h2>
            </div>
            {caseRecord.currentIteration > 0 && <span className="case-iteration">Iteration {caseRecord.currentIteration}</span>}
          </div>

          {hasDiagnosticOutput ? (
            <div className="case-differential-list">
              {caseRecord.differential.map((entry) => {
                const active = selectedEntry?.rank === entry.rank;
                return (
                  <button key={`${entry.rank}-${entry.diagnosis}`} type="button" onClick={() => setSelectedRank(entry.rank)} className={active ? "active" : ""}>
                    <span className="case-rank">{entry.rank}</span>
                    <span className="case-differential-copy">
                      <strong>{entry.diagnosis}</strong>
                      {entry.classification && <small>{classificationLabels[entry.classification]}</small>}
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="case-awaiting">
              <strong>Awaiting MEDDxAgent</strong>
              <p>No ranked differential has been generated. The frontend will not substitute mock diagnoses for engine output.</p>
            </div>
          )}
        </div>
      </section>

      <section className="case-content-grid">
        <div className="case-panel">
          <div className="case-panel-heading"><div><p className="case-section-label">Patient context</p><h2>Background</h2></div></div>
          <DetailList rows={[
            ["Initial information", patient.initialInformation],
            ["Relevant medical history", patient.medicalHistory],
            ["Current medications", patient.medications],
            ["Known conditions", patient.knownConditions],
            ["Known risk factors", patient.riskFactors],
          ]} />
        </div>

        <div className="case-panel">
          <div className="case-panel-heading"><div><p className="case-section-label">Targeted history</p><h2>Questions and responses</h2></div></div>
          {workflow.historyQuestions.length > 0 ? (
            <div className="case-history-list">
              {workflow.historyQuestions.map((item, index) => (
                <div key={item.id}>
                  <span>Q{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.question || "Question not entered"}</strong>
                  <p>{item.answer || "No answer recorded"}</p>
                </div>
              ))}
            </div>
          ) : <EmptyPanel>No targeted history questions recorded.</EmptyPanel>}
        </div>
      </section>

      <section className="case-content-grid">
        <div className="case-panel">
          <div className="case-panel-heading"><div><p className="case-section-label">Physical examination</p><h2>Recorded findings</h2></div></div>
          {hasExamination ? (
            <DetailList rows={[
              ["General appearance", workflow.examination.generalAppearance],
              ["Respiratory distress", workflow.examination.respiratoryDistress],
              ["Cyanosis", workflow.examination.cyanosis],
              ["Pallor", workflow.examination.pallor],
              ["Respiratory rate", workflow.examination.respiratoryRate],
              ["Oxygen saturation", workflow.examination.oxygenSaturation],
              ["Heart rate", workflow.examination.heartRate],
              ["Blood pressure", workflow.examination.bloodPressure],
              ["Temperature", workflow.examination.temperature],
              ["Respiratory examination", workflow.examination.respiratoryExam],
              ["Cardiovascular examination", workflow.examination.cardiovascularExam],
              ["Abdominal examination", workflow.examination.abdominalExam],
              ["Neurological examination", workflow.examination.neurologicalExam],
              ["Other findings", workflow.examination.otherFindings],
            ]} />
          ) : <EmptyPanel>No examination findings recorded.</EmptyPanel>}
        </div>

        <div className="case-panel">
          <div className="case-panel-heading"><div><p className="case-section-label">Investigations</p><h2>Tests and results</h2></div></div>
          {workflow.investigations.length > 0 ? (
            <div className="case-investigation-list">
              {workflow.investigations.map((item) => (
                <div key={item.id}>
                  <div><strong>{item.name || "Unnamed investigation"}</strong><span>{item.category}</span></div>
                  {item.rationale && <p>{item.rationale}</p>}
                  {item.result && <em>{item.result}</em>}
                </div>
              ))}
            </div>
          ) : <EmptyPanel>No investigations recorded.</EmptyPanel>}
        </div>
      </section>

      {selectedEntry && (
        <section className="case-panel case-panel-wide">
          <div className="case-panel-heading"><div><p className="case-section-label">Interactive differential</p><h2>Diagnosis detail</h2></div></div>
          <DiagnosisDetail entry={selectedEntry} rationale={caseRecord.rationale} />
        </section>
      )}

      {(caseRecord.dialogueHistory.trim() || caseRecord.ragContent.trim()) && (
        <section className="case-content-grid">
          {caseRecord.dialogueHistory.trim() && (
            <div className="case-panel"><div className="case-panel-heading"><div><p className="case-section-label">Dialogue history</p><h2>Conversation record</h2></div></div><p className="case-long-copy">{caseRecord.dialogueHistory}</p></div>
          )}
          {caseRecord.ragContent.trim() && (
            <div className="case-panel"><div className="case-panel-heading"><div><p className="case-section-label">Retrieved context</p><h2>RAG content</h2></div></div><p className="case-long-copy">{caseRecord.ragContent}</p></div>
          )}
        </section>
      )}
    </div>
  );
}
