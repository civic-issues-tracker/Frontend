import React, { useState, useEffect } from 'react';
import LogoIcon from '../../assets/icons/logoIcon';
import { HashLink as Link } from 'react-router-hash-link';
import { User, ChevronDown, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);


  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('user_name') || 'User';
  const isLoggedIn = !!token;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-100 w-[98%] mx-auto mt-2 rounded-full bg-secondary backdrop-blur-xl border-b border-primary/5 transition-all shadow-lg shadow-black/20">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-20 h-16 md:h-18 flex justify-between items-center text-primary relative">
        
        <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0 z-110">
          <LogoIcon size={35} color="var(--color-primary)" />
          <span className="font-black text-2xl md:text-4xl lg:text-5xl tracking-tighter uppercase">
            የኛ<span className="text-primary font-light"> Fix</span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="w-full max-w-xs relative group">
            <input 
              className="w-full bg-primary/10 border border-primary/20 rounded-full py-2 px-10 text-xs focus:bg-primary focus:text-secondary transition-all outline-none" 
              placeholder="Search reports..." 
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
          <Link to="/" className="hover:opacity-60 transition-opacity">En/Am</Link>
          <Link smooth to="#how-to-report" className="hover:opacity-60 transition-opacity">How to Report</Link>
          <Link to="/report" className="hover:opacity-60 transition-opacity">Report Issue</Link>
          <Link to="/all-reports" className="hover:opacity-60 transition-opacity">All Reports</Link>
          
          {isLoggedIn ? (
            <div className="relative group py-4">
              <button className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 transition-all group-hover:bg-primary group-hover:text-secondary">
                <User size={14} />
                <span className="font-bold tracking-widest">{userName.split(' ')[0]}</span>
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
              </button>

              {/* Desktop Dropdown */}
              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="bg-secondary border border-primary/10 rounded-2xl p-6 shadow-2xl min-w-50 backdrop-blur-2xl bg-opacity-95">
                  <p className="text-[9px] text-primary/40 mb-1 uppercase tracking-[0.2em]">Authorized Session</p>
                  <p className="text-sm font-bold normal-case text-primary truncate mb-4">{userName}</p>
                  <div className="h-px bg-primary/5 w-full mb-4" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-400 hover:text-red-500 transition-colors group/logout"
                  >
                    <LogOut size={14} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/signup" className="bg-primary text-secondary px-5 py-2 rounded-full font-bold hover:scale-105 transition-all">Sign Up</Link>
          )}
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`
        md:hidden fixed inset-0 top-0 left-0 w-full h-96 bg-secondary/80  z-105 flex flex-col items-center justify-center gap-8
        transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-20 invisible'}
      `}>
        <div className="flex flex-col items-center gap-8 text-primary">
          <Link to='/' onClick={toggleMenu} className="text-sm font-bold tracking-widest uppercase">En/Am</Link>
          <Link to="#how-to-report" onClick={toggleMenu} className="text-sm font-bold tracking-widest uppercase">How to Report</Link>
          <Link to="/report" onClick={toggleMenu} className="text-sm font-bold tracking-widest uppercase">Report Issue</Link>
          <Link to="/all-reports" onClick={toggleMenu} className="text-sm font-bold tracking-widest uppercase">All Reports</Link>
          
          {isLoggedIn ? (
            <div className="flex flex-col  items-center gap-4 mt-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User size={30} />
              </div>
              <p className="text-sm font-black uppercase tracking-widest">{userName}</p>
              <button 
                onClick={handleLogout}
                className="mt-4 text-red-500 text-[10px] font-black uppercase tracking-[0.5em] border border-red-500/20 px-8 py-3 rounded-full"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link 
              to="/signup" 
              onClick={toggleMenu} 
              className="mt-4 bg-primary text-secondary px-8 py-2 rounded-full text-sm font-black shadow-xl active:scale-95 transition-transform"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;