import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <header className="w-full">
        <div className="site-container">
          <div className="flex h-16 items-center">
            <Link to="/" className="flex items-center">
              <span className="text-[16px] font-semibold tracking-tight text-neutral-900">
                MEDDxAgent
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Centered content */}
      <main className="flex items-start justify-center px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
