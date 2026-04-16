import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

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
    <section id="partners" className="bg-[#f8fafc] py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-14">
          <div className="mb-4 inline-block border-l-2 border-secondary bg-white px-3 py-1 text-sm font-bold tracking-wider text-primary">
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
              <div key={type} className="space-y-5">
                <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                  <h3 className="text-xl font-semibold text-primary">{TYPE_LABELS[type] ?? type}</h3>
                  <span className="text-sm text-muted-foreground">{items.length} element(s)</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((partner, idx) => (
                    <motion.article
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.45, delay: sectionIdx * 0.05 + idx * 0.05 }}
                      className="rounded-2xl border border-border bg-white p-5 shadow-sm"
                    >
                      <div className="flex min-h-[130px] items-center justify-center rounded-xl bg-muted/30 p-4">
                        {partner.images?.[0] ? (
                          <img src={partner.images[0]} alt={partner.name} className="max-h-20 w-full object-contain" />
                        ) : (
                          <div className="flex h-20 w-full items-center justify-center rounded bg-muted text-sm text-muted-foreground">
                            Pas de logo
                          </div>
                        )}
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                          {TYPE_LABELS[type] ?? type}
                        </p>
                        <h4 className="text-base font-semibold text-primary">{partner.name}</h4>
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
