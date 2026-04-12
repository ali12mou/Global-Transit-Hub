import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { Globe2, Anchor, ShieldCheck } from "lucide-react";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block px-3 py-1 bg-muted text-primary font-bold tracking-wider text-sm mb-4 border-l-2 border-secondary">
              {t.nav.aboutUs.toUpperCase()}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">
              {t.about.title}
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed">
              {t.about.description}
            </p>

            <div className="bg-muted p-6 sm:p-8 border-l-4 border-accent">
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 flex items-center gap-3">
                <ShieldCheck className="text-secondary shrink-0" />
                {t.about.missionTitle}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t.about.missionText}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {t.about.stats.map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-8 bg-white border border-border shadow-sm flex flex-col justify-center ${idx === 2 ? 'sm:col-span-2 bg-primary text-white border-none' : ''}`}
              >
                {idx === 0 && <Globe2 className="h-8 w-8 sm:h-10 sm:w-10 text-secondary mb-4 opacity-50" />}
                {idx === 1 && <Anchor className="h-8 w-8 sm:h-10 sm:w-10 text-secondary mb-4 opacity-50" />}

                <span className={`text-3xl sm:text-5xl font-serif font-bold mb-2 ${idx === 2 ? 'text-accent' : 'text-primary'}`}>
                  {stat.value}
                </span>
                <span className={`font-medium text-sm sm:text-base ${idx === 2 ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
