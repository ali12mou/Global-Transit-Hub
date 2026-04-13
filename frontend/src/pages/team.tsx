import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

type TeamMember = {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
};

export default function TeamPage() {
  const { t, language } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadError, setLoadError] = useState(false);

  const isRtl = useMemo(() => language === "ar", [language]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/team");
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(true);
          return;
        }
        const json = (await res.json()) as { members: TeamMember[] };
        setMembers(json.members ?? []);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-10 border-b border-border">
        <div className={`container mx-auto px-4 md:px-6 ${isRtl ? "text-right" : ""}`}>
          <p className="text-secondary font-bold tracking-[0.2em] text-xs md:text-sm mb-3">NOTRE ÉQUIPE</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-4 leading-tight">
            {t.nav.ourTeam}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
            Une équipe engagée pour sécuriser vos opérations logistiques, du port de Djibouti jusqu’aux corridors régionaux.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loadError ? (
            <p className="text-sm text-destructive">Erreur de chargement. Réessayez plus tard.</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun membre n’est encore publié.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {members.map((m, idx) => (
                <motion.article
                  key={m.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }}
                  className="rounded-xl border border-border bg-white shadow-sm p-6 md:p-7"
                >
                  <div className="flex items-start gap-4">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.name}
                        className="h-14 w-14 rounded-full object-cover border border-border bg-muted shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-muted border border-border shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg font-bold text-primary truncate">{m.name}</h3>
                      <p className="text-sm font-semibold text-secondary">{m.title}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-primary text-white mt-auto">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Button asChild variant="secondary" className="rounded-none px-8 py-6 text-base font-bold">
            <Link href="/contact">Contactez-nous</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

