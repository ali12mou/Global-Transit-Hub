import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import p1Img from "../../assets/project-1.png";
import p2Img from "../../assets/project-2.png";
import shipImg from "@assets/image_1776015615848.png";

export function Projects() {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const projects = [
    {
      id: 'p1',
      title: t.projects.p1.title,
      desc: t.projects.p1.desc,
      img: p1Img,
      category: "Heavy Lift"
    },
    {
      id: 'p2',
      title: t.projects.p2.title,
      desc: t.projects.p2.desc,
      img: p2Img,
      category: "Infrastructure"
    },
    {
      id: 'p3',
      title: t.projects.p3.title,
      desc: t.projects.p3.desc,
      img: shipImg,
      category: "Intercontinental"
    }
  ];

  return (
    <section id="projects" className="py-24 bg-primary text-white relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 bg-white/10 text-white font-bold tracking-wider text-sm mb-4 border-l-2 border-accent">
              {t.nav.ourProjects.toUpperCase()}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              {t.projects.title}
            </h2>
          </div>
          <button className={`group flex items-center gap-2 text-secondary hover:text-white transition-colors font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span>{t.projects.viewAll}</span>
            <ArrowRight className={`h-5 w-5 transform group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-6">
                <img 
                  src={project.img} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-accent text-sm font-bold tracking-widest uppercase mb-3">
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">
                    {project.title}
                  </h3>
                  <p className="text-white/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}