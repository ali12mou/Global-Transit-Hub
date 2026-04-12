import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

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

export default function AdminPage() {
  const { t } = useLanguage();
  const [me, setMe] = useState<MeUser | undefined>(undefined);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await apiFetch("/auth/me");
        const meJson = (await meRes.json()) as { user: MeUser };
        if (cancelled) return;
        setMe(meJson.user);
        if (!meJson.user || meJson.user.role !== "admin") return;
        const listRes = await apiFetch("/admin/inquiries");
        if (!listRes.ok) {
          setLoadError(true);
          return;
        }
        const listJson = (await listRes.json()) as { inquiries: Inquiry[] };
        if (!cancelled) setInquiries(listJson.inquiries);
      } catch {
        if (!cancelled) setLoadError(true);
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
    window.location.href = "/";
  };

  const isAdmin = me?.role === "admin";

  return (
    <main className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 md:pt-40 container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">{t.adminPage.title}</h1>
            <p className="text-muted-foreground mt-1">{t.adminPage.subtitle}</p>
          </div>
          {isAdmin && (
            <Button variant="outline" onClick={() => void logout()} className="rounded-md">
              {t.adminPage.logout}
            </Button>
          )}
        </div>

        {me === undefined ? (
          <p className="text-muted-foreground">…</p>
        ) : !isAdmin ? (
          <div className="bg-white rounded-xl border border-border p-8 text-center max-w-lg mx-auto">
            <p className="text-foreground mb-6">{t.adminPage.loginRequired}</p>
            <Button asChild className="rounded-md bg-primary">
              <Link href="/login">{t.adminPage.goLogin}</Link>
            </Button>
          </div>
        ) : loadError ? (
          <p className="text-destructive">Erreur de chargement.</p>
        ) : inquiries.length === 0 ? (
          <p className="text-muted-foreground">{t.adminPage.noInquiries}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t.adminPage.colDate}</th>
                  <th className="px-4 py-3 font-semibold">{t.adminPage.colName}</th>
                  <th className="px-4 py-3 font-semibold">{t.adminPage.colEmail}</th>
                  <th className="px-4 py-3 font-semibold">{t.adminPage.colInterest}</th>
                  <th className="px-4 py-3 font-semibold min-w-[200px]">{t.adminPage.colMessage}</th>
                  <th className="px-4 py-3 font-semibold">{t.adminPage.colReviewer}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inquiries.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {row.firstName} {row.lastName}
                    </td>
                    <td className="px-4 py-3 break-all">{row.email}</td>
                    <td className="px-4 py-3">{row.interest}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="line-clamp-3">{row.message || row.destinations || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {row.reviewedBy &&
                      typeof row.reviewedBy === "object" &&
                      row.reviewedBy !== null &&
                      "email" in row.reviewedBy
                        ? String((row.reviewedBy as { email?: string }).email ?? "—")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
