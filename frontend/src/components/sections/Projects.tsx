import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { apiFetch } from "@/lib/api";

type PublicProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
};

export function Projects() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const fallbackProjects = useMemo(
    () => [
      { id: "p1", title: t.projects.p1.title, desc: t.projects.p1.desc, img: "", category: "" },
      { id: "p2", title: t.projects.p2.title, desc: t.projects.p2.desc, img: "", category: "" },
      { id: "p3", title: t.projects.p3.title, desc: t.projects.p3.desc, img: "", category: "" },
    ],
    [t],
  );

  const [cmsProjects, setCmsProjects] = useState<PublicProject[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/projects");
        if (!res.ok) throw new Error("bad_status");
        const json = (await res.json()) as { projects: PublicProject[] };
        if (!cancelled) setCmsProjects(json.projects ?? []);
      } catch {
        if (!cancelled) setCmsProjects([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured =
    cmsProjects && cmsProjects.length > 0
      ? cmsProjects
          .filter((p) => p.featured !== false)
          .slice(0, 3)
          .map((p) => ({
            id: p.id,
            title: p.title,
            desc: p.description,
            img: p.image,
            category: p.category || "Project",
          }))
      : fallbackProjects;

  return (
    <section id="projects" className="py-16 md:py-24 bg-primary text-white relative">
      <div className="container mx-auto px-4 md:px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 bg-white/10 text-white font-bold tracking-wider text-sm mb-4 border-l-2 border-accent">
              {t.nav.ourProjects.toUpperCase()}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">
              {t.projects.title}
            </h2>
          </div>
          <Link
            href="/projects"
            className={`group flex items-center gap-2 text-secondary hover:text-white transition-colors font-bold self-start md:self-auto ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <span>{t.projects.viewAll}</span>
            <ArrowRight className={`h-5 w-5 transform group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video sm:aspect-4/3 lg:aspect-4/5 overflow-hidden bg-muted mb-4 sm:mb-6">
                {project.img ? (
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
