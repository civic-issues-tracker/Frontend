import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoIcon from '../../assets/icons/logoIcon';
import { Twitter, Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight, X } from 'lucide-react';
import IssueMapPicker from '../../features/report/components/IssueMapPicker'; 

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentLang = i18n.language || 'en';

  // Modal state for full-screen map
  const [isMapOpen, setIsMapOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navigationLinks = [
    { label: t('navbar.links.howTo'), path: '/#how-to-report', type: 'link' },
    { label: t('navbar.links.report'), path: '/report', type: 'link' },
    { label: t('navbar.links.local'), path: '/local-reports', type: 'link' },
    { label: t('footer.links.map'), type: 'map' },
    { label: t('footer.links.help'), type: 'help' },
  ];

  const categoryLinks = [
    { label: t('footer.categories.road'), category: 'road' },
    { label: t('footer.categories.water'), category: 'water' },
    { label: t('footer.categories.electric'), category: 'electric' },
    { label: t('footer.categories.fire'), category: 'fire' },
    { label: t('footer.categories.sanitation'), category: 'sanitation' },
  ];

  return (
    <>
      <footer className="relative w-full bg-secondary overflow-hidden border-t border-primary/10">
        <div className="relative z-10 w-full bg-white/10 backdrop-blur-3xl py-12 px-8 md:px-20 border-b border-white/40 shadow-inner">
          <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
            
            {/* Brand & Contact */}
            <div className="md:col-span-5 flex flex-col items-start">
              <Link to="/" className="flex items-center gap-4 mb-6 group">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                  <LogoIcon size={35} color="var(--color-secondary)" />
                </div>
                <h2 className="text-primary font-header font-black text-3xl tracking-tighter uppercase leading-none">
                  {t('navbar.brandName')}<span className="font-light"> Fix</span>
                </h2>
              </Link>
              
              <p className="text-primary text-sm leading-relaxed max-w-sm mb-8 font-body opacity-80">
                {t('footer.about')}
              </p>

              <div className="flex gap-6 text-primary/60 mb-10">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="w-5 h-5 text-primary hover:text-primary/80 cursor-pointer transition-all hover:scale-110" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="w-5 h-5 text-primary hover:text-primary/80 cursor-pointer transition-all hover:scale-110" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="w-5 h-5 text-primary hover:text-primary/80 cursor-pointer transition-all hover:scale-110" />
                </a>
              </div>

              <div className="space-y-4 border-l-2 border-primary/10 pl-6 py-2">
                <h4 className="text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-4">
                  {t('footer.contact.title')}
                </h4>
                <a href="mailto:hebronenyeww@gmail.com" className="flex items-center gap-3 text-primary/70 hover:text-primary text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <Mail className="w-4 h-4 opacity-40" /> support@yegnfix.et
                </a>
                <a href="tel:+251110000000" className="flex items-center gap-3 text-primary/70 hover:text-primary text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <Phone className="w-4 h-4 opacity-40" /> +251 11 000 0000
                </a>
                <div className="flex items-center gap-3 text-primary/70 text-[11px] font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 opacity-40" /> {t('footer.contact.location')}
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
              
              {/* Quick Links */}
              <div>
                <h4 className="text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-8">
                  {t('footer.links.title')}
                </h4>
                <ul className="space-y-4">
                  {navigationLinks.map((item, index) => (
                    <li key={index}>
                      {item.type === 'map' && (
                        <button
                          type="button"
                          onClick={() => setIsMapOpen(true)}
                          className="text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2 group w-full text-left"
                        >
                          <span className="opacity-70 group-hover:opacity-100">{item.label}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                        </button>
                      )}

                      {item.type === 'help' && (
                        <a
                          href="mailto:hebronenyeww@gmail.com"
                          className="text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2 group"
                        >
                          <span className="opacity-70 group-hover:opacity-100">{item.label}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                        </a>
                      )}

                      {item.type === 'link' && (
                        <Link
                          to={item.path!}
                          className="text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2 group"
                        >
                          <span className="opacity-70 group-hover:opacity-100">{item.label}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-8">
                  {t('footer.categories.title')}
                </h4>
                <ul className="space-y-4">
                  {categoryLinks.map((item) => (
                    <li key={item.category}>
                      <Link
                        to={`/local-reports?category=${item.category}`}
                        className="text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2 group"
                      >
                        <div className="w-1 h-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                        <span className="opacity-70 group-hover:opacity-100">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Language Switcher */}
              <div>
                <h4 className="text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-8">
                  {t('footer.language.title')}
                </h4>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => changeLanguage('en')}
                    className={`text-[9px] font-black uppercase tracking-widest border px-4 py-2.5 rounded-xl transition-all text-left ${
                      currentLang.startsWith('en')
                        ? 'bg-primary text-secondary border-primary shadow-sm'
                        : 'text-primary border-primary/20 bg-white/10 hover:bg-primary/10'
                    }`}
                  >
                    English (US)
                  </button>

                  <button
                    type="button"
                    onClick={() => changeLanguage('am')}
                    className={`text-[9px] font-black uppercase tracking-widest border px-4 py-2.5 rounded-xl transition-all text-left ${
                      currentLang.startsWith('am')
                        ? 'bg-primary text-secondary border-primary shadow-sm'
                        : 'text-primary border-primary/20 bg-white/10 hover:bg-primary/10'
                    }`}
                  >
                    አማርኛ (Ethiopia)
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="max-w-360 mx-auto mt-10 pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-center items-center gap-6">
            <p className="text-primary text-[9px] font-black uppercase tracking-[0.3em] opacity-80">
              © {currentYear} {t('navbar.brandName')} Fix. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>

      {/* Full Screen Map Modal */}
      {isMapOpen && (
        <div className="fixed my-14 inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-8">
          <div className="relative w-full h-full max-w-7xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-secondary border-b border-primary/10 flex items-center justify-between">
              <h3 className="text-primary font-black uppercase tracking-wider text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {t('footer.links.map')}
              </h3>
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="p-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-secondary transition-all"
                aria-label="Close Map"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full h-full relative">
              <IssueMapPicker selectedLocation={null} />
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Footer;