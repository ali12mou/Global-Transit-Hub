import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type PublicClient = {
  id: string;
  name: string;
  images: string[];
};

export function Clients() {
  const [clients, setClients] = useState<PublicClient[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/clients");
        if (!res.ok) throw new Error("bad_status");
        const json = (await res.json()) as { clients: PublicClient[] };
        if (!cancelled) setClients(json.clients ?? []);
      } catch {
        if (!cancelled) setClients([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const marqueeItems = useMemo(() => {
    if (clients.length === 0) return [];
    return [...clients, ...clients];
  }, [clients]);

  return (
    <section id="clients" className="bg-linear-to-b from-white via-[#f8fafc] to-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-14">
          <div className="mb-4 inline-block rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            OUR CLIENTS
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary sm:text-4xl md:text-5xl">Trusted by Our Clients</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Des partenaires qui nous font confiance pour leurs operations de transport, logistique et transit.
          </p>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
            <p className="text-base font-semibold text-primary">Our Clients</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Les clients publies depuis l'admin s'afficheront ici.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />

            <div className="clients-marquee flex w-max gap-4 px-4 hover:paused">
              {marqueeItems.map((client, idx) => (
                <article
                  key={`${client.id}-${idx}`}
                  className="group flex h-[175px] w-[240px] shrink-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                >
                  <div className="flex min-h-[105px] items-center justify-center rounded-xl border border-slate-100 bg-white p-4">
                    {client.images?.[0] ? (
                      <img
                        src={client.images[0]}
                        alt={client.name}
                        className="max-h-20 w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-20 w-full items-center justify-center rounded bg-muted text-sm text-muted-foreground">
                        Logo indisponible
                      </div>
                    )}
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <h3 className="line-clamp-2 text-center text-sm font-semibold text-primary sm:text-base">{client.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
