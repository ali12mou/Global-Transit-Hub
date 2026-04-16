import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

type Career = {
  id: string;
  title: string;
  location: string;
  contractType: string;
  description: string;
  applyEmail: string;
  createdAt?: string;
};

export default function CareersPage() {
  const { t, language } = useLanguage();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loadError, setLoadError] = useState(false);

  const isRtl = useMemo(() => language === "ar", [language]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/careers");
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(true);
          return;
        }
        const json = (await res.json()) as { careers: Career[] };
        setCareers(json.careers ?? []);
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
          <p className="text-secondary font-bold tracking-[0.2em] text-xs md:text-sm mb-3">{t.ui.careersEyebrow}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-4 leading-tight">
            {t.nav.careers}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
            {t.ui.careersIntro}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loadError ? (
            <p className="text-sm text-destructive">{t.ui.loadErrorTryLater}</p>
          ) : careers.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.ui.noCareers}</p>
          ) : (
            <div className="space-y-4">
              {careers.map((c, idx) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: Math.min(idx, 6) * 0.03 }}
                  className="rounded-xl border border-border bg-white shadow-sm p-6 md:p-7"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">{c.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {[c.location, c.contractType].filter(Boolean).join(" • ") || "—"}
                      </p>
                    </div>
                    {c.applyEmail ? (
                      <a
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 w-fit"
                        href={`mailto:${c.applyEmail}?subject=${encodeURIComponent(`Candidature - ${c.title}`)}`}
                      >
                        {t.ui.applyNow}
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {c.description}
                  </p>
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

