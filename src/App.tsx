import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductPreview from "./components/ProductPreview";
import ProductIntro from "./components/ProductIntro";
import Capabilities from "./components/Capabilities";
import Research from "./components/Research";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import AppShell from "./components/AppShell";
import WorkspaceHome from "./pages/WorkspaceHome";
import Settings from "./pages/Settings";
import NewCase from "./pages/NewCase";
import Cases from "./pages/Cases";
import ActiveCase from "./pages/ActiveCase";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <ProductPreview />
      <ProductIntro />
      <Capabilities />
      <Research />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-[560px] text-center">
        <p className="mb-5 font-mono text-[11px] text-neutral-400">404</p>
        <h1 className="text-[34px] font-medium leading-[1.04] tracking-[-0.045em] text-neutral-950 sm:text-[42px]">
          Page not found.
        </h1>
        <p className="mt-4 text-[14px] leading-[1.7] text-neutral-500">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/app"
          className="button-primary mt-8 inline-flex items-center rounded-full px-5 py-3 text-[13px] font-medium text-white"
        >
          Back to workspace
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AppShell />}>
        <Route path="/app" element={<WorkspaceHome />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/new" element={<NewCase />} />
        <Route path="/case/:id" element={<ActiveCase />} />
        <Route path="/case/:id/edit" element={<NewCase />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
