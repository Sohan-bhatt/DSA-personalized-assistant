import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api/client";

type Mode = "login" | "signup";

export default function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null);
    setSuccess(null);
    setIsLoading(true);
    if (!email.includes("@")) {
      setIsLoading(false);
      return setErr("Enter a valid email");
    }
    if (password.length < 6) {
      setIsLoading(false);
      return setErr("Password must be at least 6 characters");
    }
    if (mode === "signup" && password !== confirm) {
      setIsLoading(false);
      return setErr("Passwords do not match");
    }

    try {
      const res = mode === "signup" ? await signup(email, password) : await login(email, password);
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("user_id", res.user_id);
      setSuccess(mode === "signup" ? "Account created. Redirecting..." : "Welcome back. Redirecting...");
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Auth failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card ripple-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">DSA Assistant</h1>
              <p className="mt-1 text-sm text-zinc-400">
                {mode === "login" ? "Login to continue." : "Create an account to begin."}
              </p>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
              beta
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 rounded-xl bg-zinc-900/70 p-1 border border-white/10">
            <button
              onClick={() => setMode("login")}
              className={[
                "rounded-lg py-2 text-sm font-medium transition",
                mode === "login"
                  ? "bg-white text-zinc-900 shadow"
                  : "text-zinc-300 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={[
                "rounded-lg py-2 text-sm font-medium transition",
                mode === "signup"
                  ? "bg-white text-zinc-900 shadow"
                  : "text-zinc-300 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              Sign up
            </button>
          </div>

          <form className="mt-5 space-y-3" onSubmit={submit}>
            <Field label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm outline-none focus:border-white/40 focus:bg-zinc-900/60 transition"
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm outline-none focus:border-white/40 focus:bg-zinc-900/60 transition"
                placeholder="••••••••"
              />
            </Field>

            {mode === "signup" && (
              <Field label="Confirm password">
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm outline-none focus:border-white/40 focus:bg-zinc-900/60 transition"
                  placeholder="••••••••"
                />
              </Field>
            )}

            {err && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {err}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={[
                "w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow transition",
                isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-white/90",
              ].join(" ")}
            >
              {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("demo@example.com");
                setPassword("password123");
                setConfirm("password123");
              }}
              className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/90 hover:bg-white/5 transition"
            >
              Fill demo credentials
            </button>

            <p className="text-xs text-zinc-500">
              Uses your FastAPI backend at <code className="text-[11px]">VITE_API_URL</code>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-zinc-400">{label}</div>
      {children}
    </label>
  );
}
