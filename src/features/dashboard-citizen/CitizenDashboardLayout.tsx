"use client";

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import { Bell, FileText, Settings, LogOut, CircleUser, Menu, X } from 'lucide-react';
import LogoIcon from '../../assets/icons/logoIcon';
import { useAuth } from '../../hooks/useAuth';
import { privateApi } from '../auth/services/authService';

const CitizenDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await privateApi.get('/notifications/unread/count/');
        setUnreadCount(Number(res?.data?.unread_count || 0));
      } catch (err) {
        console.error('Failed to fetch unread notifications:', err);
      }
    };

    fetchUnreadCount();
    const interval = window.setInterval(fetchUnreadCount, 10000);
    window.addEventListener('focus', fetchUnreadCount);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', fetchUnreadCount);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#FCFBF9] text-gray-800 overflow-hidden antialiased">
      
      {/* --- MOBILE HEADER (GLASSMORPHISM WITH ENHANCED BLUR) --- */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/75 backdrop-blur-lg border-b border-gray-200/50 flex items-center justify-between px-6 z-50 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A3728] to-[#2A1E17] flex items-center justify-center shadow-md shadow-amber-950/10">
            <CircleUser size={18} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#2A1E17]">{t('navbar.brandName')}</span>
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="p-2 text-[#2A1E17] hover:bg-gray-100/80 active:scale-95 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A3728]/20"
          aria-label={t('accessibility.toggleMenu')}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* --- SIDEBAR OVERLAY (Mobile) --- */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[60] lg:hidden transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-[#DCCAB7] border-r border-[#CBB7A3]/50 px-5 py-8 flex flex-col transition-transform duration-300 ease-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/20' : '-translate-x-full'}
      `}>
        
        {/* Brand/Identity Header for Large Screens */}
        <Link
          to="/"
          className="hidden lg:flex items-center gap-2.5 px-3 mb-8 rounded-xl hover:bg-white/10 active:scale-[0.99] transition-all duration-200 py-2.5 group"
        >
          <LogoIcon size={26} color="#4A3728" />
          <span className="font-black text-base tracking-tight uppercase text-[#2A1E17]">
            {t('navbar.brandName')}<span className="font-light opacity-80"> Fix</span>
          </span>
        </Link>

        {/* User Badge Profile Section */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex flex-col items-center mb-6 text-center shadow-xs group transition-all duration-300 hover:bg-white/40">
          <div className="relative mb-2.5">
            <div className="w-14 h-14 rounded-full border border-white/60 bg-[#FAF7F2] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
              <CircleUser size={38} strokeWidth={1} className="text-[#4A3728]" />
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-xs animate-pulse"></span>
          </div>
          <h2 className="text-xs font-bold text-[#2A1E17] tracking-tight truncate w-full px-1">
            {user?.full_name || t('sidebar.guestName')}
          </h2>
          <p className="text-[11px] font-medium text-[#4A3728]/70 truncate w-full px-1 mt-0.5">
            {user?.email || t('sidebar.guestEmail')}
          </p>
        </div>

        {/* Navigation Action Links */}
        <nav className="flex-1 flex flex-col gap-1">
          
          {/* PROFILE LINK */}
          <Link 
            to="/profile" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
              isActive('/profile') 
                ? 'bg-white text-[#2A1E17] shadow-xs translate-x-1' 
                : 'text-[#4A3728]/80 hover:text-[#2A1E17] hover:bg-white/15'
            }`}
          >
            <CircleUser size={16} className={`transition-colors ${isActive('/profile') ? 'text-[#4A3728]' : 'text-[#4A3728]/70'}`} />
            <span>{t('sidebar.profile')}</span>
          </Link>

          {/* MY REPORTS LINK */}
          <Link 
            to="/reports" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
              isActive('/reports') 
                ? 'bg-white text-[#2A1E17] shadow-xs translate-x-1' 
                : 'text-[#4A3728]/80 hover:text-[#2A1E17] hover:bg-white/15'
            }`}
          >
            <FileText size={16} className={`transition-colors ${isActive('/reports') ? 'text-[#4A3728]' : 'text-[#4A3728]/70'}`} />
            <span>{t('sidebar.myReports')}</span>
          </Link>

          {/* NOTIFICATIONS LINK */}
          <Link
            to="/notifications"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold uppercase tracking-wider text-[#4A3728]/80 hover:text-[#2A1E17] hover:bg-white/15"
          >
            <span className="relative flex items-center justify-center">
              <Bell size={16} className="text-[#4A3728]/70" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-red-500 border border-white px-1 text-[10px] font-bold text-white flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            <span>{t('sidebar.notifications', 'Notifications')}</span>
          </Link>

          {/* SETTINGS LINK */}
          <Link 
            to="/settings" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${
              isActive('/settings') 
                ? 'bg-white text-[#2A1E17] shadow-xs translate-x-1' 
                : 'text-[#4A3728]/80 hover:text-[#2A1E17] hover:bg-white/15'
            }`}
          >
            <Settings size={16} className={`transition-colors ${isActive('/settings') ? 'text-[#4A3728]' : 'text-[#4A3728]/70'}`} />
            <span>{t('sidebar.settings')}</span>
          </Link>
        </nav>

        {/* Secure Logout Footer Interaction */}
        <div className="mt-auto pt-4 border-t border-white/20">
          <button 
            onClick={() => {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              navigate('/login');
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 text-[#4A3728]/80 font-semibold text-xs uppercase tracking-wider rounded-xl hover:text-red-700 hover:bg-red-500/10 active:scale-[0.98] transition-all duration-200 w-full text-left group"
          >
            <LogOut size={16} className="text-[#4A3728]/70 group-hover:text-red-600 transition-colors duration-200" />
            <span>{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>

      {/* --- SYSTEM VIEWPORT CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAF9F6]">
        {/* Mobile Spacer (Compensates for fixed position header layout) */}
        <div className="h-16 lg:hidden flex-shrink-0" />
        
        {/* Scrollable Dynamic Body */}
        <section className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto w-full transition-all duration-300">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CitizenDashboardLayout;