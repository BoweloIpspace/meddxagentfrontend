import { useState } from "react";
import { caseHistory } from "../data/mockData";

type SettingsTab = "account" | "engine" | "evidence" | "privacy" | "interface";

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "engine", label: "Diagnostic Engine" },
  { id: "evidence", label: "Evidence" },
  { id: "privacy", label: "Privacy" },
  { id: "interface", label: "Interface" },
];

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
    <div className="flex items-start justify-between gap-8 py-5">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-slate-900">{label}</p>
        {description && (
          <p className="mt-1 max-w-[390px] text-[12px] leading-[1.55] text-slate-400">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${
          checked ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`mt-[2px] inline-block h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-[2px]"
          }`}
        />
      </button>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-100 pb-10 last:border-0 last:pb-0">
      <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-slate-900">{title}</h3>
      <p className="mt-1 max-w-[520px] text-[13px] leading-[1.6] text-slate-400">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function AccountTab() {
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="space-y-10">
      <Section
        title="Profile"
        description="Personal information and institutional affiliation for this prototype workspace."
      >
        <form onSubmit={handleSave} className="max-w-[560px] space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">First name</label>
              <input type="text" defaultValue="Alex" className="field-control" />
            </div>
            <div>
              <label className="field-label">Last name</label>
              <input type="text" defaultValue="Morgan" className="field-control" />
            </div>
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" defaultValue="alex.morgan@institution.edu" className="field-control" />
          </div>
          <div>
            <label className="field-label">Institution / Organization</label>
            <input type="text" defaultValue="Johns Hopkins Medicine" className="field-control" />
          </div>
          <div>
            <label className="field-label">Professional role</label>
            <select className="field-control appearance-none">
              <option>Clinician</option>
              <option>Medical Researcher</option>
              <option>Clinical AI Engineer</option>
              <option>Academic</option>
              <option>Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="button-primary rounded-xl bg-slate-900 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            {saved ? "Saved ✓" : "Save changes"}
          </button>
        </form>
      </Section>

      <Section title="Security" description="Local prototype controls for account security preferences.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle
            checked={twoFactor}
            onChange={() => setTwoFactor((value) => !value)}
            label="Two-factor authentication"
            description={twoFactor ? "Two-factor authentication is enabled in this prototype UI." : "Add an extra layer of security to your account."}
          />
        </div>
      </Section>
    </div>
  );
}

function EngineTab() {
  const [mode, setMode] = useState<"interactive" | "automated">("interactive");
  const [maxIterations, setMaxIterations] = useState("5");
  const [preferences, setPreferences] = useState({
    autoQuestions: true,
    physicianIntervention: false,
    pubmed: true,
    wikipedia: true,
    guidelines: false,
  });

  const toggle = (key: keyof typeof preferences) =>
    setPreferences((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="space-y-10">
      <Section title="Diagnostic mode" description="Choose how the prototype presents the diagnostic workflow.">
        <div className="grid max-w-[620px] gap-3 sm:grid-cols-2">
          {[
            { id: "interactive" as const, label: "Interactive", description: "Review the workflow one step at a time." },
            { id: "automated" as const, label: "Automated", description: "Present the workflow as a continuous run." },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === item.id
                  ? "border-blue-200 bg-blue-50/60"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-slate-900">{item.label}</p>
                  <p className="mt-1 text-[12px] leading-[1.55] text-slate-400">{item.description}</p>
                </div>
                <span className={`mt-0.5 h-3 w-3 rounded-full border ${mode === item.id ? "border-blue-600 bg-blue-600" : "border-slate-300"}`} />
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Iteration display" description="Set the maximum iteration count shown in the prototype controls.">
        <div className="max-w-[260px]">
          <label className="field-label">Maximum iterations</label>
          <select
            value={maxIterations}
            onChange={(event) => setMaxIterations(event.target.value)}
            className="field-control appearance-none"
          >
            {[3, 5, 7, 10].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </Section>

      <Section title="History taking" description="Control local prototype preferences for the history-taking interface.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle
            checked={preferences.autoQuestions}
            onChange={() => toggle("autoQuestions")}
            label="Auto-generate questions"
            description="Show automatically generated targeted clinical questions."
          />
          <Toggle
            checked={preferences.physicianIntervention}
            onChange={() => toggle("physicianIntervention")}
            label="Allow physician intervention"
            description="Allow custom questions to be added during history taking."
          />
        </div>
      </Section>

      <Section title="Knowledge retrieval" description="Choose which source labels are enabled in the prototype evidence UI.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle checked={preferences.pubmed} onChange={() => toggle("pubmed")} label="PubMed" />
          <Toggle checked={preferences.wikipedia} onChange={() => toggle("wikipedia")} label="Wikipedia" />
          <Toggle checked={preferences.guidelines} onChange={() => toggle("guidelines")} label="Clinical guidelines" />
        </div>
      </Section>
    </div>
  );
}

function EvidenceTab() {
  const [sources, setSources] = useState({ pubmed: true, wikipedia: true, guidelines: false });
  const [filters, setFilters] = useState({ relevance: true, sourceLinks: false });

  const toggleSource = (key: keyof typeof sources) =>
    setSources((current) => ({ ...current, [key]: !current[key] }));
  const toggleFilter = (key: keyof typeof filters) =>
    setFilters((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="space-y-10">
      <Section title="Evidence sources" description="Local display preferences for source types in the prototype evidence view.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle checked={sources.pubmed} onChange={() => toggleSource("pubmed")} label="PubMed" />
          <Toggle checked={sources.wikipedia} onChange={() => toggleSource("wikipedia")} label="Wikipedia" />
          <Toggle checked={sources.guidelines} onChange={() => toggleSource("guidelines")} label="Clinical guidelines" />
        </div>
      </Section>

      <Section title="Evidence display" description="Adjust how evidence is presented in this frontend prototype.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle
            checked={filters.relevance}
            onChange={() => toggleFilter("relevance")}
            label="Relevance filtering"
            description="Prefer higher-relevance evidence in the interface."
          />
          <Toggle
            checked={filters.sourceLinks}
            onChange={() => toggleFilter("sourceLinks")}
            label="Show source links"
            description="Show source-link affordances when source URLs are available."
          />
        </div>
      </Section>
    </div>
  );
}

function PrivacyTab() {
  const [privacy, setPrivacy] = useState({ analytics: true, research: false, dataSharing: false });
  const [retention, setRetention] = useState("90 days");
  const [exported, setExported] = useState(false);

  const toggle = (key: keyof typeof privacy) =>
    setPrivacy((current) => ({ ...current, [key]: !current[key] }));

  const handleExport = () => {
    const payload = JSON.stringify(caseHistory, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "meddxagent-cases.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 1600);
  };

  return (
    <div className="space-y-10">
      <Section title="Data handling" description="Local prototype preferences for data-handling controls.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle checked={privacy.analytics} onChange={() => toggle("analytics")} label="Usage analytics" />
          <Toggle checked={privacy.research} onChange={() => toggle("research")} label="Research data participation" />
          <Toggle checked={privacy.dataSharing} onChange={() => toggle("dataSharing")} label="Third-party data sharing" />
        </div>
      </Section>

      <Section title="Case retention" description="Choose the retention preference shown by the prototype.">
        <div className="max-w-[260px]">
          <label className="field-label">Retention period</label>
          <select value={retention} onChange={(event) => setRetention(event.target.value)} className="field-control appearance-none">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
            <option>Indefinite</option>
          </select>
        </div>
      </Section>

      <Section title="Export data" description="Download the current frontend mock case data as JSON.">
        <button
          type="button"
          onClick={handleExport}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          {exported ? "Exported ✓" : "Export cases (JSON)"}
        </button>
      </Section>
    </div>
  );
}

function InterfaceTab() {
  const [appearance, setAppearance] = useState<"system" | "light" | "dark">("light");
  const [display, setDisplay] = useState({ compact: false, timestamps: true, confidenceBars: true });
  const [notifications, setNotifications] = useState({ caseUpdates: true, systemAlerts: false });

  const toggleDisplay = (key: keyof typeof display) =>
    setDisplay((current) => ({ ...current, [key]: !current[key] }));
  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="space-y-10">
      <Section title="Appearance" description="Choose the appearance preference shown in the prototype UI.">
        <div className="grid max-w-[620px] gap-3 sm:grid-cols-3">
          {[
            { id: "system" as const, label: "System" },
            { id: "light" as const, label: "Light" },
            { id: "dark" as const, label: "Dark" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAppearance(item.id)}
              className={`rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition-colors ${
                appearance === item.id
                  ? "border-blue-200 bg-blue-50/60 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Display" description="Adjust local display preferences for this frontend prototype.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle checked={display.compact} onChange={() => toggleDisplay("compact")} label="Compact mode" />
          <Toggle checked={display.timestamps} onChange={() => toggleDisplay("timestamps")} label="Show activity timestamps" />
          <Toggle checked={display.confidenceBars} onChange={() => toggleDisplay("confidenceBars")} label="Show confidence bars" />
        </div>
      </Section>

      <Section title="Notifications" description="Control the notification preferences shown in the prototype.">
        <div className="max-w-[560px] divide-y divide-slate-100 border-y border-slate-100">
          <Toggle checked={notifications.caseUpdates} onChange={() => toggleNotification("caseUpdates")} label="Case updates" />
          <Toggle checked={notifications.systemAlerts} onChange={() => toggleNotification("systemAlerts")} label="System alerts" />
        </div>
      </Section>
    </div>
  );
}

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
      <div className="app-page-header">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-blue-600">Workspace</p>
        <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-slate-950">Settings</h1>
        <p className="mt-2 max-w-[520px] text-[13px] leading-[1.6] text-slate-400">
          Prototype preferences are kept local to this frontend session.
        </p>
      </div>

      <div className="flex flex-col gap-9 lg:flex-row lg:gap-16">
        <nav className="hidden w-[190px] shrink-0 lg:block">
          <div className="sticky top-24 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="overflow-x-auto lg:hidden">
          <div className="flex min-w-max gap-1 border-b border-slate-100 pb-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${
                  activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 max-w-[760px]">{tabContent[activeTab]}</div>
      </div>
    </div>
  );
}
