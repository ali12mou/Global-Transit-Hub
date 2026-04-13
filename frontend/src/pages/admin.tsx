import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { SITE_SERVICE_IDS } from "@/lib/siteServices";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clipboard,
  FolderKanban,
  LogOut,
  Mail,
  Menu,
  Settings,
  Ship,
  Users,
  X,
} from "lucide-react";

type MeUser = { id: string; email: string; role: string } | null;

type Inquiry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  destinations: string;
  message: string;
  createdAt: string;
  reviewedBy: unknown;
};

type Stats = {
  inquiriesCount: number;
  usersCount: number;
  adminUsersCount: number;
};

const SECTIONS = [
  "stats",
  "activities",
  "team",
  "careers",
  "projects",
  "contact",
  "settings",
] as const;

type AdminSection = (typeof SECTIONS)[number];

function parseSection(path: string): AdminSection {
  const trimmed = path.replace(/\/+$/, "");
  const parts = trimmed.split("/").filter(Boolean);
  if (parts[0] !== "admin") return "stats";
  const raw = parts[1] ?? "stats";
  return SECTIONS.includes(raw as AdminSection) ? (raw as AdminSection) : "stats";
}

function CmsPlaceholder({
  title,
  siteHref,
  siteLabel,
  useRouterLink,
}: {
  title: string;
  siteHref: string;
  siteLabel: string;
  useRouterLink?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-border bg-white p-8 shadow-sm max-w-2xl">
      <h2 className="font-serif text-xl font-bold text-primary mb-3">{title}</h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t.adminPage.cmsBody}</p>
      <Button asChild variant="outline" className="rounded-md">
        {useRouterLink ? (
          <Link href={siteHref}>{siteLabel}</Link>
        ) : (
          <a href={siteHref}>{siteLabel}</a>
        )}
      </Button>
    </div>
  );
}

