import React from 'react';
import SidebarBox from '../components/SidebarBox';

export default function SidebarLayout({ children }) {
  return (
    <div className="min-h-screen bg-kop-bg flex">
      {/* Sidebar kiri */}
      <SidebarBox />
      {/* Konten kanan */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
