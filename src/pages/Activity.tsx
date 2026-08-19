import { Link } from "react-router-dom";
import { getCases } from "../data/caseStore";

export default function Activity() {
  const casesWithDialogue = getCases().filter((caseRecord) => caseRecord.dialogueHistory.trim());

  return (
    <div className="app-page max-w-[900px]">
      <div className="app-page-header">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Diagnostic output
        </p>
        <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[34px]">
          Dialogue history
        </h1>
        <p className="mt-3 max-w-[620px] text-[14px] leading-[1.7] text-slate-500">
          This view only displays dialogue returned by the diagnostic workflow. The frontend does not generate patient or clinician exchanges.
        </p>
      </div>

      {casesWithDialogue.length === 0 ? (
        <div className="border-t border-slate-100 py-16 text-center">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">
            No dialogue history yet
          </h2>
          <p className="mx-auto mt-2 max-w-[500px] text-[13px] leading-[1.65] text-slate-400">
            History-taking output will appear here only after a real case has been processed by the connected engine.
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
          {casesWithDialogue.map((caseRecord) => (
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
              <pre className="mt-5 whitespace-pre-wrap font-sans text-[13px] leading-[1.75] text-slate-600">
                {caseRecord.dialogueHistory}
              </pre>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
