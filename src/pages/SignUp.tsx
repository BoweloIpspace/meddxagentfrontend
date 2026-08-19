import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSubmitted(true);
    setTimeout(() => {
      navigate("/app");
    }, 500);
  };

  const handleGoogle = () => {
    navigate("/app");
  };

  return (
    <div>
      <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-3">
        Create your MEDDxAgent account.
      </h1>
      <p className="text-[15px] text-neutral-400 leading-[1.6] mb-10">
        Set up your workspace for clinical AI research and differential diagnosis.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-neutral-500 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.edu"
            required
            className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-neutral-500 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 pr-11 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-neutral-500 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
          />
          {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
        </div>

        <div>
          <label htmlFor="organization" className="block text-[13px] font-medium text-neutral-500 mb-1.5">
            Organization / Institution <span className="text-neutral-300 font-normal">(optional)</span>
          </label>
          <input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="e.g. Johns Hopkins, NHS Trust"
            className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={submitted}
          className="button-primary w-full px-4 py-2.5 rounded-lg bg-neutral-900 text-white text-[15px] font-medium tracking-[-0.01em] disabled:cursor-wait disabled:opacity-70"
        >
          {submitted ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-neutral-100" />
        <span className="text-[13px] text-neutral-300">or</span>
        <div className="flex-1 h-px bg-neutral-100" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-neutral-200 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-[12px] text-neutral-300 mt-8 leading-[1.6]">
        By creating an account, you agree to the MEDDxAgent prototype terms and privacy notice.
      </p>

      <p className="text-center text-[14px] text-neutral-400 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-neutral-900 font-medium hover:underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
