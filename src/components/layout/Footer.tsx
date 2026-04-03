import React from 'react';
import LogoIcon from '../../assets/icons/logoIcon';
import { Twitter, Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-secondary overflow-hidden border-t border-primary/10">
      <div className="relative z-10 w-full bg-white/30 backdrop-blur-3xl py-12 px-8 md:px-20 border-b border-white/40 shadow-inner">
        <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <LogoIcon size={35} color="var(--color-secondary)" />
              </div>
              <h2 className="text-primary font-header font-black text-3xl tracking-tighter uppercase leading-none">
                {t('navbar.brandName')}<span className="font-light"> Fix</span>
              </h2>
            </div>
            <p className="text-primary/70 text-sm leading-relaxed max-w-sm mb-8 font-body">
              {t('footer.about')}
            </p>
            <div className="flex gap-6 text-primary/60 mb-10">
              <Twitter className="w-5 h-5 hover:text-primary cursor-pointer transition-all hover:scale-110" />
              <Instagram className="w-5 h-5 hover:text-primary cursor-pointer transition-all hover:scale-110" />
              <Facebook className="w-5 h-5 hover:text-primary cursor-pointer transition-all hover:scale-110" />
            </div>
            <div className="space-y-4 border-l-2 border-primary/10 pl-6 py-2">
              <h4 className="text-primary/40 text-[9px] font-black uppercase tracking-[0.4em] mb-4">{t('footer.contact.title')}</h4>
              <div className="flex items-center gap-3 text-primary/70 text-[11px] font-bold uppercase tracking-wider">
                <Mail className="w-4 h-4 opacity-40" /> support@yegnfix.et
              </div>
              <div className="flex items-center gap-3 text-primary/70 text-[11px] font-bold uppercase tracking-wider">
                <Phone className="w-4 h-4 opacity-40" /> +251 11 000 0000
              </div>
              <div className="flex items-center gap-3 text-primary/70 text-[11px] font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 opacity-40" /> {t('footer.contact.location')}
              </div>
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="text-primary/40 text-[9px] font-black uppercase tracking-[0.4em] mb-8">{t('footer.links.title')}</h4>
              <ul className="space-y-4">
                {[t('navbar.links.howTo'), t('navbar.links.report'), t('navbar.links.local'), t('footer.links.map'), t('footer.links.help')].map((link) => (
                  <li key={link} className="text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer flex items-center gap-2 group">
                    <span className="opacity-70 group-hover:opacity-100">{link}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-primary/40 text-[9px] font-black uppercase tracking-[0.4em] mb-8">{t('footer.categories.title')}</h4>
              <ul className="space-y-4">
                {[t('footer.categories.road'), t('footer.categories.water'), t('footer.categories.electric'), t('footer.categories.fire'), t('footer.categories.sanitation')].map((item) => (
                  <li key={item} className="text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-primary/20 rounded-full" />
                    <span className="opacity-70 group-hover:opacity-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-primary/40 text-[9px] font-black uppercase tracking-[0.4em] mb-8">{t('footer.language.title')}</h4>
              <div className="flex flex-col gap-3">
                <button className="text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20 bg-white/10 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-secondary transition-all text-left">
                  English (US)
                </button>
                <button className="text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20 bg-white/10 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-secondary transition-all text-left">
                  አማርኛ (Ethiopia)
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-360 mx-auto mt-10 pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-primary/30 text-[9px] font-black uppercase tracking-[0.3em]">
            © {currentYear} {t('navbar.brandName')} Fix. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;