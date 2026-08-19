import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#how-it-works" },
  { label: "Research", href: "#research" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="motion-navbar sticky top-0 z-50 marketing-nav-shell">
      <div className="site-container">
        <div className="grid h-[66px] grid-cols-[1fr_auto_1fr] items-center gap-6">
          <Link
            to="/"
            className="justify-self-start text-[15px] font-semibold tracking-[-0.03em] text-neutral-950"
          >
            MEDDxAgent
          </Link>

          <div className="hidden items-center justify-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link py-2 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-950"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center justify-end lg:flex">
            <Link
              to="/app"
              className="button-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-white"
            >
              Open workspace
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          <button
            type="button"
            className="col-start-3 grid h-9 w-9 place-items-center justify-self-end rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="site-container py-5">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-3 text-[15px] font-medium text-neutral-700 transition-colors hover:text-neutral-950"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 border-t border-neutral-200 pt-5">
              <Link
                to="/app"
                className="button-primary block rounded-full px-4 py-3 text-center text-[13px] font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Open workspace
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
