import { Link, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductPreview from "./components/ProductPreview";
import ProductIntro from "./components/ProductIntro";
import Capabilities from "./components/Capabilities";
import Research from "./components/Research";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import AppShell from "./components/AppShell";
import { CaseStoreProvider } from "./data/CaseStoreContext";
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

function WorkspaceApp() {
  return (
    <CaseStoreProvider>
      <AppShell />
    </CaseStoreProvider>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="mb-4 font-mono text-[13px] text-neutral-300">404</p>
        <h1 className="mb-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-neutral-900 sm:text-[32px]">
          Page not found
        </h1>
        <p className="mb-8 text-[15px] text-neutral-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/app"
          className="button-primary inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-2.5 text-[14px] font-medium text-white"
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

      <Route element={<WorkspaceApp />}>
        <Route path="/app" element={<Navigate to="/cases/new" replace />} />
        <Route path="/workspace" element={<WorkspaceHome />} />
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
