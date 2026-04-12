import { useLanguage } from "../../contexts/LanguageContext";
import { Ship, Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#080d26] text-white pt-16 pb-8 border-t-[4px] border-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Ship className="h-8 w-8 text-secondary" />
              <span className="text-white font-serif font-bold text-2xl tracking-wide">Global Transit</span>
            </div>
            <p className="text-white/60 mb-6 max-w-sm">
              {t.hero.subheadline}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">{t.nav.aboutUs}</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/60 hover:text-secondary transition-colors">{t.nav.ourCompany}</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary transition-colors">{t.nav.ourTeam}</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary transition-colors">{t.nav.careers}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">{t.nav.ourBusiness}</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/60 hover:text-secondary transition-colors">{t.services.maritime.title}</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary transition-colors">{t.services.air.title}</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary transition-colors">{t.services.land.title}</a></li>
              <li><a href="#" className="text-white/60 hover:text-secondary transition-colors">{t.services.supply.title}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">{t.contact.info.title}</h4>
            <address className="not-italic text-white/60 space-y-4">
              <p>{t.contact.info.address}</p>
              <p>{t.contact.info.phone}</p>
              <p>{t.contact.info.email}</p>
            </address>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">{t.footer.copyright}</p>
          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            {t.footer.links.map((link, i) => (
              <a key={i} href="#" className="hover:text-white transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}