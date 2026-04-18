import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { SITE_SERVICE_IDS } from "@/lib/siteServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Globe,
  Newspaper,
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

const ADMIN_LANGUAGES: { code: string; label: string; name: string }[] = [
  { code: "fr", label: "FR", name: "Français" },
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "AR", name: "العربية" },
  { code: "am", label: "AM", name: "አማርኛ" },
  { code: "sw", label: "SW", name: "Kiswahili" },
  { code: "so", label: "SO", name: "Soomaali" },
  { code: "orm", label: "OR", name: "Afaan Oromoo" },
];

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
  servicesCount?: number;
  operationsCount?: number;
  teamMembersCount?: number;
  careersCount?: number;
  activeCareersCount?: number;
  newsCount?: number;
  activeNewsCount?: number;
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

type TeamMemberRow = {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  active: boolean;
  createdAt?: string;
};

type CareerRow = {
  id: string;
  title: string;
  location: string;
  contractType: string;
  description: string;
  applyEmail: string;
  active: boolean;
  createdAt?: string;
};

type ProjectRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  active: boolean;
  createdAt?: string;
};

type ClientRow = {
  id: string;
  name: string;
  images: string[];
  active: boolean;
  createdAt?: string;
};

type PartnerRow = {
  id: string;
  name: string;
  type: string;
  images: string[];
  active: boolean;
  createdAt?: string;
};

type NewsRow = {
  id: string;
  name: string;
  description: string;
  publishedAt: string;
  images: string[];
  user: string;
  likesCount: number;
  commentsCount: number;
  showInMoreToRead: boolean;
  active: boolean;
  createdAt?: string;
};

