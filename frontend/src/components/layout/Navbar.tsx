import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import { Language } from "../../translations";

const languages: { code: Language; label: string; name: string }[] = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'am', label: 'AM', name: 'አማርኛ' },
  { code: 'sw', label: 'SW', name: 'Kiswahili' },
  { code: 'so', label: 'SO', name: 'Soomaali' },
  { code: 'orm', label: 'OR', name: 'Afaan Oromoo' },
];

const WHATSAPP_NUMBER = "25377696130";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateTo = (href: string) => {
    setMobileMenuOpen(false);
    setLocation(href);
  };

  const goHome = () => {
    setMobileMenuOpen(false);
    if (location === "/" || location === "") {
      scrollTo("hero");
    } else {
      setLocation("/");
    }
  };

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Top Info Bar */}
      <div className="bg-[#184e3b] text-white text-xs px-4">
        <div className="container mx-auto flex min-h-10 flex-wrap items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-3 md:gap-5 flex-wrap">
            <a href="mailto:info@gttsgroup.com" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Mail className="h-3 w-3 shrink-0" />
              <span>info@gttsgroup.com</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-white/85">
              <Phone className="h-3 w-3 shrink-0" />
              <span>+253 21 34 17 16</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-white/85">
              <Phone className="h-3 w-3 shrink-0" />
              <span>+253 77 82 18 32</span>
            </span>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1 font-semibold text-white transition-colors hover:bg-[#20b859]"
          >
            <MessageCircle className="h-3 w-3" />
            <span className="hidden sm:inline">WhatsApp +253 77 69 61 30</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Nav */}
      <div
        className={`transition-all duration-300 border-b border-slate-200/80 ${
          isScrolled ? "bg-white/98 shadow-lg py-2.5" : "bg-white/96 backdrop-blur-md py-3.5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          <div
            className="flex min-w-0 items-center gap-3 cursor-pointer"
            onClick={goHome}
            role="button"
            tabIndex={0}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 shadow-sm shrink-0">
              <img src="/logo.png" alt="Global Transit and Transport Services" className="max-h-11 w-auto object-contain" />
            </div>
            <div className="hidden md:block min-w-0">
              <p className="truncate font-serif text-lg font-bold text-primary">Global Transit</p>
              <p className="truncate text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                {t.ui.brandTagline}
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-primary/85 hover:text-primary transition-colors font-medium outline-none">
                {t.nav.aboutUs}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-4 min-w-[220px] rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-4 py-3 font-medium text-primary hover:bg-muted"
                  onClick={() => navigateTo("/company")}
                >
                  {t.nav.ourCompany}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-4 py-3 font-medium text-primary hover:bg-muted"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLocation("/team");
                  }}
                >
                  {t.nav.ourTeam}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-4 py-3 font-medium text-primary hover:bg-muted"
                  onClick={() => navigateTo("/careers")}
                >
                  {t.nav.careers}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/activities"
              className="text-sm text-primary/85 hover:text-primary transition-colors font-medium"
            >
              {t.nav.ourBusiness}
            </Link>
            <Link
              href="/projects"
              className="text-sm text-primary/85 hover:text-primary transition-colors font-medium"
            >
              {t.nav.ourProjects}
            </Link>
            <button
              type="button"
              className="text-sm text-primary/85 hover:text-primary transition-colors font-medium"
              onClick={() => {
                if (location === "/" || location === "") {
                  scrollTo("clients");
                } else {
                  setLocation("/");
                  setTimeout(() => {
                    const element = document.getElementById("clients");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }
              }}
            >
              {t.ui.navClients}
            </button>
            <Link
              href="/news"
              className="text-sm text-primary/85 hover:text-primary transition-colors font-medium"
            >
              {t.ui.navNews}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-primary/85 hover:text-primary transition-colors font-medium"
            >
              {t.nav.contactUs}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-primary/15 px-4 py-2 text-sm text-primary/90 hover:bg-primary/5 hover:text-primary transition-colors font-medium"
            >
              {t.nav.login}
            </Link>

            <div className="ml-2 flex items-center gap-3 border-l border-primary/10 pl-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-primary hover:bg-primary/5 hover:text-primary flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="font-bold">{languages.find(l => l.code === language)?.label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      className={`cursor-pointer rounded-lg py-2 px-4 ${language === lang.code ? 'bg-primary/5 font-bold text-primary' : 'text-foreground'}`}
                      onClick={() => setLanguage(lang.code)}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button className="xl:hidden rounded-lg border border-slate-200 bg-white p-2 text-primary shadow-sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full border-t border-slate-200 bg-white shadow-xl flex flex-col p-4 z-50">
            <button onClick={() => navigateTo('/company')} className="text-left text-primary py-4 border-b border-border font-medium">
              {t.nav.aboutUs}
            </button>
            <Link
              href="/activities"
              className="block text-left text-primary py-4 border-b border-border font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.ourBusiness}
            </Link>
            <Link
              href="/projects"
              className="block text-left text-primary py-4 border-b border-border font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.ourProjects}
            </Link>
            <button
              onClick={() => {
                if (location === "/" || location === "") {
                  scrollTo("clients");
                } else {
                  setMobileMenuOpen(false);
                  setLocation("/");
                  setTimeout(() => {
                    const element = document.getElementById("clients");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }
              }}
              className="text-left text-primary py-4 border-b border-border font-medium"
            >
              {t.ui.navClients}
            </button>
            <Link
              href="/contact"
              className="block text-left text-primary py-4 border-b border-border font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.contactUs}
            </Link>
            <Link
              href="/news"
              className="block text-left text-primary py-4 border-b border-border font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.ui.navNews}
            </Link>
            <Link
              href="/careers"
              className="block text-left text-primary py-4 border-b border-border font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.careers}
            </Link>
            <Link
              href="/login"
              className="block text-left text-primary py-4 border-b border-border font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.login}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary py-4 border-b border-border font-medium"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              WhatsApp : +253 77 69 61 30
            </a>

            <div className="pt-6 pb-2">
              <p className="text-primary/50 text-sm mb-3 uppercase tracking-wider">{t.ui.selectLanguage}</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setMobileMenuOpen(false); }}
                    className={`text-left py-2 px-3 ${
                      language === lang.code
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-primary/70 hover:bg-primary/5"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
