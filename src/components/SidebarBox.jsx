import { useState } from 'react';
import SidebarMenuItem from "./SidebarMenuItem.jsx";

export default function SidebarBox() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop / large sidebar */}
      <div
        className="hidden md:flex w-[286px] h-[calc(100vh-40px)] static rounded-2xl shadow-2xl ml-5 mt-5 flex-col items-start justify-start bg-white z-50"
      >
      {/* Logo section (dummy) */}
  <div className="hidden md:flex flex-col items-center w-full mb-8 mt-2">
  <img src="/assets/kemenkop/logo_header.png" alt="logo" className="w-full max-w-[68%] h-auto" />
       </div>

      {/* Menu section */}
      <nav className="flex-1 w-full flex flex-col gap-8 md:gap-8 px-8">
        <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Dashboard" active iconClass="w-6 h-6 text-primary" to="/dashboard" />
        <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Ajukan Pinjaman" iconClass="w-6 h-6 text-primary" to="/ajukan" />
        <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Pinjaman Saya" iconClass="w-6 h-6 text-primary" to="/pinjaman" />
        <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Riwayat Simpanan" iconClass="w-6 h-6 text-primary" to="/riwayat" />
      </nav>
      </div>

      {/* Mobile hamburger button bottom-left */}
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        aria-controls="mobile-sidebar"
        className="md:hidden fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 inline-flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 12h16" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 18h16" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Mobile overlay & panel */}
      <div className={`fixed inset-0 bg-black/40 z-40 md:hidden ${open ? 'block' : 'hidden'}`} onClick={() => setOpen(false)} />
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[72%] max-w-xs bg-white z-50 shadow-2xl transform transition-transform duration-200 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
        id="mobile-sidebar"
      >
        <div className="p-6 flex items-center justify-between">
          <img src="/assets/kemenkop/logo_header.png" alt="logo" className="w-32 h-auto" />
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M6 18L18 6" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <nav className="px-6 py-3 flex flex-col gap-4">
          <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Dashboard" active iconClass="w-6 h-6 text-primary" to="/dashboard" />
          <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Ajukan Pinjaman" iconClass="w-6 h-6 text-primary" to="/ajukan" />
          <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Pinjaman Saya" iconClass="w-6 h-6 text-primary" to="/pinjaman" />
          <SidebarMenuItem src="/assets/icon/dashboard.svg" label="Riwayat Simpanan" iconClass="w-6 h-6 text-primary" to="/riwayat" />
        </nav>
      </aside>
    </>
  );
}
