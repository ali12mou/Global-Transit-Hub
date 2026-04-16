import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  Clipboard,
  FileCheck2,
  FileText,
  MessageSquare,
  Route,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

export default function CompanyPage() {
  const { t, language } = useLanguage();
  const isRtl = useMemo(() => language === "ar", [language]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border bg-linear-to-b from-slate-50 to-white pt-32 pb-12 md:pt-40 md:pb-16">
        <div className={`container mx-auto px-4 md:px-6 ${isRtl ? "text-right" : ""}`}>
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-secondary md:text-sm">
            {t.nav.ourCompany?.toUpperCase?.() ?? "À PROPOS"}
          </p>
          <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[1.5fr_0.8fr] xl:gap-12">
            <div>
              <h1 className="mb-5 font-serif text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                Global Transit and Transport Services
              </h1>
              <p className="max-w-4xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t.about.description}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <img src="/logo.png" alt="Global Transit" className="max-h-14 w-auto object-contain" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-primary">Global Transit</p>
                  <p className="text-sm text-muted-foreground">
                    {t.ui.companySummary}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-4 text-sm text-primary">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                <span>{t.ui.companyTrustNote}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text + Services */}
      <section className="py-14 md:py-20">
        <div className={`container mx-auto px-4 md:px-6 ${isRtl ? "text-right" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-2 rounded-xl border border-border bg-white shadow-sm p-7 md:p-8"
            >
              <h2 className="mb-4 font-serif text-2xl font-bold text-primary md:text-3xl">{t.about.missionTitle}</h2>
              <p className="mb-4 leading-relaxed text-muted-foreground">{t.about.missionText}</p>
              <p className="mb-8 leading-relaxed text-muted-foreground">{t.about.description}</p>

              {/* Services (traduits) */}
              <div className="rounded-lg bg-muted/40 border border-border p-6 md:p-7">
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="font-semibold text-primary">{t.ui.keyStrengths}</p>
                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
                      {t.ui.professionalStandards}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-3.5 py-3 text-sm text-primary">
                      <MessageSquare className="h-4 w-4 text-secondary shrink-0" aria-hidden />
                      <span className="font-medium">{t.ui.strengthCommunication}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-3.5 py-3 text-sm text-primary">
                      <Users className="h-4 w-4 text-secondary shrink-0" aria-hidden />
                      <span className="font-medium">{t.ui.strengthTeamwork}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-3.5 py-3 text-sm text-primary">
                      <Clipboard className="h-4 w-4 text-secondary shrink-0" aria-hidden />
                      <span className="font-medium">{t.ui.strengthProcessReport}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-3.5 py-3 text-sm text-primary">
                      <Briefcase className="h-4 w-4 text-secondary shrink-0" aria-hidden />
                      <span className="font-medium">{t.ui.strengthResponsibility}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-3.5 py-3 text-sm text-primary sm:col-span-2">
                      <FileCheck2 className="h-4 w-4 text-secondary shrink-0" aria-hidden />
                      <span className="font-medium">{t.ui.strengthFinalReport}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-bold text-primary mb-4">{t.services.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div className="rounded-xl border border-border bg-white p-4">
                    <Truck className="h-6 w-6 text-secondary mb-2" aria-hidden />
                    <p className="font-semibold text-primary">{t.services.logistics.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.services.logistics.desc}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4">
                    <Route className="h-6 w-6 text-secondary mb-2" aria-hidden />
                    <p className="font-semibold text-primary">{t.services.transit.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.services.transit.desc}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4">
                    <ShieldCheck className="h-6 w-6 text-secondary mb-2" aria-hidden />
                    <p className="font-semibold text-primary">{t.services.clearance.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.services.clearance.desc}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4">
                    <Clipboard className="h-6 w-6 text-secondary mb-2" aria-hidden />
                    <p className="font-semibold text-primary">{t.services.customs.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.services.customs.desc}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4 sm:col-span-2">
                    <FileText className="h-6 w-6 text-secondary mb-2" aria-hidden />
                    <p className="font-semibold text-primary">{t.services.documents.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t.services.documents.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Experience */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="rounded-xl border border-border bg-white shadow-sm p-7 md:p-8"
              >
                <h3 className="font-serif text-xl font-bold text-primary mb-3">{t.ui.experienceTitle}</h3>
                <p className="text-4xl font-serif font-bold text-primary">{t.ui.experienceValue}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t.ui.experienceDesc}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-semibold text-primary">{t.ui.strengthCommunication}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-semibold text-primary">{t.ui.strengthTeamwork}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-semibold text-primary">{t.ui.strengthProcessReport}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-semibold text-primary">{t.ui.strengthResponsibility}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm font-semibold text-primary">{t.ui.strengthFinalReport}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="rounded-xl border border-border bg-muted/40 shadow-sm p-6 md:p-7"
              >
                <p className="font-semibold text-primary">{t.about.missionTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.about.missionText}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

