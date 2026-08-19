import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { caseHistory } from "../data/mockData";
import type { CaseStatus } from "../types";

const statusStyles: Record<CaseStatus, string> = {
  active: "bg-neutral-900 text-white",
  completed: "bg-neutral-100 text-neutral-600",
  draft: "bg-neutral-50 text-neutral-400 border border-neutral-200",
};

export default function Cases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CaseStatus | "all">("all");

  const filtered = caseHistory.filter((c) => {
    const matchesSearch =
      search === "" ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.patient.chiefComplaint.toLowerCase().includes(search.toLowerCase()) ||
      c.patient.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app-page">
      {/* Header */}
      <div className="app-page-header flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-2">
            Cases
          </h1>
          <p className="text-[14px] text-neutral-400">
            {caseHistory.length} diagnostic cases
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/cases/new")}
          className="button-primary px-5 py-2 rounded-lg bg-neutral-900 text-white text-[13px] font-medium self-start sm:self-auto"
        >
          New case
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-5 mb-14">
        <div className="relative flex-1 max-w-[360px]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases..."
            className="w-full pl-9 pr-4 py-2 text-[14px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "active", "completed", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                filter === f
                  ? "text-neutral-900 bg-neutral-50"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="px-8 py-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">
                  Patient
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Chief complaint
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">
                  Updated
                </th>
                <th className="px-8 py-4 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden xl:table-cell">
                  Top differential
                </th>
                <th className="px-8 py-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/40 transition-colors"
                >
                  <td className="px-8 py-6">
                    <span className="text-[13px] font-mono text-neutral-500">{c.id}</span>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell">
                    <span className="text-[14px] text-neutral-700">
                      {c.patient.age}y {c.patient.sex}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[14px] text-neutral-600 line-clamp-1 max-w-[280px]">
                      {c.patient.chiefComplaint}
                    </span>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[c.status]}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <span className="text-[13px] text-neutral-400">
                      {new Date(c.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-8 py-6 hidden xl:table-cell">
                    <span className="text-[13px] text-neutral-500">
                      {c.differential[0]?.diagnosis ?? "—"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      type="button"
                      onClick={() => navigate(`/case/${c.id}`)}
                      className="text-[13px] text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[14px] text-neutral-300">No cases match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
