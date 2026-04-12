import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { MapPin, Ship, TrendingUp } from "lucide-react";

export function Regions() {
  const { t } = useLanguage();

  const regionData = [
    {
      key: "djibouti",
      icon: Ship,
      color: "bg-primary",
      accent: "border-secondary",
      data: t.regions.djibouti
    },
    {
      key: "ethiopia",
      icon: TrendingUp,
      color: "bg-secondary",
      accent: "border-accent",
      data: t.regions.ethiopia
    },
    {
      key: "eastAfrica",
      icon: MapPin,
      color: "bg-accent",
      accent: "border-primary",
      data: t.regions.eastAfrica
    }
  ];

  return (
    <section id="regions" className="py-24 bg-muted relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 800 600" className="w-full h-full" fill="none">
          <circle cx="600" cy="300" r="250" stroke="currentColor" strokeWidth="1" className="text-primary" />
          <circle cx="600" cy="300" r="180" stroke="currentColor" strokeWidth="1" className="text-primary" />
          <circle cx="600" cy="300" r="110" stroke="currentColor" strokeWidth="1" className="text-primary" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold tracking-wider text-sm mb-4 border-l-2 border-secondary">
            {t.regions.title.toUpperCase()}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            {t.regions.subtitle}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regionData.map((region, idx) => {
            const Icon = region.icon;
            return (
              <motion.div
                key={region.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`relative bg-white border-t-4 ${region.accent} shadow-lg p-8 group hover:shadow-xl transition-shadow duration-300`}
              >
                <div className={`w-14 h-14 ${region.color} flex items-center justify-center mb-6`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-primary mb-1">
                  {region.data.name}
                </h3>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  {region.data.role}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {region.data.desc}
                </p>

                <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${region.color}`} />
              </motion.div>
            );
          })}
        </div>

        {/* Corridor visual */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-0 origin-left"
        >
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {["Djibouti", "→", "Dire Dawa", "→", "Addis Ababa", "→", "Afrique de l'Est"].map((stop, i) => (
              <span
                key={i}
                className={
                  stop === "→"
                    ? "text-secondary font-bold text-2xl"
                    : "px-4 py-2 bg-primary text-white text-sm font-bold tracking-wide"
                }
              >
                {stop}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
