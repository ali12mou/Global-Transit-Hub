import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-muted text-primary font-bold tracking-wider text-sm mb-4 border-l-2 border-secondary">
              {t.nav.contactUs.toUpperCase()}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              {t.contact.title}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-muted p-8 md:p-12 border-t-4 border-primary shadow-lg"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wide">
                    {t.contact.form.name}
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                    placeholder={t.contact.form.name}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wide">
                    {t.contact.form.email}
                  </label>
                  <input 
                    type="email" 
                    className="w-full p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                    placeholder={t.contact.form.email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide">
                  {t.contact.form.service}
                </label>
                <select className="w-full p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all appearance-none rounded-none">
                  <option>{t.services.maritime.title}</option>
                  <option>{t.services.air.title}</option>
                  <option>{t.services.land.title}</option>
                  <option>{t.services.supply.title}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide">
                  {t.contact.form.message}
                </label>
                <textarea 
                  rows={4}
                  className="w-full p-4 bg-white border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all resize-none"
                  placeholder={t.contact.form.message}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-5 text-lg transition-colors shadow-md"
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