export default function AdminPage() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const section = useMemo(() => parseSection(location), [location]);

  const [me, setMe] = useState<MeUser | undefined>(undefined);
  const [stats, setStats] = useState<Stats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [statsError, setStatsError] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [acting, setActing] = useState<Record<string, boolean>>({});

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const homeHash = (hash: string) => `${basePath || ""}/#${hash}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await apiFetch("/auth/me");
        const meJson = (await meRes.json()) as { user: MeUser };
        if (cancelled) return;
        setMe(meJson.user);
        if (!meJson.user || meJson.user.role !== "admin") return;

        const [statsRes, listRes] = await Promise.all([
          apiFetch("/admin/stats"),
          apiFetch("/admin/inquiries"),
        ]);
        if (cancelled) return;
        if (statsRes.ok) {
          setStats((await statsRes.json()) as Stats);
        } else {
          setStatsError(true);
        }
        if (!listRes.ok) {
          setLoadError(true);
          return;
        }
        const listJson = (await listRes.json()) as { inquiries: Inquiry[] };
        setInquiries(listJson.inquiries);
      } catch {
        if (!cancelled) {
          setLoadError(true);
          setStatsError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setMe(null);
    setInquiries([]);
    setStats(null);
    window.location.href = "/";
  };

  const markReviewed = async (id: string) => {
    setActing((m) => ({ ...m, [id]: true }));
    try {
      const res = await apiFetch(`/admin/inquiries/${id}/review`, { method: "PATCH" });
      if (!res.ok) return;
      const data = (await res.json()) as { inquiry: Inquiry };
      setInquiries((rows) => rows.map((r) => (r.id === id ? data.inquiry : r)));
    } finally {
      setActing((m) => ({ ...m, [id]: false }));
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const isAdmin = me?.role === "admin";

  const navItems: { id: AdminSection; label: string; icon: typeof BarChart3 }[] = [
    { id: "stats", label: t.adminPage.navStats, icon: BarChart3 },
    { id: "activities", label: t.adminPage.navActivities, icon: Ship },
    { id: "team", label: t.adminPage.navTeam, icon: Users },
    { id: "careers", label: t.adminPage.navCareers, icon: Briefcase },
    { id: "projects", label: t.adminPage.navProjects, icon: FolderKanban },
    { id: "contact", label: t.adminPage.navContact, icon: Mail },
    { id: "settings", label: t.adminPage.navSettings, icon: Settings },
  ];

  const closeNav = () => setNavOpen(false);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col md:flex-row">
      {/* Mobile overlay */}
      {navOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Fermer le menu"
          onClick={closeNav}
        />
      )}

      <aside
        className={`
          fixed z-50 inset-y-0 inset-s-0 w-64 bg-primary text-primary-foreground flex flex-col shadow-lg
          transition-transform duration-200 md:translate-x-0 md:static md:z-auto
          ${navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-5 border-b border-white/15 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="font-serif font-bold text-sm leading-tight hover:opacity-90"
            onClick={closeNav}
          >
            Global Transit
            <span className="block text-[10px] font-sans font-normal opacity-80 uppercase tracking-wider">
              {t.adminPage.subtitle}
            </span>
          </Link>
          <button
            type="button"
            className="md:hidden p-1 rounded hover:bg-white/10"
            onClick={closeNav}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              href={id === "stats" ? "/admin" : `/admin/${id}`}
              onClick={closeNav}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${
                  section === id
                    ? "bg-white/15 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/15 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white rounded-md hover:bg-white/10"
            onClick={closeNav}
          >
            {t.adminPage.backToSite}
          </Link>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                closeNav();
                void logout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-md text-start"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              {t.adminPage.logout}
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="sticky top-0 z-30 bg-[#f0f2f5]/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between gap-3 md:py-4 md:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="md:hidden p-2 rounded-md border border-border bg-white text-primary"
              onClick={() => setNavOpen(true)}
              aria-label={t.adminPage.menu}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-serif text-lg md:text-2xl font-bold text-primary truncate">
                {t.adminPage.title}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {navItems.find((n) => n.id === section)?.label ?? t.adminPage.navStats}
              </p>
            </div>
          </div>
          {isAdmin && (
            <p className="hidden sm:block text-xs text-muted-foreground truncate max-w-[200px] md:max-w-xs text-end">
              {me?.email}
            </p>
          )}
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          {me === undefined ? (
            <p className="text-muted-foreground">…</p>
          ) : !isAdmin ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center max-w-lg mx-auto mt-8">
              <p className="text-foreground mb-6">{t.adminPage.loginRequired}</p>
              <Button asChild className="rounded-md bg-primary">
                <Link href="/login">{t.adminPage.goLogin}</Link>
              </Button>
            </div>
          ) : section === "stats" ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-primary mb-1">{t.adminPage.statsTitle}</h2>
                <p className="text-sm text-muted-foreground">{t.adminPage.statsHint}</p>
              </div>
              {statsError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : !stats ? (
                <p className="text-muted-foreground">…</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: t.adminPage.statInquiries, value: stats.inquiriesCount },
                    { label: t.adminPage.statUsers, value: stats.usersCount },
                    { label: t.adminPage.statAdmins, value: stats.adminUsersCount },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-xl border border-border bg-white p-6 shadow-sm"
                    >
                      <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                      <p className="text-3xl font-bold text-primary tabular-nums">{card.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : section === "contact" ? (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.inquiriesTitle}</h2>
              {loadError ? (
                <p className="text-destructive">{t.adminPage.loadError}</p>
              ) : inquiries.length === 0 ? (
                <p className="text-muted-foreground">{t.adminPage.noInquiries}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colId}</th>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colName}</th>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colEmail}</th>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colPhone}</th>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colInterest}</th>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colDescription}</th>
                        <th className="px-4 py-3 font-semibold min-w-[260px]">{t.adminPage.colMessage}</th>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colReviewer}</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {inquiries.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                            {row.id.slice(-6)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {row.firstName} {row.lastName}
                          </td>
                          <td className="px-4 py-3 break-all">{row.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.phone || "—"}</td>
                          <td className="px-4 py-3">{row.interest || "—"}</td>
                          <td className="px-4 py-3 max-w-xs text-muted-foreground">
                            <span className="line-clamp-3">{row.destinations || "—"}</span>
                          </td>
                          <td className="px-4 py-3 max-w-md">
                            <span className="line-clamp-3">{row.message || "—"}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {row.reviewedBy &&
                            typeof row.reviewedBy === "object" &&
                            row.reviewedBy !== null &&
                            "email" in row.reviewedBy
                              ? String((row.reviewedBy as { email?: string }).email ?? "—")
                              : "—"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                onClick={() => void copyText(row.id)}
                                title="Copier l’ID"
                              >
                                <Clipboard className="h-3.5 w-3.5" aria-hidden />
                                ID
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                onClick={() => void copyText(row.email)}
                                title="Copier l’e-mail"
                              >
                                <Clipboard className="h-3.5 w-3.5" aria-hidden />
                                Email
                              </button>
                              <button
                                type="button"
                                disabled={acting[row.id] === true || (row.reviewedBy != null && row.reviewedBy !== false)}
                                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                onClick={() => void markReviewed(row.id)}
                                title="Marquer comme traité"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                                Traité
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : section === "activities" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navActivities}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t.services.title}</p>
                </div>
                <Button asChild variant="outline" className="rounded-md w-fit">
                  <Link href="/activities">{t.adminPage.cmsOpenSite}</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {SITE_SERVICE_IDS.map((id) => (
                  <div
                    key={id}
                    className="rounded-xl border border-border bg-white p-5 shadow-sm"
                  >
                    <h3 className="font-semibold text-primary mb-2">{t.services[id].title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.services[id].desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : section === "team" ? (
            <CmsPlaceholder
              title={t.adminPage.navTeam}
              siteHref={homeHash("about")}
              siteLabel={t.adminPage.cmsOpenSite}
            />
          ) : section === "careers" ? (
            <CmsPlaceholder
              title={t.adminPage.navCareers}
              siteHref={homeHash("about")}
              siteLabel={t.adminPage.cmsOpenSite}
            />
          ) : section === "projects" ? (
            <CmsPlaceholder
              title={t.adminPage.navProjects}
              siteHref={homeHash("projects")}
              siteLabel={t.adminPage.cmsOpenSite}
            />
          ) : (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm max-w-xl">
              <h2 className="font-serif text-xl font-bold text-primary mb-3">{t.adminPage.settingsTitle}</h2>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium text-foreground">{t.adminPage.settingsAccount}</span>
                {": "}
                {me?.email}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.adminPage.settingsBody}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
