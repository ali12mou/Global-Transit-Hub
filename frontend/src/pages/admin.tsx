import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { SITE_SERVICE_IDS } from "@/lib/siteServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart3,
  Briefcase,
  Camera,
  CheckCircle2,
  Clipboard,
  FolderKanban,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Plus,
  Settings,
  Ship,
  Trash2,
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

type CmsService = {
  id: string;
  service: string;
  description: string;
  images: string[];
  active: boolean;
  createdAt?: string;
};

type CmsOperation = {
  id: string;
  description: string;
  images: string[];
  active: boolean;
  createdAt?: string;
};

const SECTIONS = [
  "stats",
  "activities",
  "team",
  "careers",
  "projects",
  "contact",
  "settings",
  "users",
  "roles",
  "permissions",
] as const;

type AdminSection = (typeof SECTIONS)[number];

type AdminUserRow = {
  id: string;
  email: string;
  role: string;
  createdAt?: string;
};

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
  const [cmsServices, setCmsServices] = useState<CmsService[]>([]);
  const [cmsOperations, setCmsOperations] = useState<CmsOperation[]>([]);
  const [cmsError, setCmsError] = useState(false);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [usersError, setUsersError] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({ email: "", password: "", role: "user" });

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<CmsService | null>(null);
  const [editingOperation, setEditingOperation] = useState<CmsOperation | null>(null);
  const [serviceForm, setServiceForm] = useState({ service: "", description: "" });
  const [operationForm, setOperationForm] = useState({ description: "" });
  const [serviceFiles, setServiceFiles] = useState<FileList | null>(null);
  const [operationFiles, setOperationFiles] = useState<FileList | null>(null);

  const isAdmin = me?.role === "admin";

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

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "activities") return;
    let cancelled = false;
    (async () => {
      try {
        const [sRes, oRes] = await Promise.all([
          apiFetch("/admin/activity-services"),
          apiFetch("/admin/activity-operations"),
        ]);
        if (cancelled) return;
        if (!sRes.ok || !oRes.ok) {
          setCmsError(true);
          return;
        }
        const sJson = (await sRes.json()) as { services: CmsService[] };
        const oJson = (await oRes.json()) as { operations: CmsOperation[] };
        setCmsServices(sJson.services ?? []);
        setCmsOperations(oJson.operations ?? []);
      } catch {
        if (!cancelled) setCmsError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, section]);

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "users") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/admin/users");
        if (!res.ok) {
          if (!cancelled) setUsersError(true);
          return;
        }
        const json = (await res.json()) as { users: AdminUserRow[] };
        if (!cancelled) setUsers(json.users ?? []);
      } catch {
        if (!cancelled) setUsersError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, section]);

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

  const uploadImages = async (files: FileList, max: number) => {
    const fd = new FormData();
    const toSend = Array.from(files).slice(0, max);
    for (const f of toSend) fd.append("images", f);
    const res = await apiFetch("/admin/uploads", { method: "POST", body: fd });
    if (!res.ok) return [];
    const json = (await res.json()) as { urls: string[] };
    return json.urls ?? [];
  };

  const openAddService = () => {
    setEditingService(null);
    setServiceForm({ service: "", description: "" });
    setServiceFiles(null);
    setServiceDialogOpen(true);
  };

  const openEditService = (row: CmsService) => {
    setEditingService(row);
    setServiceForm({ service: row.service, description: row.description });
    setServiceFiles(null);
    setServiceDialogOpen(true);
  };

  const saveService = async () => {
    const id = editingService?.id;
    setActing((m) => ({ ...m, service_save: true }));
    try {
      const urls = serviceFiles ? await uploadImages(serviceFiles, 3) : [];
      const payload: any = {
        service: serviceForm.service.trim(),
        description: serviceForm.description.trim(),
      };
      if (urls.length > 0) payload.images = urls;
      const res = await apiFetch(id ? `/admin/activity-services/${id}` : "/admin/activity-services", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      // reload list
      const sRes = await apiFetch("/admin/activity-services");
      if (sRes.ok) {
        const sJson = (await sRes.json()) as { services: CmsService[] };
        setCmsServices(sJson.services ?? []);
      }
      setServiceDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, service_save: false }));
    }
  };

  const toggleService = async (row: CmsService) => {
    setActing((m) => ({ ...m, [row.id]: true }));
    try {
      await apiFetch(`/admin/activity-services/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      setCmsServices((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [row.id]: false }));
    }
  };

  const deleteService = async (row: CmsService) => {
    setActing((m) => ({ ...m, [`del_${row.id}`]: true }));
    try {
      await apiFetch(`/admin/activity-services/${row.id}`, { method: "DELETE" });
      setCmsServices((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`del_${row.id}`]: false }));
    }
  };

  const openAddOperation = () => {
    setEditingOperation(null);
    setOperationForm({ description: "" });
    setOperationFiles(null);
    setOperationDialogOpen(true);
  };

  const openEditOperation = (row: CmsOperation) => {
    setEditingOperation(row);
    setOperationForm({ description: row.description });
    setOperationFiles(null);
    setOperationDialogOpen(true);
  };

  const saveOperation = async () => {
    const id = editingOperation?.id;
    setActing((m) => ({ ...m, op_save: true }));
    try {
      const urls = operationFiles ? await uploadImages(operationFiles, 12) : [];
      const payload: any = { description: operationForm.description.trim() };
      if (urls.length > 0) payload.images = urls;
      const res = await apiFetch(id ? `/admin/activity-operations/${id}` : "/admin/activity-operations", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      const oRes = await apiFetch("/admin/activity-operations");
      if (oRes.ok) {
        const oJson = (await oRes.json()) as { operations: CmsOperation[] };
        setCmsOperations(oJson.operations ?? []);
      }
      setOperationDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, op_save: false }));
    }
  };

  const toggleOperation = async (row: CmsOperation) => {
    setActing((m) => ({ ...m, [row.id]: true }));
    try {
      await apiFetch(`/admin/activity-operations/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      setCmsOperations((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [row.id]: false }));
    }
  };

  const deleteOperation = async (row: CmsOperation) => {
    setActing((m) => ({ ...m, [`del_${row.id}`]: true }));
    try {
      await apiFetch(`/admin/activity-operations/${row.id}`, { method: "DELETE" });
      setCmsOperations((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`del_${row.id}`]: false }));
    }
  };

  const refreshUsers = async () => {
    const res = await apiFetch("/admin/users");
    if (!res.ok) return;
    const json = (await res.json()) as { users: AdminUserRow[] };
    setUsers(json.users ?? []);
  };

  const openCreateUser = () => {
    setCreateUserForm({ email: "", password: "", role: "user" });
    setCreateUserOpen(true);
  };

  const createUser = async () => {
    setActing((m) => ({ ...m, create_user: true }));
    try {
      const res = await apiFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify(createUserForm),
      });
      if (!res.ok) return;
      await refreshUsers();
      setCreateUserOpen(false);
    } finally {
      setActing((m) => ({ ...m, create_user: false }));
    }
  };

  const setUserRole = async (row: AdminUserRow, role: "admin" | "user") => {
    setActing((m) => ({ ...m, [`role_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/users/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) return;
      setUsers((rows) => rows.map((u) => (u.id === row.id ? { ...u, role } : u)));
    } finally {
      setActing((m) => ({ ...m, [`role_${row.id}`]: false }));
    }
  };

  const deleteUser = async (row: AdminUserRow) => {
    setActing((m) => ({ ...m, [`del_user_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/users/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setUsers((rows) => rows.filter((u) => u.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`del_user_${row.id}`]: false }));
    }
  };

  const navItems: { id: AdminSection; label: string; icon: typeof BarChart3 }[] = [
    { id: "stats", label: t.adminPage.navStats, icon: BarChart3 },
    { id: "activities", label: t.adminPage.navActivities, icon: Ship },
    { id: "team", label: t.adminPage.navTeam, icon: Users },
    { id: "careers", label: t.adminPage.navCareers, icon: Briefcase },
    { id: "projects", label: t.adminPage.navProjects, icon: FolderKanban },
    { id: "contact", label: t.adminPage.navContact, icon: Mail },
    { id: "settings", label: t.adminPage.navSettings, icon: Settings },
  ];

  const settingsSub = [
    { id: "users" as const, label: t.adminPage.navUsers },
    { id: "roles" as const, label: t.adminPage.navRoles },
    { id: "permissions" as const, label: t.adminPage.navPermissions },
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
          {navItems.map(({ id, label, icon: Icon }) => {
            if (id !== "settings") {
              return (
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
              );
            }

            const settingsActive =
              section === "settings" || section === "users" || section === "roles" || section === "permissions";

            return (
              <div key={id} className="pt-2">
                <Link
                  href="/admin/settings"
                  onClick={closeNav}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${
                      settingsActive
                        ? "bg-white/15 text-white"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {label}
                </Link>
                <div className="mt-1 space-y-0.5">
                  {settingsSub.map((s) => (
                    <Link
                      key={s.id}
                      href={`/admin/${s.id}`}
                      onClick={closeNav}
                      className={`
                        ms-7 flex items-center px-3 py-2 rounded-md text-sm transition-colors
                        ${
                          section === s.id
                            ? "bg-white/15 text-white"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
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
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navActivities}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gestion du contenu (admin) → mise à jour du site public.
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-md w-fit">
                  <Link href="/activities">{t.adminPage.cmsOpenSite}</Link>
                </Button>
              </div>

              {cmsError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <>
                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-primary">Nos services</h3>
                        <p className="text-sm text-muted-foreground">Max 3 images par service.</p>
                      </div>
                      <Button className="rounded-md bg-primary" onClick={openAddService}>
                        <Plus className="h-4 w-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 font-semibold">ID</th>
                            <th className="px-4 py-3 font-semibold">Service</th>
                            <th className="px-4 py-3 font-semibold">Description</th>
                            <th className="px-4 py-3 font-semibold">Images</th>
                            <th className="px-4 py-3 font-semibold">Statut</th>
                            <th className="px-4 py-3 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {cmsServices.length === 0 ? (
                            <tr>
                              <td className="px-4 py-4 text-muted-foreground" colSpan={6}>
                                Aucun service.
                              </td>
                            </tr>
                          ) : (
                            cmsServices.map((row) => (
                              <tr key={row.id} className="hover:bg-muted/30">
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                  {row.id.slice(-6)}
                                </td>
                                <td className="px-4 py-3 font-semibold text-primary">{row.service}</td>
                                <td className="px-4 py-3 max-w-lg">
                                  <span className="line-clamp-2 text-muted-foreground">{row.description}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-muted-foreground" aria-hidden />
                                    <span className="text-muted-foreground">{row.images?.length ?? 0}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                    {row.active ? "Actif" : "Inactif"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      type="button"
                                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                      onClick={() => openEditService(row)}
                                    >
                                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                                      Modifier
                                    </button>
                                    <button
                                      type="button"
                                      disabled={acting[row.id] === true}
                                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                      onClick={() => void toggleService(row)}
                                    >
                                      {row.active ? "Inactiver" : "Activer"}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={acting[`del_${row.id}`] === true}
                                      className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                      onClick={() => void deleteService(row)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                                      Supprimer
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-primary">Nos opérations en images</h3>
                        <p className="text-sm text-muted-foreground">Plusieurs images possibles.</p>
                      </div>
                      <Button className="rounded-md bg-primary" onClick={openAddOperation}>
                        <Plus className="h-4 w-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 font-semibold">ID</th>
                            <th className="px-4 py-3 font-semibold">Description</th>
                            <th className="px-4 py-3 font-semibold">Images</th>
                            <th className="px-4 py-3 font-semibold">Statut</th>
                            <th className="px-4 py-3 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {cmsOperations.length === 0 ? (
                            <tr>
                              <td className="px-4 py-4 text-muted-foreground" colSpan={5}>
                                Aucune opération.
                              </td>
                            </tr>
                          ) : (
                            cmsOperations.map((row) => (
                              <tr key={row.id} className="hover:bg-muted/30">
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                  {row.id.slice(-6)}
                                </td>
                                <td className="px-4 py-3 max-w-2xl">
                                  <span className="line-clamp-2 text-muted-foreground">{row.description}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-muted-foreground" aria-hidden />
                                    <span className="text-muted-foreground">{row.images?.length ?? 0}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                    {row.active ? "Actif" : "Inactif"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      type="button"
                                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                      onClick={() => openEditOperation(row)}
                                    >
                                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                                      Modifier
                                    </button>
                                    <button
                                      type="button"
                                      disabled={acting[row.id] === true}
                                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                      onClick={() => void toggleOperation(row)}
                                    >
                                      {row.active ? "Inactiver" : "Activer"}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={acting[`del_${row.id}`] === true}
                                      className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                      onClick={() => void deleteOperation(row)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                                      Supprimer
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}

              <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingService ? "Modifier service" : "Ajouter service"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Service</label>
                      <Input
                        value={serviceForm.service}
                        onChange={(e) => setServiceForm((s) => ({ ...s, service: e.target.value }))}
                        placeholder="Ex. Clearance"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Description</label>
                      <Textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm((s) => ({ ...s, description: e.target.value }))}
                        placeholder="Description…"
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Images (max 3)</label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setServiceFiles(e.target.files)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Si vous sélectionnez des images, elles remplaceront les images actuelles.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setServiceDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      className="rounded-md bg-primary"
                      disabled={acting.service_save === true}
                      onClick={() => void saveService()}
                    >
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={operationDialogOpen} onOpenChange={setOperationDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingOperation ? "Modifier opération" : "Ajouter opération"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Description</label>
                      <Textarea
                        value={operationForm.description}
                        onChange={(e) => setOperationForm({ description: e.target.value })}
                        placeholder="Description…"
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Images</label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setOperationFiles(e.target.files)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Si vous sélectionnez des images, elles remplaceront les images actuelles.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setOperationDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      className="rounded-md bg-primary"
                      disabled={acting.op_save === true}
                      onClick={() => void saveOperation()}
                    >
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
          ) : section === "users" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navUsers}</h2>
                  <p className="text-sm text-muted-foreground">Gestion des comptes et des rôles.</p>
                </div>
                <Button className="rounded-md bg-primary" onClick={openCreateUser}>
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </div>

              {usersError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">{t.adminPage.colEmail}</th>
                        <th className="px-4 py-3 font-semibold">Rôle</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={4}>
                            Aucun utilisateur.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                              {u.id.slice(-6)}
                            </td>
                            <td className="px-4 py-3 break-all">{u.email}</td>
                            <td className="px-4 py-3">{u.role}</td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={acting[`role_${u.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted disabled:opacity-60"
                                  onClick={() => void setUserRole(u, u.role === "admin" ? "user" : "admin")}
                                >
                                  {u.role === "admin" ? "Passer user" : "Passer admin"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`del_user_${u.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deleteUser(u)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" aria-hidden /> Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">E-mail</label>
                      <Input
                        value={createUserForm.email}
                        onChange={(e) => setCreateUserForm((s) => ({ ...s, email: e.target.value }))}
                        placeholder="ex. user@domaine.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Mot de passe</label>
                      <Input
                        type="password"
                        value={createUserForm.password}
                        onChange={(e) => setCreateUserForm((s) => ({ ...s, password: e.target.value }))}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Rôle</label>
                      <Input
                        value={createUserForm.role}
                        onChange={(e) => setCreateUserForm((s) => ({ ...s, role: e.target.value }))}
                        placeholder="admin ou user"
                      />
                      <p className="text-xs text-muted-foreground">Valeurs : admin | user</p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setCreateUserOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      className="rounded-md bg-primary"
                      disabled={acting.create_user === true}
                      onClick={() => void createUser()}
                    >
                      Créer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : section === "roles" ? (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm max-w-3xl space-y-2">
              <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navRoles}</h2>
              <p className="text-sm text-muted-foreground">
                Rôles disponibles : <span className="font-medium text-foreground">admin</span>,{" "}
                <span className="font-medium text-foreground">user</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                (Vous pourrez étendre cette page pour gérer des rôles personnalisés.)
              </p>
            </div>
          ) : section === "permissions" ? (
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm max-w-3xl space-y-2">
              <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navPermissions}</h2>
              <p className="text-sm text-muted-foreground">
                Modèle actuel : les admins ont accès total, les users n’ont pas accès à l’admin.
              </p>
              <p className="text-sm text-muted-foreground">
                (On peut ensuite brancher une vraie matrice rôles/permissions si vous le souhaitez.)
              </p>
            </div>
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
