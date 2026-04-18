import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/mediaUrl";

type PublicPartner = {
  id: string;
  name: string;
  type: string;
  images: string[];
};

const TYPE_LABELS: Record<string, string> = {
  ports: "Ports",
  "shipping line": "Shipping Line",
  "free zone": "Free Zone",
};

export function Partners() {
  const [partners, setPartners] = useState<PublicPartner[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/partners");
        if (!res.ok) throw new Error("bad_status");
        const json = (await res.json()) as { partners: PublicPartner[] };
        if (!cancelled) setPartners(json.partners ?? []);
      } catch {
        if (!cancelled) setPartners([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, PublicPartner[]>();
    for (const partner of partners) {
      const key = partner.type || "autre";
      map.set(key, [...(map.get(key) ?? []), partner]);
    }
    return Array.from(map.entries());
  }, [partners]);

  return (
    <section id="partners" className="bg-linear-to-b from-[#f8fafc] via-white to-[#f8fafc] py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-14">
          <div className="mb-4 inline-block rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            NOS PARTENAIRES
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl md:text-5xl">Ports et partenaires strategiques</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Nos partenaires portuaires, shipping lines et zones franches qui soutiennent nos operations logistiques.
          </p>
        </div>

        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-10 text-center">
            <p className="text-base font-semibold text-primary">Nos Partenaires</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Les partenaires ajoutes depuis l'admin s'afficheront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(([type, items], sectionIdx) => (
              <div key={type} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-semibold text-primary">{TYPE_LABELS[type] ?? type}</h3>
                  <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                    {items.length} element(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((partner, idx) => (
                    <motion.article
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.45, delay: sectionIdx * 0.05 + idx * 0.05 }}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                    >
                      <div className="flex min-h-[130px] items-center justify-center rounded-xl border border-slate-100 bg-white p-4">
                        {partner.images?.[0] ? (
                          <img
                            src={resolveMediaUrl(partner.images[0])}
                            alt={partner.name}
                            className="max-h-20 w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-20 w-full items-center justify-center rounded bg-muted text-sm text-muted-foreground">
                            Pas de logo
                          </div>
                        )}
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="inline-block rounded-full bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                          {TYPE_LABELS[type] ?? type}
                        </p>
                        <h4 className="pt-1 text-base font-semibold text-primary">{partner.name}</h4>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
