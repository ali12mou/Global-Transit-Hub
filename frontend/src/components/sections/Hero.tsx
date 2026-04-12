import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import heroBg from "../../assets/hero-bg.png";

export function Hero() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center pt-32 sm:pt-36 overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Cargo ship at sea"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/90 backdrop-blur-sm text-white mb-6 border-l-4 border-accent uppercase tracking-widest text-[10px] sm:text-xs font-bold">
              Global Transit and Transport Services
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-bold text-white leading-tight mb-5">
              {t.hero.headline}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 max-w-2xl leading-relaxed"
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => scrollTo('business')}
              className={`group flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg font-bold transition-all duration-300 shadow-xl w-full sm:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <span>{t.hero.cta}</span>
              <ArrowRight className={`h-5 w-5 transform group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>

            <a
              href="https://wa.me/25377696130"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20b859] text-white px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg font-bold transition-all duration-300 shadow-xl w-full sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
          </motion.div>

          {/* Mobile contact quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6 lg:hidden"
          >
            <a href="tel:+25321341716" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
              <Phone className="h-4 w-4 text-secondary shrink-0" />
              +253 21 34 17 16
            </a>
            <a href="tel:+25377821832" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
              <Phone className="h-4 w-4 text-secondary shrink-0" />
              +253 77 82 18 32
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative ISO badge — desktop only */}
      <div className="absolute bottom-0 right-0 w-1/3 h-28 bg-secondary/80 backdrop-blur-sm hidden lg:flex items-center px-12 z-10 border-t-4 border-accent">
        <div className="text-white">
          <p className="text-4xl font-serif font-bold mb-1">ISO 9001</p>
          <p className="text-sm uppercase tracking-wider opacity-80">Certified Maritime Operations</p>
        </div>
      </div>
    </section>
  );
}
