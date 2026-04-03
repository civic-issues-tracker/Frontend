import React, { useState, useEffect } from 'react';
import LogoIcon from '../../assets/icons/logoIcon';
import { HashLink as Link } from 'react-router-hash-link';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const { isAuthenticated: isLoggedIn, user, logout } = useAuth();
  const userName = user?.full_name || 'User';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const handleLogout = () => {
    logout(); 
  };

  return (
    <nav className="sticky top-0 z-100 w-[98%] mx-auto mt-2 rounded-full bg-secondary backdrop-blur-xl border-b border-primary/5 transition-all shadow-lg shadow-black/20">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-20 h-16 md:h-18 flex justify-between items-center text-primary relative">
        
        <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0 z-110">
          <LogoIcon size={35} color="var(--color-primary)" />
          <span className="font-black text-2xl md:text-4xl lg:text-5xl tracking-tighter uppercase">
            {t('navbar.brandName')}<span className="text-primary font-light"> Fix</span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="w-full max-w-xs relative group">
            <input 
              className="w-full bg-primary/10 border border-primary/20 rounded-full py-2 px-10 text-xs focus:bg-primary focus:text-secondary transition-all outline-none" 
              placeholder={t('navbar.searchPlaceholder')}
            />
            <svg className="absolute left-3.5 top-2.5 w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <button 
          onClick={toggleMenu}
          className="md:hidden z-110 p-2 text-primary active:scale-90 transition-transform"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-[10px] lg:text-[12px] font-header uppercase tracking-widest">
          <LanguageSwitcher />
          
          <Link smooth to="#how-to-report" className="hover:opacity-60 transition-opacity">{t('navbar.links.howTo')}</Link>
          <Link to="/report" className="hover:opacity-60 transition-opacity">{t('navbar.links.report')}</Link>
          <Link to="/local-reports" className="hover:opacity-60 transition-opacity">{t('navbar.links.local')}</Link>
          
          {isLoggedIn ? (
            <div className="relative group py-4">
              <button className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 transition-all group-hover:bg-primary group-hover:text-secondary">
                <User size={14} />
                <span className="font-bold tracking-widest">{userName.split(' ')[0]}</span>
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="bg-secondary border border-primary/10 rounded-2xl p-6 shadow-2xl min-w-50 backdrop-blur-2xl bg-opacity-95">
                  <p className="text-[9px] text-primary/40 mb-1 uppercase tracking-[0.2em]">{t('navbar.authStatus')}</p>
                  <p className="text-sm font-bold normal-case text-primary truncate mb-4">{userName}</p>
                  <div className="h-px bg-primary/5 w-full mb-4" />
                  <Link 
                    to="/"
                    className="flex items-center gap-3  mb-1 pb-4 text-primary transition-colors group/profile"
                  >
                    <User size={14} />
                    <span className="font-black  text-[10px] uppercase tracking-widest">{t('navbar.profile.settings')}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-500 transition-colors group/logout"
                  >
                    <LogOut size={14} />
                    <span className="font-black text-[10px] uppercase tracking-widest">{t('navbar.profile.logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-primary text-secondary px-5 py-2 rounded-full font-bold hover:scale-105 transition-all">{t('navbar.profile.signIn')}</Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`
        md:hidden fixed top-0 left-0 w-full z-105 bg-secondary/85 shadow-2xl rounded-b-[2.5rem] border-b border-primary/10
        transition-all duration-500 ease-in-out transform
        ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}
      `}>

        <div className="flex flex-col w-full p-8 pt-20 gap-6">
          <div className="flex flex-col items-center gap-5">
            <LanguageSwitcher />

            <Link to="#how-to-report" onClick={toggleMenu} className="text-primary text-xs font-black tracking-widest uppercase">
              {t('navbar.links.howTo')}
            </Link>
            <Link to="/report" onClick={toggleMenu} className="text-primary text-xs font-black tracking-widest uppercase">
              {t('navbar.links.report')}
            </Link>
            <Link to="/local-reports" onClick={toggleMenu} className="text-primary text-xs font-black tracking-widest uppercase">
              {t('navbar.links.local')}
            </Link>
          </div>

          <div className="mt-4 pt-6 border-t border-primary/10">
            {isLoggedIn ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 w-full bg-primary/5 p-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-primary/20">
                    <User size={18} className="text-primary" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary truncate">
                    {userName || "User"}
                  </p>
                </div>
                <Link 
                  to="/profile"
                  onClick={toggleMenu}
                  className="w-full bg-primary text-secondary text-[9px] font-black uppercase tracking-[0.4em] py-4 rounded-xl text-center shadow-lg"
                >
                  {t('navbar.profile.settings')}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-[8px] font-black uppercase tracking-widest text-primary py-2"
                >
                  {t('navbar.profile.signOut')}
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={toggleMenu} 
                className="w-full bg-primary text-secondary py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] text-center shadow-lg block"
              >
                {t('navbar.profile.signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;