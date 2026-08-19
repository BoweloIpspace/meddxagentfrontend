import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductPreview from "./components/ProductPreview";
import ProductIntro from "./components/ProductIntro";
import Capabilities from "./components/Capabilities";
import Research from "./components/Research";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import AuthLayout from "./components/AuthLayout";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import NewCase from "./pages/NewCase";
import Cases from "./pages/Cases";
import ActiveCase from "./pages/ActiveCase";
import Evidence from "./pages/Evidence";
import Activity from "./pages/Activity";

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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-[13px] font-mono text-neutral-300 mb-4">404</p>
        <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-3">
          Page not found
        </h1>
        <p className="text-[15px] text-neutral-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="button-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-[14px] font-medium"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth pages */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <SignUp />
          </AuthLayout>
        }
      />

      {/* Application pages (inside AppShell) */}
      <Route element={<AppShell />}>
        <Route path="/app" element={<ActiveCase />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/new" element={<NewCase />} />
        <Route path="/case/:id" element={<ActiveCase />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
