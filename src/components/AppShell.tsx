import { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";

const navItems = [
  { path: "/cases/new", label: "New Case" },
  { path: "/cases", label: "Cases" },
  { path: "/app", label: "Diagnosis" },
  { path: "/evidence", label: "Evidence" },
  { path: "/activity", label: "Activity" },
  { path: "/settings", label: "Settings" },
];

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = navItems.find(
    (item) => item.path === location.pathname || location.pathname.startsWith(item.path + "/")
  )?.path ?? location.pathname;

  return (
    <div className="workspace-shell">
      <header className="workspace-header sticky top-0 z-50">
        <div className="app-container">
          <div className="flex h-[68px] items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <span className="brand-mark">M</span>
              <span className="text-[14px] font-semibold tracking-[-0.025em] text-slate-950">
                MEDDxAgent
              </span>
            </Link>

            <nav className="workspace-nav hidden xl:flex">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`workspace-nav-item px-3.5 py-2 text-[12px] font-medium transition-colors ${
                    activePath === item.path ? "workspace-nav-item-active" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Research site
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white">
            <div className="app-container py-3">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-[13px] font-medium transition-colors ${
                      activePath === item.path
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="app-container">
        <p className="workspace-safety hidden sm:flex">
          Clinical decision support — review all outputs before making clinical decisions.
        </p>
      </div>

      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
}
