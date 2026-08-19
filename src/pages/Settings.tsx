import { useState } from "react";

type SettingsTab = "account" | "engine" | "evidence" | "privacy" | "interface";

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "engine", label: "Diagnostic Engine" },
  { id: "evidence", label: "Evidence" },
  { id: "privacy", label: "Privacy" },
  { id: "interface", label: "Interface" },
];

/* ── Shared toggle component ── */
function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-8 py-6">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-neutral-900">{label}</p>
        {description && (
          <p className="text-[13px] text-neutral-400 mt-0.5 leading-[1.5]">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 ${
          checked ? "bg-neutral-900" : "bg-neutral-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
            checked ? "translate-x-[22px]" : "translate-x-[2px]"
          } mt-[2px]`}
        />
      </button>
    </div>
  );
}

/* ── Account Tab ── */
function AccountTab() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-16">
      <div>
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Profile
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Your personal information and institutional affiliation.
        </p>

        <form onSubmit={handleSave} className="space-y-6 max-w-[520px]">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
                First name
              </label>
              <input
                type="text"
                defaultValue="Alex"
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
                Last name
              </label>
              <input
                type="text"
                defaultValue="Morgan"
                className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              defaultValue="alex.morgan@institution.edu"
              className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              Institution / Organization
            </label>
            <input
              type="text"
              defaultValue="Johns Hopkins Medicine"
              className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              Professional role
            </label>
            <select className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors appearance-none">
              <option>Clinician</option>
              <option>Medical Researcher</option>
              <option>Clinical AI Engineer</option>
              <option>Academic</option>
              <option>Other</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="button-primary px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-[14px] font-medium"
            >
              {saved ? "Saved ✓" : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Security */}
      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Security
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Manage your password and authentication methods.
        </p>

        <div className="space-y-5 max-w-[520px]">
          <div>
            <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              defaultValue="••••••••"
              className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-[14px] font-medium text-neutral-900">
                Two-factor authentication
              </p>
              <p className="text-[13px] text-neutral-400 mt-0.5">
                Add an extra layer of security to your account.
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-1.5 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Diagnostic Engine Tab ── */
function EngineTab() {
  const [mode, setMode] = useState<"interactive" | "automated">("interactive");
  const [maxIterations, setMaxIterations] = useState("5");

  return (
    <div className="space-y-16">
      <div>
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Diagnostic mode
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Configure how the DDxDriver orchestrates the diagnostic pipeline.
        </p>

        <div className="space-y-3 max-w-[480px]">
          {[
            { id: "interactive" as const, label: "Interactive", description: "Physician reviews each iteration before proceeding." },
            { id: "automated" as const, label: "Automated", description: "Engine runs through iterations without manual review." },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-lg border transition-colors text-left ${
                mode === m.id
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div>
                <p className="text-[14px] font-medium text-neutral-900">{m.label}</p>
                <p className="text-[13px] text-neutral-400 mt-0.5">{m.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  mode === m.id ? "border-neutral-900" : "border-neutral-300"
                }`}
              >
                {mode === m.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Iteration limits
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Control the maximum number of diagnostic iterations per case.
        </p>

        <div className="max-w-[480px] space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              Maximum iterations
            </label>
            <select
              value={maxIterations}
              onChange={(e) => setMaxIterations(e.target.value)}
              className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors appearance-none"
            >
              {[3, 5, 7, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          History-taking settings
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Configure how the history-taking agent gathers patient information.
        </p>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 max-w-[480px]">
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Auto-generate questions"
            description="Automatically generate targeted clinical questions based on the current differential."
          />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Allow physician intervention"
            description="Allow the physician to add custom questions during history-taking."
          />
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Knowledge retrieval
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Configure which sources the retrieval agent queries.
        </p>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 max-w-[480px]">
          <Toggle
            checked={true}
            onChange={() => {}}
            label="PubMed"
            description="Search biomedical literature from PubMed."
          />
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Wikipedia"
            description="Retrieve general medical knowledge from Wikipedia."
          />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Clinical guidelines"
            description="Search clinical practice guidelines from major medical organizations."
          />
        </div>
      </div>
    </div>
  );
}

/* ── Evidence Tab ── */
function EvidenceTab() {
  return (
    <div className="space-y-16">
      <div>
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Evidence sources
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Manage which knowledge sources are available for evidence retrieval.
        </p>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 max-w-[480px]">
          <Toggle
            checked={true}
            onChange={() => {}}
            label="PubMed"
            description="Biomedical literature database. Primary source for clinical evidence."
          />
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Wikipedia"
            description="General medical knowledge base. Useful for background context."
          />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Cochrane Library"
            description="Systematic reviews and meta-analyses."
          />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="UpToDate"
            description="Clinical decision support resource (requires subscription)."
          />
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Retrieval settings
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Fine-tune how evidence is retrieved and presented.
        </p>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 max-w-[480px]">
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Relevance filtering"
            description="Only show evidence with high relevance to the current differential."
          />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Show source links"
            description="Display clickable links to original sources in the evidence view."
          />
        </div>
      </div>
    </div>
  );
}

/* ── Privacy Tab ── */
function PrivacyTab() {
  const [privacy, setPrivacy] = useState({
    analytics: true,
    research: false,
    dataSharing: false,
  });

  const toggle = (key: keyof typeof privacy) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-16">
      <div>
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Data handling
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Manage how your case data is handled and retained.
        </p>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 max-w-[480px]">
          <Toggle
            checked={privacy.analytics}
            onChange={() => toggle("analytics")}
            label="Usage analytics"
            description="Help improve MEDDxAgent by sharing anonymous usage data."
          />
          <Toggle
            checked={privacy.research}
            onChange={() => toggle("research")}
            label="Research data participation"
            description="Contribute de-identified case data to clinical AI research."
          />
          <Toggle
            checked={privacy.dataSharing}
            onChange={() => toggle("dataSharing")}
            label="Third-party data sharing"
            description="Allow sharing of anonymized data with research partners."
          />
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Case retention
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Control how long diagnostic cases are stored.
        </p>

        <div className="max-w-[480px]">
          <label className="block text-[13px] font-medium text-neutral-500 mb-1.5">
            Retention period
          </label>
          <select className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors appearance-none">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
            <option>Indefinite</option>
          </select>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Export data
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Download your case data for external use.
        </p>

        <button
          type="button"
          className="px-5 py-2.5 text-[13px] font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
        >
          Export all cases (JSON)
        </button>
      </div>
    </div>
  );
}

/* ── Interface Tab ── */
function InterfaceTab() {
  const [compact, setCompact] = useState(false);

  return (
    <div className="space-y-16">
      <div>
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Appearance
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Customize how MEDDxAgent looks on your device.
        </p>

        <div className="space-y-3 max-w-[400px]">
          {[
            { id: "system" as const, label: "System", description: "Follow your device settings" },
            { id: "light" as const, label: "Light", description: "Always use light theme" },
            { id: "dark" as const, label: "Dark", description: "Always use dark theme" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`w-full flex items-center justify-between px-5 py-4 rounded-lg border transition-colors text-left ${
                t.id === "light"
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div>
                <p className="text-[14px] font-medium text-neutral-900">{t.label}</p>
                <p className="text-[13px] text-neutral-400 mt-0.5">{t.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  t.id === "light" ? "border-neutral-900" : "border-neutral-300"
                }`}
              >
                {t.id === "light" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Display
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Adjust the density and layout of the interface.
        </p>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 max-w-[480px]">
          <Toggle
            checked={compact}
            onChange={() => setCompact(!compact)}
            label="Compact mode"
            description="Reduce spacing and padding for a denser layout."
          />
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Show activity timestamps"
            description="Display time stamps in the activity timeline."
          />
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Show confidence bars"
            description="Display visual confidence indicators in the differential."
          />
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-16">
        <h3 className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em] mb-1">
          Notifications
        </h3>
        <p className="text-[14px] text-neutral-400 mb-6">
          Control in-app notification preferences.
        </p>

        <div className="divide-y divide-neutral-100 border-t border-neutral-100 max-w-[480px]">
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Case updates"
            description="Notify when a diagnostic iteration completes."
          />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="System alerts"
            description="Notify about system maintenance and updates."
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main Settings Component ── */
export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  const tabContent: Record<SettingsTab, React.ReactNode> = {
    account: <AccountTab />,
    engine: <EngineTab />,
    evidence: <EvidenceTab />,
    privacy: <PrivacyTab />,
    interface: <InterfaceTab />,
  };

  return (
    <div className="app-page">
      {/* Title */}
      <div className="app-page-header">
        <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-2">
          Settings
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-28">
        {/* Sidebar nav — desktop */}
        <nav className="hidden lg:block w-[220px] shrink-0">
          <div className="sticky top-24 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[14px] transition-colors ${
                  activeTab === tab.id
                    ? "text-neutral-900 font-medium bg-neutral-50"
                    : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile tab selector */}
        <div className="lg:hidden -mx-8 px-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-neutral-900 bg-neutral-100"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
