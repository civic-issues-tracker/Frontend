"use client";

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { FileText, Settings, LogOut, CircleUser, Menu, X } from 'lucide-react';

const CitizenDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  // Closes the menu on mobile after clicking a link
  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper function to check if a route is active for styling
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* --- MOBILE HEADER --- */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#4A3728] flex items-center justify-center">
            <CircleUser size={20} className="text-white" />
          </div>
          <span className="font-semibold text-[#4A3728]">Citizen Portal</span>
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="p-2 text-[#4A3728] hover:bg-gray-50 rounded-md transition-colors"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* --- SIDEBAR OVERLAY (Mobile) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-gray-100 px-8 py-12 flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* User Info Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border border-[#4A3728] flex items-center justify-center mb-4 bg-white">
              <CircleUser size={52} strokeWidth={1} className="text-[#4A3728]" />
            </div>
            <div className="absolute bottom-4 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h2 className="text-lg font-medium text-[#4A3728]">User</h2>
          <p className="text-sm text-[#4A3728]/70">User@gmail.com</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2">
          
          {/* PROFILE LINK */}
          <Link 
            to="/profile" 
            onClick={closeSidebar}
            className={`flex items-center gap-4 px-5 py-3 rounded-full border transition-all font-medium ${
              isActive('/profile') 
              ? 'border-[#4A3728]/30 bg-gray-50/50 text-[#4A3728]' 
              : 'border-transparent text-[#4A3728]/70 hover:text-[#4A3728] hover:translate-x-1'
            }`}
          >
            <CircleUser size={22} strokeWidth={1.5} />
            <span className="text-[15px]">Profile</span>
          </Link>

          {/* MY REPORTS LINK - Navigates to /reports */}
          <Link 
            to="/reports" 
            onClick={closeSidebar}
            className={`flex items-center gap-4 px-5 py-3 rounded-full border transition-all font-medium ${
              isActive('/reports') 
              ? 'border-[#4A3728]/30 bg-gray-50/50 text-[#4A3728]' 
              : 'border-transparent text-[#4A3728]/70 hover:text-[#4A3728] hover:translate-x-1'
            }`}
          >
            <FileText size={22} strokeWidth={1.5} />
            <span className="text-[15px]">My Reports</span>
          </Link>

          {/* SETTINGS LINK */}
          <Link 
            to="/settings" 
            onClick={closeSidebar}
            className={`flex items-center gap-4 px-5 py-3 rounded-full border transition-all font-medium ${
              isActive('/settings') 
              ? 'border-[#4A3728]/30 bg-gray-50/50 text-[#4A3728]' 
              : 'border-transparent text-[#4A3728]/70 hover:text-[#4A3728] hover:translate-x-1'
            }`}
          >
            <Settings size={22} strokeWidth={1.5} />
            <span className="text-[15px]">Setting</span>
          </Link>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-gray-50">
          <button 
            onClick={() => {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              navigate('/login');
            }}
            className="flex items-center gap-4 px-5 py-3 text-[#4A3728]/70 font-medium hover:text-red-600 transition-colors w-full text-left group"
          >
            <LogOut size={22} strokeWidth={1.5} className="group-hover:stroke-red-600" />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/30">
        <div className="h-16 lg:hidden flex-shrink-0" />
        
        <section className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CitizenDashboardLayout;