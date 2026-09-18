import React, { useState, useEffect, useRef } from 'react';
import LogoIcon from '../../assets/icons/logoIcon';
import { HashLink as Link } from 'react-router-hash-link';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, ChevronDown, LogOut, Loader2, Search, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../features/auth/services/authService';

// Interface for Report Search Results supporting locations, categories, and titles
export interface SearchReport {
  id: string;
  issue_number?: string;
  title?: string;
  category_name?: string;
  category?: string;
  description?: string;
  location_address?: string;
  location?: string;
  city?: string;
  status: string;
  created_at: string;
}

// Custom hook to debounce fast input changes
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Fetch handler searching across title, category, or location
const fetchSearchResults = async (query: string): Promise<SearchReport[]> => {
  if (!query.trim()) return [];
  const response = await publicApi.get(`/issues/?search=${encodeURIComponent(query)}`);

  const data = response.data;
  return Array.isArray(data) ? data : data.results || data.data || [];
};

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation & Profile UI State
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Search UI & Query State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search input by 300ms to reduce unnecessary requests
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // TanStack Query integration for caching, loading & error management
  const {
    data: searchResults = [],
    isLoading: isSearching,
    isError,
  } = useQuery({
    queryKey: ['reports-search', debouncedSearchQuery],
    queryFn: () => fetchSearchResults(debouncedSearchQuery),
    enabled: debouncedSearchQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  const { isAuthenticated: isLoggedIn, user, logout } = useAuth();
  
  // Reactively resolve user display name directly from auth context
  const userName = user?.full_name || 'User';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  // Outside click listener for search and profile dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setIsProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const handleSelectReport = (reportId: string | number) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/reports/${reportId}`);
  };

  // Helper for active link highlighting
  const getLinkClass = (path: string, isHash = false) => {
    const isActive = isHash
      ? location.hash === path
      : location.pathname === path && !location.hash;

    return `transition-all ${
      isActive
        ? 'opacity-100 font-bold border-b-2 border-primary pb-0.5'
        : 'opacity-70 hover:opacity-100'
    }`;
  };

  return (
    <nav className="sticky top-0 z-100 w-[98%] mx-auto mt-2 rounded-full bg-secondary backdrop-blur-xl border-b border-primary/5 transition-all shadow-lg shadow-black/20">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-20 h-16 md:h-18 flex justify-between items-center text-primary relative">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0 z-110">
          <LogoIcon size={35} color="var(--color-primary)" />
          <span className="font-black text-2xl md:text-4xl lg:text-5xl tracking-tighter uppercase">
            {t('navbar.brandName')}<span className="text-primary font-light"> Fix</span>
          </span>
        </Link>

        {/* Search Bar with Location-Enabled Dropdown */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <div ref={searchRef} className="w-full max-w-xs relative group">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsSearchOpen(true);
              }}
              className="w-full bg-primary/10 border border-primary/20 rounded-full py-2 pl-10 pr-4 text-xs focus:bg-primary focus:text-secondary transition-all outline-none" 
              placeholder={t('navbar.searchPlaceholder')}
            />
            
            <div className="absolute left-3.5 top-2.5 opacity-40">
              {isSearching ? (
                <Loader2 size={16} className="animate-spin text-primary" />
              ) : (
                <Search size={16} className="text-primary" />
              )}
            </div>

            {/* Floating Search Dropdown Overlay */}
            {isSearchOpen && debouncedSearchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-primary/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl bg-opacity-95">
                {isSearching ? (
                  <div className="p-4 text-xs text-primary/60 text-center flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Searching reports...
                  </div>
                ) : isError ? (
                  <div className="p-4 text-xs text-red-400 text-center">
                    Failed to fetch search results.
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto divide-y divide-primary/5">
                {searchResults.map((report) => {
                  // Extract values with fallbacks to handle backend field variations
                  const displayLocation = report.location_address || report.location || report.city || "Unknown Location";
                  const displayCategory = report.category_name || report.category || "General";
                  
                  // Format date string safely (e.g. "May 16, 2026")
                  const formattedDate = report.created_at 
                    ? new Date(report.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : '';

                  return (
                    <li 
                      key={report.id}
                      onClick={() => handleSelectReport(report.id)}
                      className="p-3 hover:bg-primary/5 cursor-pointer transition-colors"
                    >
                      {/* Top Row: Location Address & Status Badge */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <MapPin size={13} className="text-primary/70 shrink-0 mt-0.5" />
                          <p className="text-xs font-bold text-primary truncate">
                            {displayLocation}
                          </p>
                        </div>

                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shrink-0 ${
                          report.status?.toLowerCase() === 'resolved' 
                            ? 'bg-green-500/10 text-green-600'
                            : report.status?.toLowerCase() === 'rejected'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {report.status}
                        </span>
                      </div>

                      {/* Bottom Row: Category & Created Date */}
                      <div className="flex justify-between items-center text-[10px] text-primary/50 mt-1.5">
                        <span className="uppercase font-medium tracking-wider">{displayCategory}</span>
                        {formattedDate && <span>{formattedDate}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
                ) : (
                  <div className="p-4 text-xs text-primary/60 text-center">
                    No reports found for "{debouncedSearchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
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
          
          <Link smooth to="#how-to-report" className={getLinkClass('#how-to-report', true)}>{t('navbar.links.howTo')}</Link>
          <Link to="/report" className={getLinkClass('/report')}>{t('navbar.links.report')}</Link>
          <Link to="/local-reports" className={getLinkClass('/local-reports')}>{t('navbar.links.local')}</Link>
          
          {isLoggedIn ? (
            <div 
              ref={profileDropdownRef}
              className="relative py-4"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <button 
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 transition-all hover:bg-primary hover:text-secondary cursor-pointer"
              >
                <User size={14} />
                <span className="font-bold tracking-widest">{userName.split(' ')[0]}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 top-full pt-2 transition-all duration-300 ${
                isProfileOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}>
                <div className="bg-secondary border border-primary/10 rounded-2xl p-6 shadow-2xl min-w-50 backdrop-blur-2xl bg-opacity-95">
                  <p className="text-[9px] text-primary/40 mb-1 uppercase tracking-[0.2em]">{t('navbar.authStatus')}</p>
                  <p className="text-sm font-bold normal-case text-primary truncate mb-4">{userName}</p>
                  <div className="h-px bg-primary/5 w-full mb-4" />
                  <Link 
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 mb-1 pb-4 text-primary transition-colors group/profile"
                  >
                    <User size={14} />
                    <span className="font-black text-[10px] uppercase tracking-widest">{t('navbar.profile.settings')}</span>
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

      {/* Mobile Menu Overlay */}
      <div className={`
        md:hidden fixed top-0 left-0 w-full z-105 bg-secondary/85 shadow-2xl rounded-b-[2.5rem] border-b border-primary/10
        transition-all duration-500 ease-in-out transform
        ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}
      `}>

        <div className="flex flex-col w-full p-8 pt-20 gap-6">
          <div className="flex flex-col items-center gap-5">
            <LanguageSwitcher />

            <Link to="#how-to-report" onClick={toggleMenu} className={`text-xs font-black tracking-widest uppercase ${getLinkClass('#how-to-report', true)}`}>
              {t('navbar.links.howTo')}
            </Link>
            <Link to="/report" onClick={toggleMenu} className={`text-xs font-black tracking-widest uppercase ${getLinkClass('/report')}`}>
              {t('navbar.links.report')}
            </Link>
            <Link to="/local-reports" onClick={toggleMenu} className={`text-xs font-black tracking-widest uppercase ${getLinkClass('/local-reports')}`}>
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
                    {userName}
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