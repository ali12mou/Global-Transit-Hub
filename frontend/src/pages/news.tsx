import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

type NewsRow = {
  id: string;
  name: string;
  description: string;
  publishedAt?: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  showInMoreToRead?: boolean;
};

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsPage() {
  const { language } = useLanguage();
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loadError, setLoadError] = useState(false);
  const isRtl = useMemo(() => language === "ar", [language]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/news");
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(true);
          return;
        }
        const json = (await res.json()) as { news: NewsRow[] };
        setItems(json.news ?? []);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = items.slice(0, 3);
  const featuredIds = new Set(featured.map((item) => item.id));
  const moreTagged = items.filter((item) => item.showInMoreToRead !== false && !featuredIds.has(item.id));
  const moreFallback = items.filter((item) => !featuredIds.has(item.id));
  const more = (moreTagged.length > 0 ? moreTagged : moreFallback).slice(0, 5);
  const moreToDisplay = more.length > 0 ? more : featured.slice(0, 3);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-10 border-b border-border bg-primary text-white">
        <div className={`container mx-auto px-4 md:px-6 ${isRtl ? "text-right" : ""}`}>
          <p className="text-accent font-bold tracking-[0.2em] text-xs md:text-sm mb-3">NEWS</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">Latest Stories</h1>
          <p className="text-white/80 text-base md:text-lg max-w-3xl">
            Actualites, operations et annonces importantes de Global Transit and Transport Services.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {loadError ? (
            <p className="text-sm text-destructive">Erreur de chargement des news.</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune news publiee pour le moment.</p>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,780px)_minmax(280px,360px)] xl:justify-center xl:items-start">
                <div className="space-y-5">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                    >
                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Global Transit News</p>
                            <h2 className="mt-2 text-lg font-semibold leading-snug text-primary sm:text-xl">{item.name}</h2>
                          </div>
                          <p className="shrink-0 text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p>
                        </div>

                        {item.images?.[0] ? (
                          <div className="mb-4 overflow-hidden rounded-xl bg-muted">
                            <img src={item.images[0]} alt={item.name} className="max-h-[460px] w-full object-cover" />
                          </div>
                        ) : (
                          <div className="mb-4 aspect-video w-full rounded-xl bg-muted" />
                        )}

                        <p className="text-sm leading-7 text-muted-foreground sm:text-[15px]">{item.description}</p>

                        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                          <span>
                            {item.likesCount} likes • {item.commentsCount} commentaires
                          </span>
                          <span className="font-medium text-primary/80">Actualite recente</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <aside className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5 xl:sticky xl:top-24">
                  <h3 className="mb-4 text-lg font-bold text-primary">More to read</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    {moreToDisplay.map((item) => (
                      <article key={item.id} className="flex items-start gap-3 rounded-lg border border-border/60 p-2 sm:p-3">
                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded bg-muted sm:h-20 sm:w-24">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="line-clamp-2 text-sm font-semibold text-primary sm:text-base">{item.name}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
