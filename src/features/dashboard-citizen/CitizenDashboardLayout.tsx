"use client";

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { FileText, Settings, LogOut, CircleUser, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const CitizenDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#FCFBF9] text-gray-800 overflow-hidden antialiased">
      
      {/* --- MOBILE HEADER (ELEVATED GLASSMORPHISM) --- */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-5 z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A3728] to-[#2A1E17] flex items-center justify-center shadow-sm">
            <CircleUser size={18} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-[#2A1E17]">Citizen Portal</span>
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="p-2 text-[#2A1E17] hover:bg-gray-100 rounded-xl transition-all duration-200"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* --- SIDEBAR OVERLAY (Mobile) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-68 bg-white border-r border-gray-100 px-6 py-10 flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Brand/Identity Header for Large Screens */}
        <div className="hidden lg:flex items-center gap-3 px-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A3728] to-[#2A1E17] flex items-center justify-center shadow-md shadow-amber-900/10">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#2A1E17]">Citizen Portal</span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Official Access</span>
          </div>
        </div>

        {/* User Badge Profile Section */}
        <div className="bg-gradient-to-b from-[#FAF8F5] to-white border border-gray-100/70 rounded-2xl p-4 flex flex-col items-center mb-8 text-center shadow-sm">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full border-2 border-white bg-[#FAF7F2] flex items-center justify-center shadow-md">
              <CircleUser size={44} strokeWidth={0.75} className="text-[#4A3728]" />
            </div>
            <span className="absolute bottom-1 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
          </div>
          <h2 className="text-sm font-semibold text-[#2A1E17] truncate max-w-[180px]">
            {user?.full_name || 'Citizen User'}
          </h2>
          <p className="text-xs text-gray-400 truncate max-w-[180px] mt-0.5">
            {user?.email || 'user@example.com'}
          </p>
        </div>

        {/* Navigation Action Links */}
        <nav className="flex-1 flex flex-col gap-1.5">
          
          {/* PROFILE LINK */}
          <Link 
            to="/profile" 
            onClick={closeSidebar}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              isActive('/profile') 
                ? 'bg-[#FAF7F2] text-[#2A1E17] font-semibold border-l-4 border-[#4A3728] shadow-sm pl-3' 
                : 'text-gray-500 hover:text-[#2A1E17] hover:bg-gray-50/70 translate-x-0 hover:translate-x-1'
            }`}
          >
            <CircleUser size={18} className={isActive('/profile') ? 'text-[#4A3728]' : 'text-gray-400'} />
            <span>Profile</span>
          </Link>

          {/* MY REPORTS LINK */}
          <Link 
            to="/reports" 
            onClick={closeSidebar}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              isActive('/reports') 
                ? 'bg-[#FAF7F2] text-[#2A1E17] font-semibold border-l-4 border-[#4A3728] shadow-sm pl-3' 
                : 'text-gray-500 hover:text-[#2A1E17] hover:bg-gray-50/70 translate-x-0 hover:translate-x-1'
            }`}
          >
            <FileText size={18} className={isActive('/reports') ? 'text-[#4A3728]' : 'text-gray-400'} />
            <span>My Reports</span>
          </Link>

          {/* SETTINGS LINK */}
          <Link 
            to="/settings" 
            onClick={closeSidebar}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              isActive('/settings') 
                ? 'bg-[#FAF7F2] text-[#2A1E17] font-semibold border-l-4 border-[#4A3728] shadow-sm pl-3' 
                : 'text-gray-500 hover:text-[#2A1E17] hover:bg-gray-50/70 translate-x-0 hover:translate-x-1'
            }`}
          >
            <Settings size={18} className={isActive('/settings') ? 'text-[#4A3728]' : 'text-gray-400'} />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Secure Logout Footer Interaction */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button 
            onClick={() => {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              navigate('/login');
            }}
            className="flex items-center gap-3.5 px-4 py-3 text-gray-500 font-medium text-sm rounded-xl hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 w-full text-left group"
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* --- SYSTEM VIEWPORT CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAF9F6]">
        {/* Mobile Spacer (Compensates for fixed position header layout) */}
        <div className="h-16 lg:hidden flex-shrink-0" />
        
        {/* Scrollable Dynamic Body */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CitizenDashboardLayout;