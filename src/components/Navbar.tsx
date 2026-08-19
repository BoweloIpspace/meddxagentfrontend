import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Research", href: "#research" },
  { label: "Documentation", href: "#docs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`motion-navbar sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-neutral-200"
          : "bg-white border-transparent"
      }`}
    >
      <div className="site-container">
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-[16px] font-semibold tracking-tight text-neutral-900">
              MEDDxAgent
            </span>
          </Link>

          {/* Desktop links — centered */}
          <div className="hidden lg:flex items-center justify-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-[15px] text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center justify-end">
            <Link
              to="/signup"
              className="button-primary text-[14px] font-medium px-5 py-2 rounded-full bg-neutral-900 text-white"
            >
              Get started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="col-start-3 justify-self-end lg:hidden p-2 -mr-2 text-neutral-400 hover:text-neutral-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-100">
          <div className="site-container py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link block px-4 py-3 text-[15px] text-neutral-600 hover:text-neutral-900 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-neutral-100">
              <Link
                to="/signup"
                className="button-primary block text-center px-4 py-3 rounded-full bg-neutral-900 text-white font-medium text-[14px] mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
