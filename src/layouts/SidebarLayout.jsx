import React from 'react';
import SidebarBox from '../components/SidebarBox';

export default function SidebarLayout({ children }) {
  return (
    <div className="min-h-screen bg-kop-bg flex relative">
      {/* Sidebar kiri */}
      <SidebarBox />
      {/* Konten kanan */}
      <div className="flex-1 p-4 sm:p-8 min-w-0 overflow-x-hidden relative">
        {/* Background logo watermark */}
        <img 
          src="/assets/kemenkop/logo kemenkop head.png" 
          alt="" 
          className="fixed bottom-0 right-0 w-120 h-auto opacity-10 pointer-events-none select-none z-0"
          aria-hidden="true"
        />
        {/* Content wrapper */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
