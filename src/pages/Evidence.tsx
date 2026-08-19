import { Link } from "react-router-dom";
import { getCases } from "../data/caseStore";

export default function Evidence() {
  const casesWithEvidence = getCases().filter((caseRecord) => caseRecord.ragContent.trim());

  return (
    <div className="app-page max-w-[900px]">
      <div className="app-page-header">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Diagnostic output
        </p>
        <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[34px]">
          Retrieved context
        </h1>
        <p className="mt-3 max-w-[620px] text-[14px] leading-[1.7] text-slate-500">
          This view only displays retrieval content returned by the diagnostic engine. Nothing is seeded or synthesized by the frontend.
        </p>
      </div>

      {casesWithEvidence.length === 0 ? (
        <div className="border-t border-slate-100 py-16 text-center">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">
            No retrieved context yet
          </h2>
          <p className="mx-auto mt-2 max-w-[500px] text-[13px] leading-[1.65] text-slate-400">
            Evidence will appear here after a real case has been processed by the connected diagnostic engine.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/cases" className="rounded-xl bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white">
              View cases
            </Link>
            <Link to="/cases/new" className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600">
              New case
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 border-t border-slate-100 pt-8">
          {casesWithEvidence.map((caseRecord) => (
            <article key={caseRecord.id} className="rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] text-slate-400">{caseRecord.id}</p>
                  <h2 className="mt-2 text-[16px] font-semibold text-slate-900">
                    {caseRecord.patient.chiefComplaint || "Untitled case"}
                  </h2>
                </div>
                <Link to={`/case/${caseRecord.id}`} className="text-[12px] font-semibold text-slate-500 hover:text-slate-950">
                  Open case
                </Link>
              </div>
              <p className="mt-5 whitespace-pre-wrap text-[13px] leading-[1.75] text-slate-600">
                {caseRecord.ragContent}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
