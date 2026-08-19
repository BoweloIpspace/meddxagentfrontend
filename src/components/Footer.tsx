import { Link } from "react-router-dom";

type FooterLink =
  | { label: string; to: string }
  | { label: string; href: string; external?: boolean };

const footerLinks: FooterLink[] = [
  { label: "MEDDxAgent", to: "/" },
  { label: "Product", href: "#product" },
  { label: "Research", href: "#research" },
  { label: "Workspace", to: "/app" },
  {
    label: "GitHub",
    href: "https://github.com/medicalappmedapp-design/meddxagent",
    external: true,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="site-container py-12 lg:py-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {footerLinks.map((link) =>
              "to" in link ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[13px] text-slate-400 transition-colors hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-slate-400 transition-colors hover:text-slate-900"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <p className="text-[12px] text-slate-300">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
