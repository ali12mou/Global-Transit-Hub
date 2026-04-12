import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import { Language } from "../../translations";

const languages: { code: Language; label: string; name: string }[] = [
  { code: 'fr', label: 'FR', name: 'Français' },
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
      <div className="bg-[#1B6B4A] text-white text-xs py-2 px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a href="mailto:info@gttsgroup.com" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Mail className="h-3 w-3 shrink-0" />
              <span>info@gttsgroup.com</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5">
              <Phone className="h-3 w-3 shrink-0" />
              <span>+253 21 34 17 16</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="h-3 w-3 shrink-0" />
              <span>+253 77 82 18 32</span>
            </span>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20b859] text-white px-3 py-1 rounded-full font-semibold transition-colors"
          >
            <MessageCircle className="h-3 w-3" />
            <span>WhatsApp +253 77 69 61 30</span>
          </a>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-primary shadow-md py-3' : 'bg-primary/95 backdrop-blur-sm py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={goHome}>
            <div className="bg-white rounded-md px-3 py-1.5">
              <img src="/logo.png" alt="Global Transit and Transport Services" className="h-14 w-auto" />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white/90 hover:text-white transition-colors font-medium outline-none">
                {t.nav.aboutUs}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-none rounded-none shadow-xl min-w-[200px] mt-4">
                <DropdownMenuItem className="cursor-pointer hover:bg-muted py-3 px-4 font-medium text-primary rounded-none" onClick={() => scrollTo('about')}>{t.nav.ourCompany}</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-muted py-3 px-4 font-medium text-primary rounded-none" onClick={() => scrollTo('about')}>{t.nav.ourTeam}</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-muted py-3 px-4 font-medium text-primary rounded-none" onClick={() => scrollTo('about')}>{t.nav.careers}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/activities"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              {t.nav.ourBusiness}
            </Link>
            <button onClick={() => scrollTo('projects')} className="text-white/90 hover:text-white transition-colors font-medium">
              {t.nav.ourProjects}
            </button>
            <Link
              href="/contact"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              {t.nav.contactUs}
            </Link>
            <Link
              href="/login"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              {t.nav.login}
            </Link>

            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white rounded-none flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-bold">{languages.find(l => l.code === language)?.label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white rounded-none shadow-xl border-none">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      className={`cursor-pointer py-2 px-4 rounded-none ${language === lang.code ? 'bg-primary/5 font-bold text-primary' : 'text-foreground'}`}
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
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-primary border-t border-white/10 shadow-xl flex flex-col p-4 z-50">
            <button onClick={() => scrollTo('about')} className="text-left text-white py-4 border-b border-white/10 font-medium">
              {t.nav.aboutUs}
            </button>
            <Link
              href="/activities"
              className="block text-left text-white py-4 border-b border-white/10 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.ourBusiness}
            </Link>
            <button onClick={() => scrollTo('projects')} className="text-left text-white py-4 border-b border-white/10 font-medium">
              {t.nav.ourProjects}
            </button>
            <Link
              href="/contact"
              className="block text-left text-white py-4 border-b border-white/10 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.contactUs}
            </Link>
            <Link
              href="/login"
              className="block text-left text-white py-4 border-b border-white/10 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.login}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white py-4 border-b border-white/10 font-medium"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              WhatsApp : +253 77 69 61 30
            </a>

            <div className="pt-6 pb-2">
              <p className="text-white/50 text-sm mb-3 uppercase tracking-wider">Select Language</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setMobileMenuOpen(false); }}
                    className={`text-left py-2 px-3 ${language === lang.code ? 'bg-white/20 text-white font-bold' : 'text-white/70 hover:bg-white/10'}`}
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
