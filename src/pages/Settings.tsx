import { useState } from "react";
import { meddxApiConfigured } from "../api/meddx";
import { useCaseStore } from "../data/CaseStoreContext";

export default function Settings() {
  const { cases, loading, error, storageMode, clearCases, refresh } = useCaseStore();
  const [clearing, setClearing] = useState(false);
  const caseCount = cases.length;

  const handleExport = () => {
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

  const handleClear = async () => {
    if (caseCount === 0 || clearing) return;

    const location = storageMode === "server" ? "authenticated server workspace" : "this browser";
    const confirmed = window.confirm(
      `Remove every MEDDxAgent case from ${location}? This cannot be undone.`
    );
    if (!confirmed) return;

    setClearing(true);
    try {
      await clearCases();
    } finally {
      setClearing(false);
    }
  };

  const persistenceLabel = storageMode === "server" ? "Server" : "Local";
  const persistenceDescription =
    storageMode === "server"
      ? "Cases are configured for authenticated server-side persistence."
      : "Cases are stored in this browser. Server persistence remains disabled until authentication is connected.";

  return (
    <div className="settings-page">
      <header className="settings-heading">
        <p className="workspace-page-eyebrow">Workspace</p>
        <h1>Settings</h1>
        <p>Review runtime status and manage the configured case workspace.</p>
      </header>

      {error && (
        <div className="clinical-error" role="alert">
          <strong>Workspace synchronization needs attention.</strong>
          <span>{error}</span>
          <button type="button" onClick={() => void refresh()}>Retry</button>
        </div>
      )}

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
              <p>{persistenceDescription}</p>
            </div>
            <span className="settings-badge settings-badge-blue">{persistenceLabel}</span>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-copy">
          <h2>Workspace data</h2>
          <p>Manage the case data available in the current persistence mode.</p>
        </div>

        <div className="settings-stack">
          <div className="settings-action-card">
            <div>
              <h3>Export cases</h3>
              <p>Download {caseCount === 1 ? "1 case" : `${caseCount} cases`} as JSON.</p>
            </div>
            <button type="button" onClick={handleExport} disabled={loading || caseCount === 0} className="settings-button">
              Export JSON
            </button>
          </div>

          <div className="settings-action-card settings-action-danger">
            <div>
              <h3>Clear workspace</h3>
              <p>Permanently remove every case from the configured {storageMode === "server" ? "server" : "browser"} workspace.</p>
            </div>
            <button
              type="button"
              onClick={() => void handleClear()}
              disabled={loading || clearing || caseCount === 0}
              className="settings-button settings-button-danger"
            >
              {clearing ? "Clearing…" : "Clear cases"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
