import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    path: "/workspace",
    label: "Overview",
    mobileLabel: "Home",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" />
        <rect x="14" y="14" width="6.5" height="6.5" rx="1.2" />
      </svg>
    ),
  },
  {
    path: "/cases",
    label: "Cases",
    mobileLabel: "Cases",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16v12H4z" />
        <path d="M8 4h8v3H8z" />
        <path d="M8 11h8M8 15h5" />
      </svg>
    ),
  },
  {
    path: "/cases/new",
    label: "New consultation",
    mobileLabel: "New",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    path: "/settings",
    label: "Settings",
    mobileLabel: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .64l-.04.08V21h-4v-.88a1.7 1.7 0 0 0-1.06-.72 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.64-1L3.88 14H3v-4h.88a1.7 1.7 0 0 0 .72-1.06 1.7 1.7 0 0 0-.34-1.88L4.2 7l2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.64l.04-.08V3h4v.88a1.7 1.7 0 0 0 1.06.72 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.87 7l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.4.33.75.64 1l.08.04H21v4h-.88a1.7 1.7 0 0 0-.72 1Z" />
      </svg>
    ),
  },
];

function resolveActivePath(pathname: string) {
  if (pathname === "/cases/new" || pathname.endsWith("/edit")) return "/cases/new";
  if (pathname.startsWith("/case/")) return "/cases";
  return (
    navItems.find(
      (item) => item.path === pathname || pathname.startsWith(`${item.path}/`)
    )?.path ?? pathname
  );
}

function resolveHeader(pathname: string) {
  if (pathname === "/cases/new") {
    return { eyebrow: "Cases / New consultation", title: "New consultation" };
  }
  if (pathname.endsWith("/edit")) {
    return { eyebrow: "Cases / Edit consultation", title: "Edit consultation" };
  }
  if (pathname.startsWith("/case/")) {
    return { eyebrow: "Cases / Case", title: "Case details" };
  }
  if (pathname === "/cases") return { eyebrow: "Workspace / Cases", title: "Cases" };
  if (pathname === "/settings") return { eyebrow: "Workspace / Settings", title: "Settings" };
  return { eyebrow: "Workspace", title: "MEDDxAgent" };
}

function resolveRouteClass(pathname: string) {
  if (pathname === "/workspace") return "workspace-route-overview";
  if (pathname === "/cases") return "workspace-route-cases";
  if (pathname.startsWith("/case/") && !pathname.endsWith("/edit")) return "workspace-route-case";
  return "";
}

function resolveMobileBackPath(pathname: string) {
  if (pathname.endsWith("/edit")) return pathname.replace(/\/edit$/, "");
  if (pathname.startsWith("/case/")) return "/cases";
  if (pathname === "/cases/new") return "/cases";
  return null;
}

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = resolveActivePath(location.pathname);
  const header = resolveHeader(location.pathname);
  const routeClass = resolveRouteClass(location.pathname);
  const mobileBackPath = resolveMobileBackPath(location.pathname);
  const showMobileTabs = !location.pathname.startsWith("/case/");

  return (
    <div className={`workspace-shell ${routeClass} ${showMobileTabs ? "" : "workspace-mobile-detail-screen"}`}>
      <aside className="workspace-sidebar hidden lg:flex">
        <div>
          <Link to="/app" className="workspace-brand">
            <span className="workspace-brand-mark">M</span>
            <span className="workspace-brand-copy">
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
                onClick={() => navigate(item.path)}
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
            <span>Research site</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-mobile-header lg:hidden">
          <div className="workspace-mobile-leading">
            {mobileBackPath ? (
              <button
                type="button"
                className="workspace-mobile-back"
                onClick={() => navigate(mobileBackPath)}
                aria-label="Go back"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            ) : (
              <Link to="/app" className="workspace-mobile-mark" aria-label="MEDDxAgent home">
                <span className="workspace-brand-mark">M</span>
              </Link>
            )}
          </div>

          <div className="workspace-mobile-route" aria-live="polite">
            <strong>{header.title}</strong>
          </div>

          <div className="workspace-mobile-trailing" aria-hidden="true">
            <span className="workspace-mobile-avatar">M</span>
          </div>
        </header>

        <header className="workspace-topbar hidden lg:flex">
          <div>
            <p className="workspace-topbar-kicker">{header.eyebrow}</p>
            <p className="workspace-topbar-title">{header.title}</p>
          </div>
          <div className="workspace-top-actions">
            <div className="workspace-prototype-badge">
              <span />
              Clinical workflow prototype
            </div>
            <div className="workspace-avatar" aria-label="Workspace account">M</div>
          </div>
        </header>

        <div className="workspace-content">
          <div className="workspace-safety">
            <span className="workspace-safety-dot" />
            Clinical decision support — review all outputs before making clinical decisions.
          </div>
          <main className="workspace-content-inner">
            <Outlet />
          </main>
        </div>

        {showMobileTabs && (
          <nav className="workspace-mobile-bottom-nav lg:hidden" aria-label="Mobile workspace navigation">
            {navItems.map((item) => {
              const active = activePath === item.path;
              const createTab = item.path === "/cases/new";
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`${active ? "active" : ""} ${createTab ? "workspace-mobile-create-tab" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="workspace-mobile-bottom-icon">{item.icon}</span>
                  <span>{item.mobileLabel}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
