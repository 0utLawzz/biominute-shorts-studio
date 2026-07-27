import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Lock, AlertTriangle, Loader2 } from "lucide-react";

export default function Login() {
  const { authenticated, loading, error, login } = useAuth();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (error) setFormError(error);
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEAE0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0C0C0C]" />
      </div>
    );
  }

  if (authenticated) {
    // AuthProvider or router should redirect before this, but guard anyway.
    return (
      <div className="min-h-screen bg-[#EDEAE0] flex items-center justify-center">
        <p className="font-mono font-bold uppercase">Already logged in</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await login(password);
    } catch {
      setFormError("Invalid password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EDEAE0] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#FAF7EE] border-[3px] border-[#0C0C0C] shadow-[6px_6px_0_#0C0C0C] p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#0C0C0C] p-2">
            <Lock className="w-6 h-6 text-[#C9A800]" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-[#0C0C0C] uppercase tracking-wide">
              BioMinute
            </h1>
            <p className="font-mono text-[10px] font-bold uppercase text-[#555]">
              Production Dashboard
            </p>
          </div>
        </div>

        <p className="font-sans text-sm text-[#333] mb-6">
          This dashboard controls publishing to YouTube and video rendering.
          Enter the production password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[10px] font-bold uppercase text-[#555] mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-[#FAF7EE] border-[2px] border-[#0C0C0C] px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-[3px_3px_0_#0C0C0C] transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {formError && (
            <div className="flex items-center gap-2 bg-[#C94A00] text-white px-3 py-2 border-[2px] border-[#0C0C0C]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-mono text-xs font-bold">{formError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full flex items-center justify-center gap-2 bg-[#0C0C0C] text-[#FAF7EE] font-mono font-bold text-sm uppercase px-4 py-3 border-[2px] border-[#0C0C0C] shadow-[3px_3px_0_#C9A800] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Unlock Dashboard
              </>
            )}
          </button>
        </form>
      </div>

      <p className="font-mono text-[10px] text-[#777] mt-6 uppercase">
        Password is configured in Replit Secrets as DASHBOARD_PASSWORD
      </p>
    </div>
  );
}
