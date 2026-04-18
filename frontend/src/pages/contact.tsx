import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { SITE_SERVICE_IDS } from "@/lib/siteServices";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/25377696130";

export default function ContactPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const p = t.contactPage;
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const interestEl = form.elements.namedItem("interest") as HTMLSelectElement;
    const interestLabel =
      interestEl.options[interestEl.selectedIndex]?.text?.trim() || "—";

    const fd = new FormData(form);
    const payload = {
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      interest: interestLabel.slice(0, 80),
      destinations: String(fd.get("destinations") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    setSending(true);
    try {
      const res = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: p.toastTitle,
          description: p.sendError,
        });
        return;
      }
      form.reset();
      toast({
        title: p.toastTitle,
        description: p.toastDesc,
      });
    } catch {
      toast({
        variant: "destructive",
        title: p.toastTitle,
        description: p.sendError,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Navbar />

      <div className="flex-1 pt-32 md:pt-40">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5 space-y-8"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">
                {p.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-serif font-bold text-primary leading-tight">
                {p.headline}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                {p.intro}
              </p>

              <div className="space-y-8 pt-4 border-t border-border/60">
                <div>
                  <p className="text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase mb-1">
                    {p.officeLabel}
                  </p>
                  <p className="text-primary font-medium">{p.office}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase mb-1">
                    {p.phoneLabel}
                  </p>
                  <a
                    href="tel:+25321341716"
                    className="text-secondary font-semibold hover:underline"
                  >
                    {p.phoneDisplay}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-widest text-muted-foreground/80 uppercase mb-1">
                    {p.emailLabel}
                  </p>
                  <a
                    href={`mailto:${p.emailDisplay}`}
                    className="text-secondary font-semibold hover:underline break-all"
                  >
                    {p.emailDisplay}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-border/80 p-6 sm:p-8 md:p-10"
            >
              <h2 className="font-serif font-bold text-2xl text-primary mb-8">
                {p.formTitle}
              </h2>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm text-foreground/80">{p.firstName}</label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                      placeholder={p.firstName}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-foreground/80">{p.lastName}</label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                      placeholder={p.lastName}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground/80">{p.email}</label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                    placeholder={p.email}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground/80">{p.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                    placeholder={p.phone}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-interest" className="text-sm text-foreground/80">
                    {p.interestLabel}
                  </label>
                  <select
                    id="contact-interest"
                    name="interest"
                    aria-label={p.interestLabel}
                    className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  >
                    {SITE_SERVICE_IDS.map((id) => (
                      <option key={id} value={id}>
                        {t.services[id].title}
                      </option>
                    ))}
                    <option value="other">{p.otherService}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground/80">{p.destinationsLabel}</label>
                  <input
                    type="text"
                    name="destinations"
                    className="w-full rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                    placeholder={p.destinationsPlaceholder}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground/80">{p.messageLabel}</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full resize-none rounded-md border border-border bg-white px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                    placeholder={p.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-md bg-primary py-4 text-sm font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {sending ? "…" : p.submit}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Siège — bloc sombre */}
        <section className="bg-[#0a193d] text-white py-16 md:py-20 mt-4">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                {t.contact.info.title}
              </h2>
              <div className="mt-3 h-1 w-14 rounded-full bg-secondary" />
            </div>

            <ul className="space-y-6 mb-10">
              <li className="flex gap-4 items-start">
                <MapPin className="h-6 w-6 text-secondary shrink-0 stroke-[1.75]" />
                <span className="text-white/90 text-sm leading-relaxed pt-0.5">
                  {t.contact.info.address}
                </span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="h-6 w-6 text-secondary shrink-0 stroke-[1.75]" />
                <a href="tel:+25321341716" className="text-white/90 hover:text-white text-sm">
                  +253 21 34 17 16
                </a>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="h-6 w-6 text-secondary shrink-0 stroke-[1.75]" />
                <a href="tel:+25377821832" className="text-white/90 hover:text-white text-sm">
                  +253 77 82 18 32
                </a>
              </li>
              <li className="flex gap-4 items-center">
                <MessageCircle className="h-6 w-6 text-secondary shrink-0 stroke-[1.75]" />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white text-sm"
                >
                  +253 77 69 61 30 (WhatsApp)
                </a>
              </li>
              <li className="flex gap-4 items-center">
                <Mail className="h-6 w-6 text-secondary shrink-0 stroke-[1.75]" />
                <a
                  href="mailto:info@gttsgroup.com"
                  className="text-white/90 hover:text-white text-sm break-all"
                >
                  info@gttsgroup.com
                </a>
              </li>
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-md bg-secondary py-4 px-6 font-bold text-white hover:opacity-95 transition-opacity"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp : +253 77 69 61 30</span>
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
