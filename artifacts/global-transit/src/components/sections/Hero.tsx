import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <section id="hero" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Cargo ship at sea" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/90 backdrop-blur-sm text-white mb-6 border-l-4 border-accent uppercase tracking-widest text-sm font-bold">
              Global Transit and Transport Services
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight mb-6">
              {t.hero.headline}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl leading-relaxed"
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <button 
              onClick={() => scrollTo('business')}
              className={`group flex items-center justify-center gap-4 bg-accent hover:bg-accent/90 text-white px-8 py-5 text-lg font-bold transition-all duration-300 shadow-xl ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <span>{t.hero.cta}</span>
              <ArrowRight className={`h-6 w-6 transform group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-32 bg-secondary/80 backdrop-blur-sm hidden lg:flex items-center px-12 z-10 border-t-4 border-accent">
        <div className="text-white">
          <p className="text-4xl font-serif font-bold mb-1">ISO 9001</p>
          <p className="text-sm uppercase tracking-wider opacity-80">Certified Maritime Operations</p>
        </div>
      </div>
    </section>
  );
}