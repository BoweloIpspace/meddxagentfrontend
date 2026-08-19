import { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";

const navItems = [
  { path: "/cases/new", label: "New Case" },
  { path: "/cases", label: "Cases" },
  { path: "/app", label: "Current Diagnosis" },
  { path: "/evidence", label: "Evidence" },
  { path: "/activity", label: "Activity" },
  { path: "/settings", label: "Settings" },
];

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active nav item based on current path
  const activePath = navItems.find(
    (item) => item.path === location.pathname || location.pathname.startsWith(item.path + "/")
  )?.path ?? location.pathname;

  return (
    <div className="min-h-screen bg-white">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur-md">
        <div className="app-container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <span className="text-[15px] font-semibold tracking-tight text-neutral-900">
                MEDDxAgent
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2.5">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    activePath === item.path
                      ? "text-neutral-900 bg-neutral-50"
                      : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="hidden sm:block text-[13px] text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                Landing page
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white">
            <div className="site-container py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-md text-[14px] transition-colors ${
                    activePath === item.path
                      ? "text-neutral-900 font-medium bg-neutral-50"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Safety disclaimer */}
      <div className="app-container">
        <p className="text-[11px] text-neutral-300 pt-6 pb-4 hidden sm:block">
          Clinical decision support — review all outputs before making clinical decisions.
        </p>
      </div>

      {/* Content */}
      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
}
