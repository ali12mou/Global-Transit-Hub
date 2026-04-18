import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import heroBg from "../assets/hero-bg.png";
import { SITE_SERVICE_IDS, siteServiceImages } from "@/lib/siteServices";

type PublicService = {
  id: string;
  service: string;
  description: string;
  images: string[];
};

type PublicOperation = {
  id: string;
  description: string;
  images: string[];
};

export default function ActivitiesPage() {
  const { t, language } = useLanguage();
  const p = t.activitiesPage;
  const isRtl = language === "ar";

  const [services, setServices] = useState<PublicService[] | null>(null);
  const [operations, setOperations] = useState<PublicOperation[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sRes, oRes] = await Promise.all([
          apiFetch("/public/activities/services"),
          apiFetch("/public/activities/operations"),
        ]);
        if (cancelled) return;
        if (!sRes.ok || !oRes.ok) {
          setLoadError(true);
          return;
        }
        const sJson = (await sRes.json()) as { services: PublicService[] };
        const oJson = (await oRes.json()) as { operations: PublicOperation[] };
        setServices(sJson.services ?? []);
        setOperations(oJson.operations ?? []);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const serviceCards = useMemo(() => {
    if (!services || services.length === 0) {
      // Fallback: contenu statique si la table admin est vide
      return SITE_SERVICE_IDS.map((id) => ({
        id,
        title: t.services[id].title,
        desc: t.services[id].desc,
        img: siteServiceImages[id],
      }));
    }
    return services.map((s) => ({
      id: s.id,
      title: s.service,
      desc: s.description,
      img: s.images?.[0] || "",
    }));
  }, [services, t]);

  const galleryItems = useMemo(() => {
    const caps = [p.cap1, p.cap2, p.cap3, p.cap4, p.cap5, p.cap6] as const;
    if (!operations || operations.length === 0) {
      // Fallback: pas d’opérations en DB → captions statiques
      return caps.map((c, i) => ({ key: `cap_${i}`, src: "", desc: c }));
    }
    const flat: { key: string; src: string; desc: string }[] = [];
    for (const op of operations) {
      for (const src of op.images ?? []) {
        flat.push({ key: `${op.id}_${src}`, src, desc: op.description || "" });
      }
    }
    return flat.slice(0, 60);
  }, [operations, p]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="relative min-h-[42vh] md:min-h-[48vh] flex items-end pt-32 md:pt-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/85 to-primary/55" />
        </div>
        <div className={`container relative z-10 mx-auto px-4 md:px-6 pb-12 md:pb-16 ${isRtl ? "text-right" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-secondary font-bold tracking-[0.2em] text-xs md:text-sm mb-3">{p.eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              {p.title}
            </h1>
            <p className="text-white/85 text-base md:text-lg max-w-2xl">{p.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed text-center">{p.intro}</p>
        </div>
      </section>

      <section id="pillars" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-12 md:mb-16">
            {p.pillarsTitle}
          </h2>
          {loadError && (
            <p className="text-center text-sm text-destructive mb-6">
              Erreur de chargement. Affichage du contenu par défaut.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {serviceCards.map((item, idx) => (
              <motion.article
                key={item.id}
                id={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="scroll-mt-36 bg-white shadow-md overflow-hidden border border-border/80"
              >
                <div className="aspect-video overflow-hidden">
                  {item.img ? (
                    <img src={resolveMediaUrl(item.img)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-10 md:mb-14">
            {p.galleryTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {galleryItems.map((it, i) => (
              <motion.figure
                key={it.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm"
              >
                <div className="aspect-4/3 overflow-hidden">
                  {it.src ? (
                    <img
                      src={resolveMediaUrl(it.src)}
                      alt={it.desc}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <figcaption className="p-3 md:p-4 text-xs md:text-sm text-muted-foreground leading-snug">
                  {it.desc}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Button asChild variant="secondary" className="rounded-none px-8 py-6 text-base font-bold">
            <Link href="/contact">{p.cta}</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
