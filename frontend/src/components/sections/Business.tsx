import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { SITE_SERVICE_IDS, siteServiceImages } from "@/lib/siteServices";
import { apiFetch } from "@/lib/api";

type PublicService = {
  id: string;
  service: string;
  description: string;
  images: string[];
  active: boolean;
};

export function Business() {
  const { t } = useLanguage();

  const fallbackServices = useMemo(
    () =>
      SITE_SERVICE_IDS.map((id) => ({
        id,
        title: t.services[id].title,
        desc: t.services[id].desc,
        img: siteServiceImages[id],
      })),
    [t],
  );

  const [cmsServices, setCmsServices] = useState<PublicService[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/public/activities/services");
        if (!res.ok) throw new Error("bad_status");
        const json = (await res.json()) as { services: PublicService[] };
        if (!cancelled) setCmsServices(json.services ?? []);
      } catch {
        if (!cancelled) setCmsServices([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const services =
    cmsServices && cmsServices.length > 0
      ? cmsServices.map((s) => ({
          id: s.id,
          title: s.service,
          desc: s.description,
          img: (s.images ?? [])[0] ?? "",
        }))
      : fallbackServices;

  return (
    <section id="business" className="py-16 md:py-24 bg-muted relative">
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-block px-3 py-1 bg-white text-primary font-bold tracking-wider text-sm mb-4 border-l-2 border-secondary shadow-sm">
            {t.nav.ourBusiness.toUpperCase()}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary">
            {t.services.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, idx: number) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video overflow-hidden relative">
                {service.img ? (
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="p-5 sm:p-8 relative">
                <div className="absolute top-0 right-5 sm:right-8 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-secondary text-white flex items-center justify-center font-serif text-lg sm:text-xl font-bold shadow-lg">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-3 sm:mb-4 group-hover:text-secondary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
