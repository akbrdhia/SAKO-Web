import React from 'react';
import SidebarBox from '../components/SidebarBox';

export default function SidebarLayout({ children }) {
  return (
    <div className="min-h-screen bg-kop-bg flex relative">
      {/* Sidebar kiri */}
      <SidebarBox />
      {/* Konten kanan */}
      <div className="flex-1 p-4 sm:p-8 min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
