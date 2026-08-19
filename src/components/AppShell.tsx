import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/app", label: "Workspace" },
  { path: "/cases", label: "Cases" },
  { path: "/cases/new", label: "New case" },
  { path: "/settings", label: "Settings" },
];

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = location.pathname.startsWith("/case/")
    ? "/cases"
    : navItems.find(
        (item) => item.path === location.pathname || location.pathname.startsWith(item.path + "/")
      )?.path ?? location.pathname;

  return (
    <div className="workspace-shell">
      <header className="workspace-header sticky top-0 z-50">
        <div className="app-container">
          <div className="flex h-[66px] items-center justify-between gap-6">
            <Link
              to="/app"
              className="shrink-0 text-[15px] font-semibold tracking-[-0.03em] text-neutral-950"
            >
              MEDDxAgent
            </Link>

            <nav className="workspace-nav hidden xl:flex">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`workspace-nav-item py-2 text-[12px] font-medium transition-colors ${
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
                className="hidden items-center gap-1.5 py-2 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-950 sm:inline-flex"
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
                className="grid h-9 w-9 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 xl:hidden"
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
          <div className="border-t border-neutral-200 bg-white xl:hidden">
            <div className="app-container py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`border-b border-neutral-100 py-3 text-left text-[13px] font-medium transition-colors ${
                      activePath === item.path
                        ? "text-neutral-950"
                        : "text-neutral-500 hover:text-neutral-950"
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
