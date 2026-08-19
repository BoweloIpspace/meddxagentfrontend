import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCases } from "../data/caseStore";
import type { CaseStatus } from "../types";

const statusStyles: Record<CaseStatus, string> = {
  draft: "border-neutral-300 text-neutral-600",
  ready: "border-neutral-950 bg-neutral-950 text-white",
  active: "border-neutral-400 text-neutral-800",
  completed: "border-neutral-300 text-neutral-500",
  error: "border-neutral-950 text-neutral-950",
};

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
        caseRecord.patient.id.toLowerCase().includes(normalizedSearch) ||
        caseRecord.patient.chiefComplaint.toLowerCase().includes(normalizedSearch);
      const matchesFilter = filter === "all" || caseRecord.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [cases, filter, search]);

  return (
    <div className="app-page">
      <div className="app-page-header grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
            Workspace
          </p>
          <h1 className="text-[38px] font-medium leading-[1.03] tracking-[-0.05em] text-neutral-950 sm:text-[48px]">
            Cases
          </h1>
          <p className="mt-4 text-[13px] text-neutral-500">
            {cases.length === 0
              ? "No locally stored cases"
              : `${cases.length} locally stored ${cases.length === 1 ? "case" : "cases"}`}
          </p>
        </div>
        <Link
          to="/cases/new"
          className="button-primary inline-flex self-start rounded-full px-5 py-3 text-[13px] font-medium text-white sm:self-auto"
        >
          New case
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="border-t border-neutral-300 py-20">
          <div className="max-w-[620px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
              Empty workspace
            </p>
            <h2 className="mt-5 text-[30px] font-medium tracking-[-0.04em] text-neutral-950">
              No cases yet.
            </h2>
            <p className="mt-4 max-w-[520px] text-[14px] leading-[1.7] text-neutral-600">
              Create the first case from real patient context. Only information entered here will appear in the workspace.
            </p>
            <Link
              to="/cases/new"
              className="button-primary mt-7 inline-flex rounded-full px-4 py-2.5 text-[13px] font-medium text-white"
            >
              Create first case
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-10 flex flex-col gap-5 border-t border-neutral-300 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-[360px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search case or patient ID"
                className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-4 text-[13px] text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none"
              />
            </div>

            {filters.length > 2 && (
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {filters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`border-b py-1 text-[12px] font-medium transition-colors ${
                      filter === item
                        ? "border-neutral-950 text-neutral-950"
                        : "border-transparent text-neutral-500 hover:text-neutral-950"
                    }`}
                  >
                    {item === "all" ? "All" : statusLabels[item]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-x-auto border-y border-neutral-300">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-0 py-4 pr-6 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">Case</th>
                  <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">Patient</th>
                  <th className="hidden px-6 py-4 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500 md:table-cell">Status</th>
                  <th className="hidden px-6 py-4 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500 lg:table-cell">Updated</th>
                  <th className="py-4 pl-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((caseRecord) => (
                  <tr key={caseRecord.id} className="border-b border-neutral-200 last:border-0">
                    <td className="px-0 py-6 pr-6">
                      <p className="font-mono text-[10px] text-neutral-500">{caseRecord.id}</p>
                      <p className="mt-2 max-w-[360px] text-[15px] font-medium text-neutral-900">
                        {caseRecord.patient.chiefComplaint || "Untitled case"}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-[13px] text-neutral-700">{caseRecord.patient.id || "No patient ID"}</p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {caseRecord.patient.age ? `${caseRecord.patient.age}y` : "Age not entered"}
                        {caseRecord.patient.sex ? ` · ${caseRecord.patient.sex}` : ""}
                      </p>
                    </td>
                    <td className="hidden px-6 py-6 md:table-cell">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[caseRecord.status]}`}>
                        {statusLabels[caseRecord.status]}
                      </span>
                    </td>
                    <td className="hidden px-6 py-6 lg:table-cell">
                      <span className="text-[11px] text-neutral-500">
                        {new Date(caseRecord.updatedAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-6 pl-6 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            caseRecord.status === "draft"
                              ? `/case/${caseRecord.id}/edit`
                              : `/case/${caseRecord.id}`
                          )
                        }
                        className="text-[12px] font-medium text-neutral-600 transition-colors hover:text-neutral-950"
                      >
                        {caseRecord.status === "draft" ? "Continue →" : "Open →"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-14 text-center">
                <p className="text-[13px] text-neutral-500">No cases match this search.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
