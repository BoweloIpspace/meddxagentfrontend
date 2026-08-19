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
    <footer className="border-t border-neutral-200 bg-white">
      <div className="site-container py-12 lg:py-14">
        <div className="flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {footerLinks.map((link) =>
              "to" in link ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-950"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <p className="text-[11px] text-neutral-400">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
