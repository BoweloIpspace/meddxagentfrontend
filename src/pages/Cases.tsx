import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCases } from "../data/caseStore";
import type { CaseStatus } from "../types";

const statusStyles: Record<CaseStatus, string> = {
  draft: "border-slate-200 text-slate-500",
  ready: "border-blue-200 bg-blue-50 text-blue-700",
  active: "border-slate-300 bg-slate-50 text-slate-700",
  completed: "border-slate-200 bg-slate-50 text-slate-500",
  error: "border-rose-200 bg-rose-50 text-rose-700",
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
        caseRecord.patient.chiefComplaint.toLowerCase().includes(normalizedSearch) ||
        caseRecord.patient.knownConditions?.toLowerCase().includes(normalizedSearch) ||
        caseRecord.patient.medicalHistory?.toLowerCase().includes(normalizedSearch);
      const matchesFilter = filter === "all" || caseRecord.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [cases, filter, search]);

  return (
    <div className="app-page">
      <div className="app-page-header flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Workspace
          </p>
          <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[34px]">
            Cases
          </h1>
          <p className="mt-2 text-[13px] text-slate-400">
            {cases.length === 0 ? "No locally stored cases" : `${cases.length} locally stored ${cases.length === 1 ? "case" : "cases"}`}
          </p>
        </div>
        <Link
          to="/cases/new"
          className="button-primary button-accent inline-flex self-start rounded-xl px-5 py-3 text-[13px] font-semibold text-white sm:self-auto"
        >
          New case
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="border-t border-slate-100 py-20 text-center">
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-slate-900">
            No cases yet
          </h2>
          <p className="mx-auto mt-2 max-w-[480px] text-[13px] leading-[1.65] text-slate-400">
            Create the first case from real patient context. Only information entered in this workspace will appear here.
          </p>
          <Link
            to="/cases/new"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Create first case
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-[360px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search case or clinical context"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-300 focus:border-slate-400 focus:outline-none"
              />
            </div>

            {filters.length > 2 && (
              <div className="flex flex-wrap gap-1">
                {filters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${
                      filter === item
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {item === "all" ? "All" : statusLabels[item]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Case</th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Clinical context</th>
                    <th className="hidden px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 md:table-cell">Status</th>
                    <th className="hidden px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 lg:table-cell">Updated</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((caseRecord) => (
                    <tr key={caseRecord.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                      <td className="px-6 py-5">
                        <p className="font-mono text-[11px] text-slate-400">{caseRecord.id}</p>
                        <p className="mt-1 max-w-[340px] text-[14px] font-medium text-slate-800">
                          {caseRecord.patient.chiefComplaint || "Untitled case"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[13px] text-slate-600">
                          {caseRecord.patient.age ? `${caseRecord.patient.age}y` : "Age not entered"}
                          {caseRecord.patient.sex ? ` · ${caseRecord.patient.sex}` : ""}
                        </p>
                        <p className="mt-1 max-w-[320px] truncate text-[11px] text-slate-400">
                          {caseRecord.patient.knownConditions || caseRecord.patient.medicalHistory || "No additional background entered"}
                        </p>
                      </td>
                      <td className="hidden px-6 py-5 md:table-cell">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[caseRecord.status]}`}>
                          {statusLabels[caseRecord.status]}
                        </span>
                      </td>
                      <td className="hidden px-6 py-5 lg:table-cell">
                        <span className="text-[12px] text-slate-400">
                          {new Date(caseRecord.updatedAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              caseRecord.status === "draft"
                                ? `/case/${caseRecord.id}/edit`
                                : `/case/${caseRecord.id}`
                            )
                          }
                          className="text-[12px] font-semibold text-slate-500 transition-colors hover:text-slate-950"
                        >
                          {caseRecord.status === "draft" ? "Continue" : "Open"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-14 text-center">
                <p className="text-[13px] text-slate-400">No cases match this search.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
