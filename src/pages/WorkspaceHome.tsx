import { Link } from "react-router-dom";
import { meddxApiConfigured } from "../api/meddx";
import { useCaseStore } from "../data/CaseStoreContext";

const statusLabel = {
  draft: "Draft",
  ready: "Ready",
  active: "In progress",
  completed: "Completed",
  error: "Needs attention",
} as const;

export default function WorkspaceHome() {
  const { cases, loading, error, storageMode } = useCaseStore();
  const latestCase = cases[0];
  const readyCount = cases.filter((caseRecord) => caseRecord.status === "ready").length;
  const draftCount = cases.filter((caseRecord) => caseRecord.status === "draft").length;
  const storageDescription =
    storageMode === "server" ? "Authenticated server workspace" : "Stored on this device";

  return (
    <div className="workspace-overview-page">
      <section className="workspace-page-heading">
        <div>
          <p className="workspace-page-eyebrow">Overview</p>
          <h1>Clinical workspace</h1>
          <p>
            Create structured consultations, review saved cases, and keep MEDDxAgent output
            separate from information entered by the clinician.
          </p>
        </div>
        <Link to="/cases/new" className="workspace-primary-action">
          New consultation
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {error && (
        <section className="clinical-error" role="alert">
          <strong>Case workspace could not synchronize.</strong>
          <span>{error}</span>
        </section>
      )}

      <section className="workspace-metric-grid" aria-label="Workspace summary" aria-busy={loading}>
        <article className="workspace-metric-card">
          <span>Total cases</span>
          <strong>{loading ? "—" : cases.length}</strong>
          <p>{storageDescription}</p>
        </article>
        <article className="workspace-metric-card">
          <span>Ready</span>
          <strong>{loading ? "—" : readyCount}</strong>
          <p>Consultations ready for review</p>
        </article>
        <article className="workspace-metric-card">
          <span>Drafts</span>
          <strong>{loading ? "—" : draftCount}</strong>
          <p>Consultations still in progress</p>
        </article>
      </section>

      <section className="workspace-overview-grid">
        <div className="workspace-panel">
          <div className="workspace-panel-heading">
            <div>
              <p className="workspace-panel-eyebrow">Recent case</p>
              <h2>
                {loading ? "Loading workspace…" : latestCase ? "Continue where you left off" : "No cases yet"}
              </h2>
            </div>
            {latestCase && <span className="workspace-status-pill">{statusLabel[latestCase.status]}</span>}
          </div>

          {loading ? (
            <div className="workspace-empty-panel" role="status" aria-live="polite">
              <p>Loading saved consultations…</p>
            </div>
          ) : latestCase ? (
            <div className="workspace-latest-case">
              <div className="workspace-case-id">{latestCase.id}</div>
              <h3>{latestCase.patient.chiefComplaint || "Untitled case"}</h3>
              <p className="workspace-case-meta">
                {latestCase.patient.age ? `${latestCase.patient.age}y` : "Age not entered"}
                {latestCase.patient.sex ? ` · ${latestCase.patient.sex}` : ""}
              </p>
              <p className="workspace-case-updated">
                Updated {new Date(latestCase.updatedAt).toLocaleString()}
              </p>

              <div className="workspace-panel-actions">
                <Link
                  to={latestCase.status === "draft" ? `/case/${latestCase.id}/edit` : `/case/${latestCase.id}`}
                  className="workspace-primary-action workspace-primary-action-compact"
                >
                  {latestCase.status === "draft" ? "Continue draft" : "Open case"}
                </Link>
                <Link to="/cases" className="workspace-secondary-action">
                  View all cases
                </Link>
              </div>
            </div>
          ) : (
            <div className="workspace-empty-panel">
              <div className="workspace-empty-icon" aria-hidden="true">+</div>
              <h3>Create your first consultation</h3>
              <p>Only clinical information entered in this workspace will appear here.</p>
              <Link to="/cases/new" className="workspace-primary-action workspace-primary-action-compact">
                Start consultation
              </Link>
            </div>
          )}
        </div>

        <aside className="workspace-panel workspace-guidance-panel">
          <div className="workspace-panel-heading">
            <div>
              <p className="workspace-panel-eyebrow">System status</p>
              <h2>MEDDxAgent integration</h2>
            </div>
          </div>

          <div className={`workspace-system-status ${meddxApiConfigured ? "workspace-system-status-connected" : "workspace-system-status-warning"}`}>
            <span className="workspace-system-dot" />
            <div>
              <strong>{meddxApiConfigured ? "Clinical API configured" : "Clinical API not configured"}</strong>
              <p>
                {meddxApiConfigured
                  ? "History, evidence retrieval and differential requests are routed to the MEDDxAgent backend."
                  : "Configure the MEDDxAgent backend URL before running the clinical engine."}
              </p>
            </div>
          </div>

          <div className="workspace-guidance-copy">
            <p>
              {storageMode === "server"
                ? "Cases are configured for authenticated server persistence. Clinician-entered data remains separate from engine-generated output."
                : "Cases remain in browser storage until authenticated server persistence is enabled."}
            </p>
          </div>

          <Link to="/cases/new" className="workspace-text-link">
            Open consultation workflow <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>
    </div>
  );
}
