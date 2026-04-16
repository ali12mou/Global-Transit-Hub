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
    <section id="clients" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-14">
          <div className="mb-4 inline-block border-l-2 border-secondary bg-muted px-3 py-1 text-sm font-bold tracking-wider text-primary">
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
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent" />

            <div className="clients-marquee flex w-max gap-4 px-4 hover:paused">
              {marqueeItems.map((client, idx) => (
                <article
                  key={`${client.id}-${idx}`}
                  className="flex h-[150px] w-[220px] shrink-0 flex-col justify-between rounded-xl border border-border bg-white p-4 shadow-sm sm:w-[240px]"
                >
                  <div className="flex flex-1 items-center justify-center rounded-lg bg-muted/40 p-3">
                    {client.images?.[0] ? (
                      <img src={client.images[0]} alt={client.name} className="max-h-16 w-full object-contain sm:max-h-20" />
                    ) : (
                      <div className="h-16 w-full rounded bg-muted" />
                    )}
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-center text-sm font-semibold text-primary sm:text-base">{client.name}</h3>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
