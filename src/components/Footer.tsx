import { Link } from "react-router-dom";

const footerLinks = [
  { label: "MEDDxAgent", to: "/" },
  { label: "Research", href: "#research" },
  { label: "Documentation", href: "#docs" },
  { label: "GitHub", href: "https://github.com/nec-research/meddxagent", external: true },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100">
      <div className="site-container py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {footerLinks.map((link) =>
              "to" in link ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[14px] text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <p className="text-[13px] text-neutral-300">
            © 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
