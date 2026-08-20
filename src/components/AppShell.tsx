import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    path: "/app",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    path: "/cases",
    label: "Cases",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6.5h16v13H4z" />
        <path d="M8 3.5h8v3H8z" />
        <path d="M8 11h8M8 15h5" />
      </svg>
    ),
  },
  {
    path: "/cases/new",
    label: "New consultation",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    path: "/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .64l-.04.08V21h-4v-.88a1.7 1.7 0 0 0-1.06-.72 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.64-1L3.88 14H3v-4h.88a1.7 1.7 0 0 0 .72-1.06 1.7 1.7 0 0 0-.34-1.88L4.2 7l2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.64l.04-.08V3h4v.88a1.7 1.7 0 0 0 1.06.72 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.87 7l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.4.33.75.64 1l.08.04H21v4h-.88a1.7 1.7 0 0 0-.72 1Z" />
      </svg>
    ),
  },
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

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar hidden lg:flex">
        <div>
          <Link to="/app" className="workspace-brand">
            <span className="workspace-brand-mark">M</span>
            <span>
              <strong>MEDDxAgent</strong>
              <small>Clinical workspace</small>
            </span>
          </Link>

          <p className="workspace-nav-label">Workspace</p>
          <nav className="workspace-side-nav" aria-label="Workspace navigation">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigateTo(item.path)}
                className={`workspace-side-nav-item ${
                  activePath === item.path ? "workspace-side-nav-item-active" : ""
                }`}
              >
                <span className="workspace-side-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="workspace-sidebar-footer">
          <div className="workspace-engine-card">
            <div className="workspace-engine-row">
              <span className="workspace-engine-dot" />
              <span>MEDDxAgent engine</span>
            </div>
            <p>UI prototype · backend pending</p>
          </div>
          <Link to="/" className="workspace-research-link">
            Research site
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-mobile-header lg:hidden">
          <Link to="/app" className="workspace-mobile-brand">
            <span className="workspace-brand-mark">M</span>
            <span>MEDDxAgent</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="workspace-mobile-menu-button"
            aria-label="Toggle workspace menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </header>

        {mobileOpen && (
          <div className="workspace-mobile-menu lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigateTo(item.path)}
                className={activePath === item.path ? "active" : ""}
              >
                <span className="workspace-side-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="workspace-topbar hidden lg:flex">
          <div>
            <p className="workspace-topbar-kicker">MEDDxAgent</p>
            <p className="workspace-topbar-title">
              {activePath === "/cases/new"
                ? "New consultation"
                : navItems.find((item) => item.path === activePath)?.label ?? "Workspace"}
            </p>
          </div>
          <div className="workspace-prototype-badge">
            <span />
            Clinical workflow prototype
          </div>
        </div>

        <div className="workspace-content">
          <div className="workspace-safety">
            Clinical decision support — review all outputs before making clinical decisions.
          </div>
          <main className="workspace-content-inner">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
