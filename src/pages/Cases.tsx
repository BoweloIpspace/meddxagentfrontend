import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCases } from "../data/caseStore";
import type { CaseStatus } from "../types";

const statusLabels: Record<CaseStatus, string> = {
  draft: "Draft",
  ready: "Ready",
  active: "In progress",
  completed: "Completed",
  error: "Needs attention",
};

export default function Cases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const cases = getCases();

  const availableStatuses = Array.from(new Set(cases.map((caseRecord) => caseRecord.status)));
  const filters: Array<CaseStatus | "all"> = ["all", ...availableStatuses];

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return cases.filter((caseRecord) => {
      const matchesSearch =
        normalizedSearch === "" ||
        caseRecord.id.toLowerCase().includes(normalizedSearch) ||
        caseRecord.patient.chiefComplaint.toLowerCase().includes(normalizedSearch) ||
        caseRecord.patient.knownConditions?.toLowerCase().includes(normalizedSearch) ||
        caseRecord.patient.medicalHistory?.toLowerCase().includes(normalizedSearch);
      const matchesFilter = filter === "all" || caseRecord.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [cases, filter, search]);

  return (
    <div className="workspace-cases-page">
      <section className="workspace-page-heading">
        <div>
          <p className="workspace-page-eyebrow">Cases</p>
          <h1>Case workspace</h1>
          <p>
            Review locally stored consultations and continue drafts without mixing entered clinical
            data with MEDDxAgent-generated output.
          </p>
        </div>
        <Link to="/cases/new" className="workspace-primary-action">
          New consultation
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {cases.length === 0 ? (
        <section className="workspace-panel workspace-cases-empty">
          <div className="workspace-empty-icon" aria-hidden="true">+</div>
          <h2>No cases yet</h2>
          <p>Create your first consultation to begin a case in this workspace.</p>
          <Link to="/cases/new" className="workspace-primary-action workspace-primary-action-compact">
            Start consultation
          </Link>
        </section>
      ) : (
        <>
          <section className="workspace-cases-toolbar">
            <label className="workspace-search-control">
              <span className="workspace-search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search case or clinical context"
              />
            </label>

            <div className="workspace-filter-row" aria-label="Filter cases by status">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={filter === item ? "active" : ""}
                >
                  {item === "all" ? "All" : statusLabels[item]}
                </button>
              ))}
            </div>
          </section>

          <section className="workspace-panel workspace-case-list-panel">
            <div className="workspace-case-list-heading">
              <div>
                <p className="workspace-panel-eyebrow">Stored cases</p>
                <h2>{filtered.length} {filtered.length === 1 ? "case" : "cases"}</h2>
              </div>
              <span>{cases.length} total</span>
            </div>

            <div className="workspace-case-list">
              {filtered.map((caseRecord) => (
                <article key={caseRecord.id} className="workspace-case-row">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        caseRecord.status === "draft"
                          ? `/case/${caseRecord.id}/edit`
                          : `/case/${caseRecord.id}`
                      )
                    }
                    className="workspace-case-row-main"
                  >
                    <div className="workspace-case-row-copy">
                      <div className="workspace-case-row-topline">
                        <span className="workspace-case-id">{caseRecord.id}</span>
                        <span className={`workspace-status-pill workspace-status-${caseRecord.status}`}>
                          {statusLabels[caseRecord.status]}
                        </span>
                      </div>
                      <h3>{caseRecord.patient.chiefComplaint || "Untitled case"}</h3>
                      <p>
                        {caseRecord.patient.age ? `${caseRecord.patient.age}y` : "Age not entered"}
                        {caseRecord.patient.sex ? ` · ${caseRecord.patient.sex}` : ""}
                        {(caseRecord.patient.knownConditions || caseRecord.patient.medicalHistory)
                          ? ` · ${caseRecord.patient.knownConditions || caseRecord.patient.medicalHistory}`
                          : ""}
                      </p>
                    </div>

                    <div className="workspace-case-row-meta">
                      <span>{new Date(caseRecord.updatedAt).toLocaleString()}</span>
                      <strong>{caseRecord.status === "draft" ? "Continue" : "Open"} →</strong>
                    </div>
                  </button>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="workspace-case-search-empty">
                <p>No cases match this search or filter.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
