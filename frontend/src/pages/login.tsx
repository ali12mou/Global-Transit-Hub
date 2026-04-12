import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";

function readSafeNext(): string | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export default function LoginPage() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/auth/me");
        const data = (await res.json()) as {
          user: { role: string } | null;
        };
        if (cancelled || !data.user) return;
        if (data.user.role === "admin") {
          const next = readSafeNext();
          setLocation(next ?? "/admin");
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  const redirectAfterLogin = (role: string) => {
    const next = readSafeNext();
    if (next && role === "admin") {
      setLocation(next);
      return;
    }
    setLocation(role === "admin" ? "/admin" : "/");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError(true);
        return;
      }
      const data = (await res.json()) as {
        user: { role: string };
      };
      redirectAfterLogin(data.user.role);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 md:pt-40 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border shadow-sm p-8 md:p-10">
          {checkingSession ? (
            <p className="text-center text-muted-foreground py-12" aria-live="polite">
              …
            </p>
          ) : (
            <>
              <h1 className="font-serif text-2xl font-bold text-primary mb-8 text-center">
                {t.login.title}
              </h1>
              <form className="space-y-5" onSubmit={onSubmit}>
                {error && (
                  <p className="text-sm text-destructive text-center" role="alert">
                    {t.login.error}
                  </p>
                )}
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium text-primary">
                    {t.login.user}
                  </label>
                  <input
                    id="login-email"
                    type="text"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.userPlaceholder}
                    className="w-full rounded-md border border-border px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-muted-foreground/60"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium text-primary">
                    {t.login.password}
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPlaceholder}
                    className="w-full rounded-md border border-border px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder:text-muted-foreground/60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-primary py-3.5 text-sm font-bold tracking-wide text-primary-foreground uppercase hover:bg-primary/90 disabled:opacity-60"
                >
                  {loading ? "…" : t.login.submit}
                </button>
              </form>
              <Link
                href="/"
                className="mt-8 block text-center text-sm text-secondary font-medium hover:underline"
              >
                {t.login.backHome}
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
