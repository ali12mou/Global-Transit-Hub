import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Menu, X, Ship } from "lucide-react";
import { Language } from "../../translations";

const languages: { code: Language; label: string; name: string }[] = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'am', label: 'AM', name: 'አማርኛ' },
  { code: 'sw', label: 'SW', name: 'Kiswahili' },
  { code: 'so', label: 'SO', name: 'Soomaali' },
  { code: 'orm', label: 'OR', name: 'Afaan Oromoo' },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
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

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-primary shadow-md py-3' : 'bg-primary/90 backdrop-blur-sm py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
          <Ship className="h-8 w-8 text-accent" />
          <span className="text-white font-serif font-bold text-2xl tracking-wide">Global Transit</span>
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
          
          <button onClick={() => scrollTo('business')} className="text-white/90 hover:text-white transition-colors font-medium">
            {t.nav.ourBusiness}
          </button>
          <button onClick={() => scrollTo('projects')} className="text-white/90 hover:text-white transition-colors font-medium">
            {t.nav.ourProjects}
          </button>
          <button onClick={() => scrollTo('contact')} className="text-white/90 hover:text-white transition-colors font-medium">
            {t.nav.contactUs}
          </button>

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
          <button onClick={() => scrollTo('business')} className="text-left text-white py-4 border-b border-white/10 font-medium">
            {t.nav.ourBusiness}
          </button>
          <button onClick={() => scrollTo('projects')} className="text-left text-white py-4 border-b border-white/10 font-medium">
            {t.nav.ourProjects}
          </button>
          <button onClick={() => scrollTo('contact')} className="text-left text-white py-4 border-b border-white/10 font-medium">
            {t.nav.contactUs}
          </button>
          
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
    </header>
  );
}