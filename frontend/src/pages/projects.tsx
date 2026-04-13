import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  createdAt?: string;
};

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadError, setLoadError] = useState(false);

  const isRtl = useMemo(() => language === "ar", [language]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/projects");
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(true);
          return;
        }
        const json = (await res.json()) as { projects: Project[] };
        setProjects(json.projects ?? []);
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

      <section className="pt-32 md:pt-40 pb-10 border-b border-border bg-primary text-white">
        <div className={`container mx-auto px-4 md:px-6 ${isRtl ? "text-right" : ""}`}>
          <p className="text-accent font-bold tracking-[0.2em] text-xs md:text-sm mb-3">{t.nav.ourProjects.toUpperCase()}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            {t.projects.title}
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-3xl">
            Découvrez nos projets et opérations phares.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loadError ? (
            <p className="text-sm text-destructive">Erreur de chargement. Réessayez plus tard.</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun projet n’est publié pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, idx) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                  className="group rounded-xl border border-border bg-white shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-4/3 bg-muted overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary">
                        {p.category || "Project"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-serif text-xl font-bold text-primary mb-2">{p.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-line">
                      {p.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

