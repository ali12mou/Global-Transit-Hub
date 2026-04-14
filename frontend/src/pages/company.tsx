import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function CompanyPage() {
  const { t, language } = useLanguage();
  const isRtl = useMemo(() => language === "ar", [language]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-10 border-b border-border">
        <div className={`container mx-auto px-4 md:px-6 ${isRtl ? "text-right" : ""}`}>
          <p className="text-secondary font-bold tracking-[0.2em] text-xs md:text-sm mb-3">NOTRE ENTREPRISE</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-4 leading-tight">
            {t.nav.ourCompany}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl">{t.about.title}</p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className={`container mx-auto px-4 md:px-6 ${isRtl ? "text-right" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-2 rounded-xl border border-border bg-white shadow-sm p-7 md:p-8"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-4">{t.about.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{t.about.description}</p>

              <p className="text-muted-foreground leading-relaxed text-sm mb-8">{t.about.backgroundText}</p>

              <div className="mt-8 rounded-lg bg-muted border border-border p-6">
                <h3 className="font-serif text-lg font-bold text-primary mb-2">{t.about.missionTitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.about.missionText}</p>
              </div>
            </motion.div>

            <div className="space-y-4">
              {t.about.stats.map((stat: { value: string; label: string }, idx: number) => (
                <div key={idx} className="rounded-xl border border-border bg-white shadow-sm p-6">
                  <p className="text-3xl font-serif font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

