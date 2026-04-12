import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block px-3 py-1 bg-muted text-primary font-bold tracking-wider text-sm mb-4 border-l-2 border-secondary">
            {t.nav.contactUs.toUpperCase()}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary">
            {t.contact.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

          {/* Contact Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-primary text-white p-8 flex flex-col gap-6"
          >
            <div>
              <h3 className="font-serif font-bold text-xl mb-1">{t.contact.info.title}</h3>
              <div className="w-10 h-1 bg-secondary mt-2 mb-6" />
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm leading-relaxed">{t.contact.info.address}</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-secondary shrink-0" />
              <a href="tel:+25321341716" className="text-white/80 hover:text-white text-sm transition-colors">+253 21 34 17 16</a>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-secondary shrink-0" />
              <a href="tel:+25377821832" className="text-white/80 hover:text-white text-sm transition-colors">+253 77 82 18 32</a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-secondary shrink-0" />
              <a href="mailto:info@gttsgroup.com" className="text-white/80 hover:text-white text-sm transition-colors break-all">info@gttsgroup.com</a>
            </div>

            <a
              href="https://wa.me/25377696130"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20b859] text-white px-5 py-3 font-bold transition-colors w-full justify-center mt-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp : +253 77 69 61 30</span>
            </a>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3 bg-muted p-6 sm:p-8 md:p-10 border-t-4 border-primary shadow-lg"
          >
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wide">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 sm:p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-sm"
                    placeholder={t.contact.form.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wide">
                    {t.contact.form.email}
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 sm:p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-sm"
                    placeholder={t.contact.form.email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wide">
                  {t.contact.form.service}
                </label>
                <select className="w-full p-3 sm:p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all appearance-none rounded-none text-sm">
                  <option>{t.services.maritime.title}</option>
                  <option>{t.services.land.title}</option>
                  <option>{t.services.supply.title}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wide">
                  {t.contact.form.message}
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 sm:p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all resize-none text-sm"
                  placeholder={t.contact.form.message}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 text-base transition-colors shadow-md"
              >
                {t.contact.form.submit}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
