import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-3">
        Reset your password.
      </h1>
      <p className="text-[15px] text-neutral-400 leading-[1.6] mb-10">
        Enter your account email and we’ll prepare the reset flow.
      </p>

      {sent ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
          <p className="text-[14px] font-medium text-blue-800">Reset request prepared.</p>
          <p className="mt-1 text-[13px] leading-[1.6] text-blue-600">
            For this frontend prototype, no email is sent. You can return to sign in.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reset-email" className="block text-[13px] font-medium text-neutral-500 mb-1.5">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@institution.edu"
              required
              className="w-full px-4 py-2.5 text-[15px] text-neutral-900 bg-white border border-neutral-200 rounded-lg placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-300 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="button-primary button-accent w-full rounded-lg px-4 py-2.5 text-[15px] font-medium text-white"
          >
            Continue
          </button>
        </form>
      )}

      {!sent && (
        <p className="text-center text-[14px] text-neutral-400 mt-8">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-neutral-900 hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
