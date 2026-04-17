import { Link } from "wouter";
import { useLanguage } from "../../contexts/LanguageContext";
import { SITE_SERVICE_IDS } from "@/lib/siteServices";
import { Linkedin, Twitter, Facebook, Phone, Mail, MessageCircle, MapPin } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-linear-to-b from-[#061126] via-[#081a37] to-[#050d1f] text-white pt-14 md:pt-20 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 mb-12">

          {/* Logo + Social */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm">
                <img src="/logo-transparent.png" alt="Global Transit and Transport Services" className="max-h-14 w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Global Transit</h3>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Transport & Logistics
                </p>
              </div>
            </div>
            <p className="text-white/65 mb-6 text-sm leading-relaxed max-w-md">
              {t.hero.subheadline}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Twitter className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/3 p-5">
            <h4 className="font-serif font-bold text-base mb-5">{t.nav.aboutUs}</h4>
            <ul className="space-y-3">
              <li><Link href="/company" className="text-white/60 hover:text-secondary transition-colors text-sm">{t.nav.ourCompany}</Link></li>
              <li><Link href="/team" className="text-white/60 hover:text-secondary transition-colors text-sm">{t.nav.ourTeam}</Link></li>
              <li><Link href="/careers" className="text-white/60 hover:text-secondary transition-colors text-sm">{t.nav.careers}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/3 p-5">
            <h4 className="font-serif font-bold text-base mb-5">
              <Link href="/activities" className="hover:text-secondary transition-colors">
                {t.nav.ourBusiness}
              </Link>
            </h4>
            <ul className="space-y-3">
              {SITE_SERVICE_IDS.map((id: string) => (
                <li key={id}>
                  <Link
                    href={`/activities#${id}`}
                    className="text-white/60 hover:text-secondary transition-colors text-sm"
                  >
                    {t.services[id].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/3 p-5">
            <h4 className="font-serif font-bold text-base mb-5">{t.contact.info.title}</h4>
            <address className="not-italic text-white/60 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm">{t.contact.info.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <a href="tel:+25321341716" className="hover:text-secondary transition-colors text-sm">+253 21 34 17 16</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <a href="tel:+25377821832" className="hover:text-secondary transition-colors text-sm">+253 77 82 18 32</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#25D366] shrink-0" />
                <a href="https://wa.me/25377696130" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors font-medium text-sm">+253 77 69 61 30 (WhatsApp)</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <a href="mailto:info@gttsgroup.com" className="hover:text-secondary transition-colors text-sm break-all">info@gttsgroup.com</a>
              </div>
            </address>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          <div>
            <p className="text-white/50 text-xs sm:text-sm">{t.footer.copyright}</p>
            <p className="text-white/40 text-xs mt-1">
              {t.footer.developer && (
                <>
                  {t.footer.developer}
                  {" "}
                  <a href="https://geosomtech.fr" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary/90 transition-colors">
                    geosomtech.fr
                  </a>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link
              href="/login?next=/admin"
              className="text-secondary font-semibold hover:text-secondary/90 transition-colors"
            >
              {t.nav.admin}
            </Link>
            {t.footer.links.map((link: string, i: number) => (
              <a key={i} href="#" className="text-white/50 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
