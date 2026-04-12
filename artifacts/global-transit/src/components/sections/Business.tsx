import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import maritimeImg from "../../assets/service-maritime.png";
import airImg from "../../assets/service-air.png";
import landImg from "../../assets/service-land.png";
import supplyImg from "../../assets/service-supply.png";

export function Business() {
  const { t } = useLanguage();

  const services = [
    {
      id: 'maritime',
      title: t.services.maritime.title,
      desc: t.services.maritime.desc,
      img: maritimeImg,
    },
    {
      id: 'air',
      title: t.services.air.title,
      desc: t.services.air.desc,
      img: airImg,
    },
    {
      id: 'land',
      title: t.services.land.title,
      desc: t.services.land.desc,
      img: landImg,
    },
    {
      id: 'supply',
      title: t.services.supply.title,
      desc: t.services.supply.desc,
      img: supplyImg,
    }
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="p-5 sm:p-8 relative">
                <div className="absolute top-0 right-5 sm:right-8 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-secondary text-white flex items-center justify-center font-serif text-lg sm:text-xl font-bold shadow-lg">
                  0{idx + 1}
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
