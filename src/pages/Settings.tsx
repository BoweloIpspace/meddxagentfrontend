import { useState } from "react";
import { meddxApiConfigured } from "../api/meddx";
import { clearCases, getCases } from "../data/caseStore";

export default function Settings() {
  const [caseCount, setCaseCount] = useState(() => getCases().length);

  const handleExport = () => {
    const cases = getCases();
    if (cases.length === 0) return;

    const blob = new Blob([JSON.stringify(cases, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `meddxagent-cases-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (caseCount === 0) return;

    const confirmed = window.confirm(
      "Remove every locally stored MEDDxAgent case from this browser? This cannot be undone."
    );
    if (!confirmed) return;

    clearCases();
    setCaseCount(0);
  };

  return (
    <div className="settings-page">
      <header className="settings-heading">
        <p className="workspace-page-eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p>Only controls that are genuinely active in the current frontend are shown here.</p>
      </header>

      <section className="settings-section">
        <div className="settings-section-copy">
          <h2>Runtime</h2>
          <p>Current application state and integration status.</p>
        </div>

        <div className="settings-card">
          <div className="settings-row">
            <div>
              <h3>Diagnostic engine</h3>
              <p>
                {meddxApiConfigured
                  ? "The frontend is configured to send clinical requests to MEDDxAgent."
                  : "No frontend clinical API URL is configured."}
              </p>
            </div>
            <span className={`settings-badge ${meddxApiConfigured ? "settings-badge-connected" : ""}`}>
              {meddxApiConfigured ? "Configured" : "Not configured"}
            </span>
          </div>

          <div className="settings-row">
            <div>
              <h3>Case persistence</h3>
              <p>Case inputs are stored in this browser only.</p>
            </div>
            <span className="settings-badge settings-badge-blue">Local</span>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-copy">
          <h2>Workspace data</h2>
          <p>Manage the case data created in this browser.</p>
        </div>

        <div className="settings-stack">
          <div className="settings-action-card">
            <div>
              <h3>Export cases</h3>
              <p>Download {caseCount === 1 ? "1 local case" : `${caseCount} local cases`} as JSON.</p>
            </div>
            <button type="button" onClick={handleExport} disabled={caseCount === 0} className="settings-button">
              Export JSON
            </button>
          </div>

          <div className="settings-action-card settings-action-danger">
            <div>
              <h3>Clear local workspace</h3>
              <p>Permanently remove every locally stored case from this browser.</p>
            </div>
            <button type="button" onClick={handleClear} disabled={caseCount === 0} className="settings-button settings-button-danger">
              Clear cases
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