const SECTIONS = [
  "stats",
  "activities",
  "team",
  "careers",
  "projects",
  "clients",
  "partners",
  "news",
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

type RoleRow = {
  id: string;
  key: string;
  label: string;
  permissions: string[];
  active: boolean;
};

type PermissionRow = {
  id: string;
  key: string;
  label: string;
  active: boolean;
};

function parseSection(path: string): AdminSection {
  const trimmed = path.replace(/\/+$/, "");
  const parts = trimmed.split("/").filter(Boolean);
  if (parts[0] !== "admin") return "stats";
  const raw = parts[1] ?? "stats";
  return SECTIONS.includes(raw as AdminSection) ? (raw as AdminSection) : "stats";
}

function toLocalDateTimeInput(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  const { t, language, setLanguage } = useLanguage();
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
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [perms, setPerms] = useState<PermissionRow[]>([]);
  const [rbacError, setRbacError] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [editingPerm, setEditingPerm] = useState<PermissionRow | null>(null);
  const [roleForm, setRoleForm] = useState({ key: "", label: "", permissions: "" });
  const [permForm, setPermForm] = useState({ key: "", label: "" });

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<CmsService | null>(null);
  const [editingOperation, setEditingOperation] = useState<CmsOperation | null>(null);
  const [serviceForm, setServiceForm] = useState({ service: "", description: "" });
  const [operationForm, setOperationForm] = useState({ description: "" });
  const [serviceFiles, setServiceFiles] = useState<FileList | null>(null);
  const [operationFiles, setOperationFiles] = useState<FileList | null>(null);

  const [teamMembers, setTeamMembers] = useState<TeamMemberRow[]>([]);
  const [teamError, setTeamError] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMemberRow | null>(null);
  const [teamForm, setTeamForm] = useState({ name: "", title: "", description: "" });
  const [teamFiles, setTeamFiles] = useState<FileList | null>(null);

  const [careers, setCareers] = useState<CareerRow[]>([]);
  const [careersError, setCareersError] = useState(false);
  const [careerDialogOpen, setCareerDialogOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerRow | null>(null);
  const [careerForm, setCareerForm] = useState({
    title: "",
    location: "",
    contractType: "",
    applyEmail: "",
    description: "",
  });

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectsError, setProjectsError] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "",
    featured: true,
    description: "",
  });
  const [projectFiles, setProjectFiles] = useState<FileList | null>(null);

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientsError, setClientsError] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null);
  const [clientForm, setClientForm] = useState({ name: "" });
  const [clientFiles, setClientFiles] = useState<FileList | null>(null);

  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [partnersError, setPartnersError] = useState(false);
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerRow | null>(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", type: "ports" });
  const [partnerFiles, setPartnerFiles] = useState<FileList | null>(null);

  const [news, setNews] = useState<NewsRow[]>([]);
  const [newsError, setNewsError] = useState(false);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsRow | null>(null);
  const [newsForm, setNewsForm] = useState({
    name: "",
    description: "",
    publishedAt: "",
    likesCount: 0,
    commentsCount: 0,
    showInMoreToRead: true,
  });
  const [newsFiles, setNewsFiles] = useState<FileList | null>(null);

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
    if (section !== "team") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/admin/team-members");
        if (cancelled) return;
        if (!res.ok) {
          setTeamError(true);
          return;
        }
        const json = (await res.json()) as { members: TeamMemberRow[] };
        setTeamMembers(json.members ?? []);
      } catch {
        if (!cancelled) setTeamError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, section]);

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "careers") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/admin/careers");
        if (cancelled) return;
        if (!res.ok) {
          setCareersError(true);
          return;
        }
        const json = (await res.json()) as { careers: CareerRow[] };
        setCareers(json.careers ?? []);
      } catch {
        if (!cancelled) setCareersError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, section]);

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "projects") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/admin/projects");
        if (cancelled) return;
        if (!res.ok) {
          setProjectsError(true);
          return;
        }
        const json = (await res.json()) as { projects: ProjectRow[] };
        setProjects(json.projects ?? []);
      } catch {
        if (!cancelled) setProjectsError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, section]);

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "news") return;
    setNewsError(false);
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/admin/news");
        if (cancelled) return;
        if (!res.ok) {
          setNewsError(true);
          return;
        }
        const json = (await res.json()) as { news: NewsRow[] };
        setNews(json.news ?? []);
        setNewsError(false);
      } catch {
        if (!cancelled) setNewsError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, section]);

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "clients") return;
    setClientsError(false);
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/admin/clients");
        if (cancelled) return;
        if (!res.ok) {
          setClientsError(true);
          return;
        }
        const json = (await res.json()) as { clients: ClientRow[] };
        setClients(json.clients ?? []);
      } catch {
        if (!cancelled) setClientsError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, section]);

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "partners") return;
    setPartnersError(false);
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/admin/partners");
        if (cancelled) return;
        if (!res.ok) {
          setPartnersError(true);
          return;
        }
        const json = (await res.json()) as { partners: PartnerRow[] };
        setPartners(json.partners ?? []);
      } catch {
        if (!cancelled) setPartnersError(true);
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

  useEffect(() => {
    if (!isAdmin) return;
    if (section !== "roles" && section !== "permissions") return;
    let cancelled = false;
    (async () => {
      try {
        const [rRes, pRes] = await Promise.all([apiFetch("/admin/roles"), apiFetch("/admin/permissions")]);
        if (cancelled) return;
        if (!rRes.ok || !pRes.ok) {
          setRbacError(true);
          return;
        }
        const rJson = (await rRes.json()) as { roles: RoleRow[] };
        const pJson = (await pRes.json()) as { permissions: PermissionRow[] };
        setRoles(rJson.roles ?? []);
        setPerms(pJson.permissions ?? []);
      } catch {
        if (!cancelled) setRbacError(true);
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

  const openAddTeam = () => {
    setEditingTeam(null);
    setTeamForm({ name: "", title: "", description: "" });
    setTeamFiles(null);
    setTeamDialogOpen(true);
  };

  const openEditTeam = (row: TeamMemberRow) => {
    setEditingTeam(row);
    setTeamForm({ name: row.name, title: row.title, description: row.description });
    setTeamFiles(null);
    setTeamDialogOpen(true);
  };

  const saveTeam = async () => {
    const id = editingTeam?.id;
    setActing((m) => ({ ...m, team_save: true }));
    try {
      const urls = teamFiles ? await uploadImages(teamFiles, 1) : [];
      const payload: any = {
        name: teamForm.name.trim(),
        title: teamForm.title.trim(),
        description: teamForm.description.trim(),
      };
      if (urls.length > 0) payload.image = urls[0];

      const res = await apiFetch(id ? `/admin/team-members/${id}` : "/admin/team-members", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;

      const listRes = await apiFetch("/admin/team-members");
      if (listRes.ok) {
        const json = (await listRes.json()) as { members: TeamMemberRow[] };
        setTeamMembers(json.members ?? []);
      }
      setTeamDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, team_save: false }));
    }
  };

  const toggleTeam = async (row: TeamMemberRow) => {
    setActing((m) => ({ ...m, [row.id]: true }));
    try {
      const res = await apiFetch(`/admin/team-members/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setTeamMembers((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [row.id]: false }));
    }
  };

  const deleteTeam = async (row: TeamMemberRow) => {
    setActing((m) => ({ ...m, [`del_team_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/team-members/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setTeamMembers((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`del_team_${row.id}`]: false }));
    }
  };

  const openAddCareer = () => {
    setEditingCareer(null);
    setCareerForm({ title: "", location: "", contractType: "", applyEmail: "", description: "" });
    setCareerDialogOpen(true);
  };

  const openEditCareer = (row: CareerRow) => {
    setEditingCareer(row);
    setCareerForm({
      title: row.title,
      location: row.location ?? "",
      contractType: row.contractType ?? "",
      applyEmail: row.applyEmail ?? "",
      description: row.description ?? "",
    });
    setCareerDialogOpen(true);
  };

  const refreshCareers = async () => {
    const res = await apiFetch("/admin/careers");
    if (!res.ok) return;
    const json = (await res.json()) as { careers: CareerRow[] };
    setCareers(json.careers ?? []);
  };

  const saveCareer = async () => {
    const id = editingCareer?.id;
    setActing((m) => ({ ...m, career_save: true }));
    try {
      const payload = {
        title: careerForm.title.trim(),
        location: careerForm.location.trim(),
        contractType: careerForm.contractType.trim(),
        applyEmail: careerForm.applyEmail.trim(),
        description: careerForm.description.trim(),
      };
      const res = await apiFetch(id ? `/admin/careers/${id}` : "/admin/careers", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      await refreshCareers();
      setCareerDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, career_save: false }));
    }
  };

  const toggleCareer = async (row: CareerRow) => {
    setActing((m) => ({ ...m, [`career_toggle_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/careers/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setCareers((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [`career_toggle_${row.id}`]: false }));
    }
  };

  const deleteCareer = async (row: CareerRow) => {
    setActing((m) => ({ ...m, [`career_del_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/careers/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setCareers((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`career_del_${row.id}`]: false }));
    }
  };

  const openAddProject = () => {
    setEditingProject(null);
    setProjectForm({ title: "", category: "", featured: true, description: "" });
    setProjectFiles(null);
    setProjectDialogOpen(true);
  };

  const openEditProject = (row: ProjectRow) => {
    setEditingProject(row);
    setProjectForm({
      title: row.title ?? "",
      category: row.category ?? "",
      featured: row.featured !== false,
      description: row.description ?? "",
    });
    setProjectFiles(null);
    setProjectDialogOpen(true);
  };

  const refreshProjects = async () => {
    const res = await apiFetch("/admin/projects");
    if (!res.ok) return;
    const json = (await res.json()) as { projects: ProjectRow[] };
    setProjects(json.projects ?? []);
  };

  const saveProject = async () => {
    const id = editingProject?.id;
    setActing((m) => ({ ...m, project_save: true }));
    try {
      const urls = projectFiles ? await uploadImages(projectFiles, 1) : [];
      const payload: any = {
        title: projectForm.title.trim(),
        category: projectForm.category.trim(),
        featured: Boolean(projectForm.featured),
        description: projectForm.description.trim(),
      };
      if (urls.length > 0) payload.image = urls[0];

      const res = await apiFetch(id ? `/admin/projects/${id}` : "/admin/projects", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      await refreshProjects();
      setProjectDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, project_save: false }));
    }
  };

  const toggleProject = async (row: ProjectRow) => {
    setActing((m) => ({ ...m, [`proj_toggle_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/projects/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setProjects((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [`proj_toggle_${row.id}`]: false }));
    }
  };

  const toggleFeatured = async (row: ProjectRow) => {
    setActing((m) => ({ ...m, [`proj_feat_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/projects/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured: !row.featured }),
      });
      if (!res.ok) return;
      setProjects((rows) => rows.map((r) => (r.id === row.id ? { ...r, featured: !r.featured } : r)));
    } finally {
      setActing((m) => ({ ...m, [`proj_feat_${row.id}`]: false }));
    }
  };

  const deleteProject = async (row: ProjectRow) => {
    setActing((m) => ({ ...m, [`proj_del_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/projects/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setProjects((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`proj_del_${row.id}`]: false }));
    }
  };

  const openAddClient = () => {
    setEditingClient(null);
    setClientForm({ name: "" });
    setClientFiles(null);
    setClientDialogOpen(true);
  };

  const openEditClient = (row: ClientRow) => {
    setEditingClient(row);
    setClientForm({ name: row.name ?? "" });
    setClientFiles(null);
    setClientDialogOpen(true);
  };

  const refreshClients = async () => {
    const res = await apiFetch("/admin/clients");
    if (!res.ok) return;
    const json = (await res.json()) as { clients: ClientRow[] };
    setClients(json.clients ?? []);
  };

  const saveClient = async () => {
    const id = editingClient?.id;
    setActing((m) => ({ ...m, client_save: true }));
    try {
      const urls = clientFiles ? await uploadImages(clientFiles, 8) : [];
      const payload: any = { name: clientForm.name.trim(), active: true };
      if (urls.length > 0) payload.images = urls;
      const res = await apiFetch(id ? `/admin/clients/${id}` : "/admin/clients", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      await refreshClients();
      setClientDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, client_save: false }));
    }
  };

  const toggleClient = async (row: ClientRow) => {
    setActing((m) => ({ ...m, [`client_toggle_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/clients/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setClients((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [`client_toggle_${row.id}`]: false }));
    }
  };

  const deleteClient = async (row: ClientRow) => {
    setActing((m) => ({ ...m, [`client_del_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/clients/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setClients((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`client_del_${row.id}`]: false }));
    }
  };

  const openAddPartner = () => {
    setEditingPartner(null);
    setPartnerForm({ name: "", type: "ports" });
    setPartnerFiles(null);
    setPartnerDialogOpen(true);
  };

  const openEditPartner = (row: PartnerRow) => {
    setEditingPartner(row);
    setPartnerForm({ name: row.name ?? "", type: row.type ?? "ports" });
    setPartnerFiles(null);
    setPartnerDialogOpen(true);
  };

  const refreshPartners = async () => {
    const res = await apiFetch("/admin/partners");
    if (!res.ok) return;
    const json = (await res.json()) as { partners: PartnerRow[] };
    setPartners(json.partners ?? []);
  };

  const savePartner = async () => {
    const id = editingPartner?.id;
    setActing((m) => ({ ...m, partner_save: true }));
    try {
      const urls = partnerFiles ? await uploadImages(partnerFiles, 8) : [];
      const payload: any = {
        name: partnerForm.name.trim(),
        type: partnerForm.type.trim(),
        active: true,
      };
      if (urls.length > 0) payload.images = urls;
      const res = await apiFetch(id ? `/admin/partners/${id}` : "/admin/partners", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      await refreshPartners();
      setPartnerDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, partner_save: false }));
    }
  };

  const togglePartner = async (row: PartnerRow) => {
    setActing((m) => ({ ...m, [`partner_toggle_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/partners/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setPartners((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [`partner_toggle_${row.id}`]: false }));
    }
  };

  const deletePartner = async (row: PartnerRow) => {
    setActing((m) => ({ ...m, [`partner_del_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/partners/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setPartners((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`partner_del_${row.id}`]: false }));
    }
  };

  const openAddNews = () => {
    setEditingNews(null);
    setNewsForm({
      name: "",
      description: "",
      publishedAt: toLocalDateTimeInput(new Date().toISOString()),
      likesCount: 0,
      commentsCount: 0,
      showInMoreToRead: true,
    });
    setNewsFiles(null);
    setNewsDialogOpen(true);
  };

  const openEditNews = (row: NewsRow) => {
    setEditingNews(row);
    setNewsForm({
      name: row.name ?? "",
      description: row.description ?? "",
      publishedAt: toLocalDateTimeInput(row.publishedAt),
      likesCount: Number(row.likesCount ?? 0),
      commentsCount: Number(row.commentsCount ?? 0),
      showInMoreToRead: row.showInMoreToRead !== false,
    });
    setNewsFiles(null);
    setNewsDialogOpen(true);
  };

  const refreshNews = async () => {
    const res = await apiFetch("/admin/news");
    if (!res.ok) return;
    const json = (await res.json()) as { news: NewsRow[] };
    setNews(json.news ?? []);
  };

  const saveNews = async () => {
    const id = editingNews?.id;
    setActing((m) => ({ ...m, news_save: true }));
    try {
      const urls = newsFiles ? await uploadImages(newsFiles, 8) : [];
      const payload: any = {
        name: newsForm.name.trim(),
        description: newsForm.description.trim(),
        publishedAt: newsForm.publishedAt,
        likesCount: Number(newsForm.likesCount) || 0,
        commentsCount: Number(newsForm.commentsCount) || 0,
        showInMoreToRead: newsForm.showInMoreToRead,
        active: true,
      };
      if (urls.length > 0) payload.images = urls;
      const res = await apiFetch(id ? `/admin/news/${id}` : "/admin/news", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      await refreshNews();
      setNewsDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, news_save: false }));
    }
  };

  const toggleNews = async (row: NewsRow) => {
    setActing((m) => ({ ...m, [`news_toggle_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/news/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setNews((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [`news_toggle_${row.id}`]: false }));
    }
  };

  const deleteNews = async (row: NewsRow) => {
    setActing((m) => ({ ...m, [`news_del_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/news/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setNews((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`news_del_${row.id}`]: false }));
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

  const refreshRbac = async () => {
    const [rRes, pRes] = await Promise.all([apiFetch("/admin/roles"), apiFetch("/admin/permissions")]);
    if (rRes.ok) {
      const rJson = (await rRes.json()) as { roles: RoleRow[] };
      setRoles(rJson.roles ?? []);
    }
    if (pRes.ok) {
      const pJson = (await pRes.json()) as { permissions: PermissionRow[] };
      setPerms(pJson.permissions ?? []);
    }
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ key: "", label: "", permissions: "" });
    setRoleDialogOpen(true);
  };

  const openEditRole = (row: RoleRow) => {
    setEditingRole(row);
    setRoleForm({ key: row.key, label: row.label, permissions: (row.permissions ?? []).join(", ") });
    setRoleDialogOpen(true);
  };

  const saveRole = async () => {
    setActing((m) => ({ ...m, role_save: true }));
    try {
      const permsArr = roleForm.permissions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = { key: roleForm.key.trim(), label: roleForm.label.trim(), permissions: permsArr };
      const id = editingRole?.id;
      const res = await apiFetch(id ? `/admin/roles/${id}` : "/admin/roles", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      await refreshRbac();
      setRoleDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, role_save: false }));
    }
  };

  const toggleRole = async (row: RoleRow) => {
    setActing((m) => ({ ...m, [`role_toggle_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/roles/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setRoles((rows) => rows.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
    } finally {
      setActing((m) => ({ ...m, [`role_toggle_${row.id}`]: false }));
    }
  };

  const deleteRole = async (row: RoleRow) => {
    setActing((m) => ({ ...m, [`role_del_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/roles/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setRoles((rows) => rows.filter((r) => r.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`role_del_${row.id}`]: false }));
    }
  };

  const openCreatePerm = () => {
    setEditingPerm(null);
    setPermForm({ key: "", label: "" });
    setPermDialogOpen(true);
  };

  const openEditPerm = (row: PermissionRow) => {
    setEditingPerm(row);
    setPermForm({ key: row.key, label: row.label });
    setPermDialogOpen(true);
  };

  const savePerm = async () => {
    setActing((m) => ({ ...m, perm_save: true }));
    try {
      const payload = { key: permForm.key.trim(), label: permForm.label.trim() };
      const id = editingPerm?.id;
      const res = await apiFetch(id ? `/admin/permissions/${id}` : "/admin/permissions", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      await refreshRbac();
      setPermDialogOpen(false);
    } finally {
      setActing((m) => ({ ...m, perm_save: false }));
    }
  };

  const togglePerm = async (row: PermissionRow) => {
    setActing((m) => ({ ...m, [`perm_toggle_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/permissions/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) return;
      setPerms((rows) => rows.map((p) => (p.id === row.id ? { ...p, active: !p.active } : p)));
    } finally {
      setActing((m) => ({ ...m, [`perm_toggle_${row.id}`]: false }));
    }
  };

  const deletePerm = async (row: PermissionRow) => {
    setActing((m) => ({ ...m, [`perm_del_${row.id}`]: true }));
    try {
      const res = await apiFetch(`/admin/permissions/${row.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setPerms((rows) => rows.filter((p) => p.id !== row.id));
    } finally {
      setActing((m) => ({ ...m, [`perm_del_${row.id}`]: false }));
    }
  };

  const navItems: { id: AdminSection; label: string; icon: typeof BarChart3 }[] = [
    { id: "stats", label: t.adminPage.navStats, icon: BarChart3 },
    { id: "activities", label: t.adminPage.navActivities, icon: Ship },
    { id: "team", label: t.adminPage.navTeam, icon: Users },
    { id: "careers", label: t.adminPage.navCareers, icon: Briefcase },
    { id: "projects", label: t.adminPage.navProjects, icon: FolderKanban },
    { id: "clients", label: "Clients", icon: Globe },
    { id: "partners", label: "Partenaires", icon: Globe },
    { id: "news", label: "News", icon: Newspaper },
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
            className="font-serif font-bold text-sm leading-tight hover:opacity-90 flex items-center gap-2"
            onClick={closeNav}
          >
            <span className="bg-white rounded-md px-2 py-1 shrink-0">
              <img src="/logo-transparent.png" alt="Global Transit" className="h-7 w-auto" />
            </span>
            <span className="min-w-0">
              <span className="block truncate">Global Transit</span>
              <span className="block text-[10px] font-sans font-normal opacity-80 uppercase tracking-wider truncate">
                {t.adminPage.subtitle}
              </span>
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
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md bg-white text-primary border-border"
                >
                  <Globe className="h-4 w-4 mr-2" aria-hidden />
                  {(ADMIN_LANGUAGES.find((l) => l.code === language)?.label ?? "FR").toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {ADMIN_LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    className={language === (l.code as any) ? "font-bold" : undefined}
                    onClick={() => setLanguage(l.code as any)}
                  >
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {isAdmin && (
              <p className="hidden sm:block text-xs text-muted-foreground truncate max-w-50 md:max-w-xs text-end">
                {me?.email}
              </p>
            )}
          </div>
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
                    { label: "Services (CMS)", value: stats.servicesCount ?? 0 },
                    { label: "Opérations (CMS)", value: stats.operationsCount ?? 0 },
                    { label: "Membres équipe", value: stats.teamMembersCount ?? 0 },
                    { label: "Offres carrières", value: stats.careersCount ?? 0 },
                    { label: "Carrières actives", value: stats.activeCareersCount ?? 0 },
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
                        <th className="px-4 py-3 font-semibold min-w-65">{t.adminPage.colMessage}</th>
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
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
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
                                    <div className="flex items-center gap-1">
                                      {(row.images ?? []).slice(0, 3).map((src) => (
                                        <img
                                          key={src}
                                          src={resolveMediaUrl(src)}
                                          alt=""
                                          className="h-8 w-8 rounded object-cover border border-border bg-muted"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                    {row.active ? "Actif" : "Inactif"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
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
                                    <div className="flex items-center gap-1">
                                      {(row.images ?? []).slice(0, 4).map((src) => (
                                        <img
                                          key={src}
                                          src={resolveMediaUrl(src)}
                                          alt=""
                                          className="h-8 w-8 rounded object-cover border border-border bg-muted"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                    {row.active ? "Actif" : "Inactif"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
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
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navTeam}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Ajouter et gérer les membres de l’équipe.</p>
                </div>
                <Button className="rounded-md bg-primary w-fit" onClick={openAddTeam}>
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </div>

              {teamError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Nom</th>
                        <th className="px-4 py-3 font-semibold">Titre</th>
                        <th className="px-4 py-3 font-semibold">Description</th>
                        <th className="px-4 py-3 font-semibold">Image</th>
                        <th className="px-4 py-3 font-semibold">Statut</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teamMembers.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={7}>
                            Aucun membre.
                          </td>
                        </tr>
                      ) : (
                        teamMembers.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.id.slice(-6)}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{row.name}</td>
                            <td className="px-4 py-3">{row.title}</td>
                            <td className="px-4 py-3 max-w-lg">
                              <span className="line-clamp-2 text-muted-foreground">{row.description}</span>
                            </td>
                            <td className="px-4 py-3">
                              {row.image ? (
                                <img
                                  src={resolveMediaUrl(row.image)}
                                  alt=""
                                  className="h-10 w-10 rounded-full object-cover border border-border"
                                />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                {row.active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditTeam(row)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[row.id] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void toggleTeam(row)}
                                >
                                  {row.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`del_team_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deleteTeam(row)}
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
              )}

              <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingTeam ? "Modifier membre" : "Ajouter membre"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Nom</label>
                      <Input value={teamForm.name} onChange={(e) => setTeamForm((s) => ({ ...s, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Titre</label>
                      <Input
                        value={teamForm.title}
                        onChange={(e) => setTeamForm((s) => ({ ...s, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Description</label>
                      <Textarea
                        value={teamForm.description}
                        onChange={(e) => setTeamForm((s) => ({ ...s, description: e.target.value }))}
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Image</label>
                      <Input type="file" accept="image/*" onChange={(e) => setTeamFiles(e.target.files)} />
                      <p className="text-xs text-muted-foreground">
                        Si vous sélectionnez une image, elle remplacera l’image actuelle.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setTeamDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="rounded-md bg-primary" disabled={acting.team_save === true} onClick={() => void saveTeam()}>
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : section === "careers" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navCareers}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Ajouter et publier des offres de carrière.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="rounded-md w-fit">
                    <Link href="/careers">{t.adminPage.cmsOpenSite}</Link>
                  </Button>
                  <Button className="rounded-md bg-primary w-fit" onClick={openAddCareer}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
              </div>

              {careersError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Titre</th>
                        <th className="px-4 py-3 font-semibold">Lieu</th>
                        <th className="px-4 py-3 font-semibold">Contrat</th>
                        <th className="px-4 py-3 font-semibold">E-mail</th>
                        <th className="px-4 py-3 font-semibold">Statut</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {careers.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={7}>
                            Aucune offre.
                          </td>
                        </tr>
                      ) : (
                        careers.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.id.slice(-6)}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{row.title}</td>
                            <td className="px-4 py-3">{row.location || "—"}</td>
                            <td className="px-4 py-3">{row.contractType || "—"}</td>
                            <td className="px-4 py-3 break-all">{row.applyEmail || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                {row.active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditCareer(row)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`career_toggle_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void toggleCareer(row)}
                                >
                                  {row.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`career_del_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deleteCareer(row)}
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
              )}

              <Dialog open={careerDialogOpen} onOpenChange={setCareerDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingCareer ? "Modifier offre" : "Ajouter offre"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Titre</label>
                      <Input
                        value={careerForm.title}
                        onChange={(e) => setCareerForm((s) => ({ ...s, title: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Lieu</label>
                        <Input
                          value={careerForm.location}
                          onChange={(e) => setCareerForm((s) => ({ ...s, location: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Type de contrat</label>
                        <Input
                          value={careerForm.contractType}
                          onChange={(e) => setCareerForm((s) => ({ ...s, contractType: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">E-mail candidature</label>
                      <Input
                        value={careerForm.applyEmail}
                        onChange={(e) => setCareerForm((s) => ({ ...s, applyEmail: e.target.value }))}
                        placeholder="ex. hr@gttsgroup.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Description</label>
                      <Textarea
                        value={careerForm.description}
                        onChange={(e) => setCareerForm((s) => ({ ...s, description: e.target.value }))}
                        rows={8}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setCareerDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      className="rounded-md bg-primary"
                      disabled={acting.career_save === true}
                      onClick={() => void saveCareer()}
                    >
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : section === "projects" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navProjects}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Ajouter et publier des projets (Home “Projets Phares”).</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="rounded-md w-fit">
                    <Link href="/projects">{t.adminPage.cmsOpenSite}</Link>
                  </Button>
                  <Button className="rounded-md bg-primary w-fit" onClick={openAddProject}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
              </div>

              {projectsError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Titre</th>
                        <th className="px-4 py-3 font-semibold">Catégorie</th>
                        <th className="px-4 py-3 font-semibold">Image</th>
                        <th className="px-4 py-3 font-semibold">Featured</th>
                        <th className="px-4 py-3 font-semibold">Statut</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {projects.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={7}>
                            Aucun projet.
                          </td>
                        </tr>
                      ) : (
                        projects.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.id.slice(-6)}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{row.title}</td>
                            <td className="px-4 py-3">{row.category || "—"}</td>
                            <td className="px-4 py-3">
                              {row.image ? (
                                <img
                                  src={resolveMediaUrl(row.image)}
                                  alt=""
                                  className="h-10 w-16 rounded object-cover border border-border bg-muted"
                                />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                disabled={acting[`proj_feat_${row.id}`] === true}
                                className={`inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs font-semibold ${
                                  row.featured ? "border-emerald-300 text-emerald-700 bg-emerald-50" : "border-border text-muted-foreground bg-white"
                                } disabled:opacity-60`}
                                onClick={() => void toggleFeatured(row)}
                              >
                                {row.featured ? "Oui" : "Non"}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                {row.active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditProject(row)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`proj_toggle_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void toggleProject(row)}
                                >
                                  {row.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`proj_del_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deleteProject(row)}
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
              )}

              <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingProject ? "Modifier projet" : "Ajouter projet"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Titre</label>
                      <Input
                        value={projectForm.title}
                        onChange={(e) => setProjectForm((s) => ({ ...s, title: e.target.value }))}
                        placeholder="Ex. Corridor Djibouti — Addis-Abeba"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Catégorie</label>
                        <Input
                          value={projectForm.category}
                          onChange={(e) => setProjectForm((s) => ({ ...s, category: e.target.value }))}
                          placeholder="Ex. Infrastructure"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Featured (Home)</label>
                        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm((s) => ({ ...s, featured: e.target.checked }))}
                          />
                          Afficher dans “Projets Phares”
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Description</label>
                      <Textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm((s) => ({ ...s, description: e.target.value }))}
                        rows={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Image</label>
                      <Input type="file" accept="image/*" onChange={(e) => setProjectFiles(e.target.files)} />
                      <p className="text-xs text-muted-foreground">
                        Si vous sélectionnez une image, elle remplacera l’image actuelle.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setProjectDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      className="rounded-md bg-primary"
                      disabled={acting.project_save === true}
                      onClick={() => void saveProject()}
                    >
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : section === "clients" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">Clients</h2>
                  <p className="text-sm text-muted-foreground mt-1">Gestion des logos et noms affiches sur la home.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="rounded-md w-fit">
                    <Link href="/">{t.adminPage.cmsOpenSite}</Link>
                  </Button>
                  <Button className="rounded-md bg-primary w-fit" onClick={openAddClient}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
              </div>

              {clientsError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Nom</th>
                        <th className="px-4 py-3 font-semibold">Images</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {clients.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={4}>
                            Aucun client.
                          </td>
                        </tr>
                      ) : (
                        clients.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.id.slice(-6)}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{row.name}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">{row.images?.length ?? 0}</span>
                                <div className="flex items-center gap-1">
                                  {(row.images ?? []).slice(0, 3).map((src) => (
                                    <img
                                      key={src}
                                      src={resolveMediaUrl(src)}
                                      alt=""
                                      className="h-8 w-8 rounded object-cover border border-border bg-muted"
                                    />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditClient(row)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`client_toggle_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void toggleClient(row)}
                                >
                                  {row.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`client_del_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deleteClient(row)}
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
              )}

              <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingClient ? "Modifier client" : "Ajouter client"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Nom</label>
                      <Input value={clientForm.name} onChange={(e) => setClientForm({ name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Images</label>
                      <Input type="file" multiple accept="image/*" onChange={(e) => setClientFiles(e.target.files)} />
                      <p className="text-xs text-muted-foreground">
                        Vous pouvez televerser plusieurs images. Si vous modifiez, les nouvelles images remplacent les anciennes.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setClientDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="rounded-md bg-primary" disabled={acting.client_save === true} onClick={() => void saveClient()}>
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : section === "partners" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">Partenaires</h2>
                  <p className="text-sm text-muted-foreground mt-1">Gestion des ports, shipping lines et free zones affiches sur la home.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="rounded-md w-fit">
                    <Link href="/">{t.adminPage.cmsOpenSite}</Link>
                  </Button>
                  <Button className="rounded-md bg-primary w-fit" onClick={openAddPartner}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
              </div>

              {partnersError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Nom</th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Logo / Images</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {partners.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={4}>
                            Aucun partenaire.
                          </td>
                        </tr>
                      ) : (
                        partners.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-semibold text-primary">{row.name}</td>
                            <td className="px-4 py-3">{row.type}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">{row.images?.length ?? 0}</span>
                                <div className="flex items-center gap-1">
                                  {(row.images ?? []).slice(0, 3).map((src) => (
                                    <img
                                      key={src}
                                      src={resolveMediaUrl(src)}
                                      alt=""
                                      className="h-8 w-8 rounded object-cover border border-border bg-muted"
                                    />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditPartner(row)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`partner_toggle_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void togglePartner(row)}
                                >
                                  {row.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`partner_del_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deletePartner(row)}
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
              )}

              <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingPartner ? "Modifier partenaire" : "Ajouter partenaire"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Nom</label>
                      <Input
                        value={partnerForm.name}
                        onChange={(e) => setPartnerForm((s) => ({ ...s, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Type</label>
                      <select
                        value={partnerForm.type}
                        onChange={(e) => setPartnerForm((s) => ({ ...s, type: e.target.value }))}
                        aria-label="Type de partenaire"
                        title="Type de partenaire"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="ports">ports</option>
                        <option value="shipping line">shipping line</option>
                        <option value="free zone">free zone</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Logo ou images</label>
                      <Input type="file" multiple accept="image/*" onChange={(e) => setPartnerFiles(e.target.files)} />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setPartnerDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="rounded-md bg-primary" disabled={acting.partner_save === true} onClick={() => void savePartner()}>
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : section === "news" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">News</h2>
                  <p className="text-sm text-muted-foreground mt-1">Publication d'actualites avec images multiples.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" className="rounded-md w-fit">
                    <Link href="/news">{t.adminPage.cmsOpenSite}</Link>
                  </Button>
                  <Button className="rounded-md bg-primary w-fit" onClick={openAddNews}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
              </div>

              {newsError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Nom</th>
                        <th className="px-4 py-3 font-semibold">Description</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Images</th>
                        <th className="px-4 py-3 font-semibold">Users</th>
                        <th className="px-4 py-3 font-semibold">Nombre like</th>
                        <th className="px-4 py-3 font-semibold">Commentaires</th>
                        <th className="px-4 py-3 font-semibold">More to read</th>
                        <th className="px-4 py-3 font-semibold">Statut</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {news.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={11}>
                            Aucune news.
                          </td>
                        </tr>
                      ) : (
                        news.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.id.slice(-6)}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{row.name}</td>
                            <td className="px-4 py-3 max-w-lg">
                              <span className="line-clamp-2 text-muted-foreground">{row.description}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {row.publishedAt ? new Date(row.publishedAt).toLocaleString() : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">{row.images?.length ?? 0}</span>
                                <div className="flex items-center gap-1">
                                  {(row.images ?? []).slice(0, 3).map((src) => (
                                    <img
                                      key={src}
                                      src={resolveMediaUrl(src)}
                                      alt=""
                                      className="h-8 w-8 rounded object-cover border border-border bg-muted"
                                    />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">{row.user || "—"}</td>
                            <td className="px-4 py-3">{row.likesCount ?? 0}</td>
                            <td className="px-4 py-3">{row.commentsCount ?? 0}</td>
                            <td className="px-4 py-3">{row.showInMoreToRead ? "Oui" : "Non"}</td>
                            <td className="px-4 py-3">
                              <span className={row.active ? "text-emerald-700" : "text-muted-foreground"}>
                                {row.active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditNews(row)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`news_toggle_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void toggleNews(row)}
                                >
                                  {row.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`news_del_${row.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deleteNews(row)}
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
              )}

              <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingNews ? "Modifier news" : "Ajouter news"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Nom</label>
                      <Input value={newsForm.name} onChange={(e) => setNewsForm((s) => ({ ...s, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Description</label>
                      <Textarea
                        value={newsForm.description}
                        onChange={(e) => setNewsForm((s) => ({ ...s, description: e.target.value }))}
                        rows={7}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-primary">Date / Heure</label>
                        <Input
                          type="datetime-local"
                          value={newsForm.publishedAt}
                          onChange={(e) => setNewsForm((s) => ({ ...s, publishedAt: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Likes</label>
                        <Input
                          type="number"
                          min={0}
                          value={newsForm.likesCount}
                          onChange={(e) => setNewsForm((s) => ({ ...s, likesCount: Number(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Commentaires</label>
                        <Input
                          type="number"
                          min={0}
                          value={newsForm.commentsCount}
                          onChange={(e) => setNewsForm((s) => ({ ...s, commentsCount: Number(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary">Images (plus de 2 possible)</label>
                        <Input type="file" multiple accept="image/*" onChange={(e) => setNewsFiles(e.target.files)} />
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={newsForm.showInMoreToRead}
                        onChange={(e) => setNewsForm((s) => ({ ...s, showInMoreToRead: e.target.checked }))}
                      />
                      Afficher dans "More to read"
                    </label>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setNewsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="rounded-md bg-primary" disabled={acting.news_save === true} onClick={() => void saveNews()}>
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
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
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navRoles}</h2>
                  <p className="text-sm text-muted-foreground">Créer et gérer les rôles.</p>
                </div>
                <Button className="rounded-md bg-primary" onClick={openCreateRole}>
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </div>

              {rbacError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Key</th>
                        <th className="px-4 py-3 font-semibold">Label</th>
                        <th className="px-4 py-3 font-semibold">Permissions</th>
                        <th className="px-4 py-3 font-semibold">Statut</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {roles.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={5}>
                            Aucun rôle.
                          </td>
                        </tr>
                      ) : (
                        roles.map((r) => (
                          <tr key={r.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.key}</td>
                            <td className="px-4 py-3">{r.label}</td>
                            <td className="px-4 py-3 max-w-xl">
                              <span className="line-clamp-2 text-muted-foreground">
                                {(r.permissions ?? []).join(", ") || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={r.active ? "text-emerald-700" : "text-muted-foreground"}>
                                {r.active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditRole(r)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`role_toggle_${r.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void toggleRole(r)}
                                >
                                  {r.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`role_del_${r.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deleteRole(r)}
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

              <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingRole ? "Modifier rôle" : "Ajouter rôle"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Key</label>
                      <Input value={roleForm.key} onChange={(e) => setRoleForm((s) => ({ ...s, key: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Label</label>
                      <Input value={roleForm.label} onChange={(e) => setRoleForm((s) => ({ ...s, label: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Permissions (séparées par virgules)</label>
                      <Textarea
                        value={roleForm.permissions}
                        onChange={(e) => setRoleForm((s) => ({ ...s, permissions: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setRoleDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="rounded-md bg-primary" disabled={acting.role_save === true} onClick={() => void saveRole()}>
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : section === "permissions" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">{t.adminPage.navPermissions}</h2>
                  <p className="text-sm text-muted-foreground">Créer et gérer les permissions.</p>
                </div>
                <Button className="rounded-md bg-primary" onClick={openCreatePerm}>
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </div>

              {rbacError ? (
                <p className="text-destructive text-sm">{t.adminPage.loadError}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Key</th>
                        <th className="px-4 py-3 font-semibold">Label</th>
                        <th className="px-4 py-3 font-semibold">Statut</th>
                        <th className="px-4 py-3 font-semibold text-right">{t.adminPage.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {perms.length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-muted-foreground" colSpan={4}>
                            Aucune permission.
                          </td>
                        </tr>
                      ) : (
                        perms.map((p) => (
                          <tr key={p.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.key}</td>
                            <td className="px-4 py-3">{p.label}</td>
                            <td className="px-4 py-3">
                              <span className={p.active ? "text-emerald-700" : "text-muted-foreground"}>
                                {p.active ? "Actif" : "Inactif"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-primary hover:bg-muted"
                                  onClick={() => openEditPerm(p)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Modifier
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`perm_toggle_${p.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                  onClick={() => void togglePerm(p)}
                                >
                                  {p.active ? "Inactiver" : "Activer"}
                                </button>
                                <button
                                  type="button"
                                  disabled={acting[`perm_del_${p.id}`] === true}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-white px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                  onClick={() => void deletePerm(p)}
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

              <Dialog open={permDialogOpen} onOpenChange={setPermDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingPerm ? "Modifier permission" : "Ajouter permission"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Key</label>
                      <Input value={permForm.key} onChange={(e) => setPermForm((s) => ({ ...s, key: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Label</label>
                      <Input value={permForm.label} onChange={(e) => setPermForm((s) => ({ ...s, label: e.target.value }))} />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" className="rounded-md" onClick={() => setPermDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="rounded-md bg-primary" disabled={acting.perm_save === true} onClick={() => void savePerm()}>
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
