"use client";

import React from 'react';
import { FileText, Settings, LogOut, CircleUser } from 'lucide-react';

const CitizenDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col px-8 py-12 border-r border-gray-100">
        
        {/* User Info Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 rounded-full border border-[#4A3728] flex items-center justify-center mb-4">
            <CircleUser size={52} strokeWidth={1} className="text-[#4A3728]" />
          </div>
          <h2 className="text-lg font-medium text-[#4A3728]">User</h2>
          <p className="text-sm text-[#4A3728]/70">User@gmail.com</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-4">
          {/* Profile Active/Button */}
          <button className="flex items-center gap-4 px-5 py-2.5 rounded-full border border-[#4A3728]/30 text-[#4A3728] font-medium hover:bg-gray-50 transition-colors">
            <CircleUser size={22} strokeWidth={1.5} />
            <span className="text-[15px]">Profile</span>
          </button>

          {/* My Reports */}
          <button className="flex items-center gap-4 px-5 py-2 text-[#4A3728] font-medium hover:translate-x-1 transition-transform">
            <FileText size={22} strokeWidth={1.5} />
            <span className="text-[15px]">My Reports</span>
          </button>

          {/* Setting */}
          <button className="flex items-center gap-4 px-5 py-2 text-[#4A3728] font-medium hover:translate-x-1 transition-transform">
            <Settings size={22} strokeWidth={1.5} />
            <span className="text-[15px]">Setting</span>
          </button>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-6">
          <button className="flex items-center gap-4 px-5 py-2 text-[#4A3728] font-medium hover:text-red-700 transition-colors">
            <LogOut size={22} strokeWidth={1.5} />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50/30">
        {children}
      </main>
    </div>
  );
};

export default CitizenDashboardLayout;