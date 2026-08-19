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
        <div className="grid h-[74px] grid-cols-[auto_1fr_auto] items-center gap-10">
          <Link to="/" className="flex items-center gap-3 justify-self-start">
            <span className="brand-mark">M</span>
            <span className="text-[15px] font-semibold tracking-[-0.025em] text-neutral-950">
              MEDDxAgent
            </span>
          </Link>

          <div className="marketing-nav-center hidden items-center justify-center lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="marketing-nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center justify-end lg:flex">
            <Link
              to="/app"
              className="marketing-cta px-5 py-2.5 text-[13px]"
            >
              Open workspace
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          <button
            type="button"
            className="col-start-3 grid h-9 w-9 place-items-center justify-self-end rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-950 lg:hidden"
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
        <div className="border-t border-neutral-100 bg-white lg:hidden">
          <div className="site-container py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-[14px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-3 border-t border-neutral-100 pt-4">
              <Link
                to="/app"
                className="marketing-cta w-full px-4 py-3 text-center text-[13px]"
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
