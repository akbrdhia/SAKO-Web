import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SidebarMenuItem from "./SidebarMenuItem.jsx";
import { 
  MdDashboard, 
  MdAccountBalance, 
  MdHistory, 
  MdLogout,
  MdRequestPage,
  MdPerson,
  MdSettings,
  MdInfo
} from 'react-icons/md';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', Icon: MdDashboard },
  { path: '/ajukan', label: 'Ajukan Pinjaman', Icon: MdRequestPage },
  { path: '/pinjaman', label: 'Pinjaman Saya', Icon: MdAccountBalance },
  { path: '/riwayat', label: 'Riwayat Simpanan', Icon: MdHistory },
];

export default function SidebarBox() {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const navRef = useRef(null);
  const profileMenuRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  
  // Default avatar if user doesn't have one
  const userAvatar = user?.avatar || "https://i.pravatar.cc/150?img=33";
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const userRole = user?.role === 'manajer' ? 'Manager' : 'Anggota';
  
  useEffect(() => {
    // Find active menu index
    const activeIndex = menuItems.findIndex(item => item.path === location.pathname);
    if (activeIndex !== -1) {
      // Calculate indicator position based on menu item index
      const itemHeight = 52; // approximate height of menu item (py-3 + content)
      const gap = 8; // gap-2 in pixels
      const position = activeIndex * (itemHeight + gap);
      setIndicatorPosition(position);
    }
  }, [location.pathname]);

  // Set initial indicator position on mount
  useEffect(() => {
    const activeIndex = menuItems.findIndex(item => item.path === location.pathname);
    if (activeIndex !== -1) {
      const itemHeight = 52;
      const gap = 8;
      const position = activeIndex * (itemHeight + gap);
      setIndicatorPosition(position);
    }
  }, []);

  // Close profile menu when clicking outside (Desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Close mobile profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileProfileMenuRef.current && !mobileProfileMenuRef.current.contains(event.target)) {
        setShowMobileProfileMenu(false);
      }
    };

    if (showMobileProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileProfileMenu]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    setShowProfileMenu(false);
    setShowMobileProfileMenu(false);
    // Use auth context logout
    await authLogout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Close sidebar when clicking menu item on mobile
  const handleMenuClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <MdLogout className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Konfirmasi Keluar</h3>
                <p className="text-sm text-gray-600">Apakah Anda yakin ingin keluar?</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop / large sidebar */}
      <div
        className="hidden md:flex w-[286px] h-[calc(100vh-40px)] static rounded-2xl shadow-lg ml-5 mt-5 flex-col items-start justify-between bg-white z-50 overflow-hidden"
      >
        <div className="w-full">
          {/* Logo section */}
          <div className="flex flex-col items-center w-full px-6 py-6 border-b border-gray-100">
            <img 
              src="/assets/kemenkop/logo_header.png" 
              alt="SAKO Logo" 
              className="w-full max-w-[75%] h-auto transition-transform duration-200 hover:scale-105" 
            />
          </div>

          {/* Menu section */}
          <nav ref={navRef} className="relative w-full flex flex-col gap-2 px-4 py-6">
            {/* Animated indicator box at left edge */}
            <div 
              className="absolute left-0 w-1.5 h-12 bg-[#005266] rounded-r-md transition-all duration-300 ease-out shadow-md"
              style={{ 
                top: `${indicatorPosition + 24}px`,
                opacity: menuItems.findIndex(item => item.path === location.pathname) !== -1 ? 1 : 0
              }}
            />
            
            {menuItems.map((item) => (
              <SidebarMenuItem 
                key={item.path}
                icon={item.Icon}
                label={item.label}
                active={location.pathname === item.path}
                to={item.path}
              />
            ))}
          </nav>
        </div>

        {/* Profile section at bottom */}
        <div className="w-full relative" ref={profileMenuRef}>
          {/* Profile Menu Popup */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideUp">
              {/* User Info Header */}
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={userAvatar} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <MdPerson className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Profile</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <MdSettings className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Pengaturan</span>
                </button>

                <div className="border-t border-gray-100 my-2"></div>

                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/about');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <MdInfo className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tentang</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group"
                >
                  <MdLogout className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                  <span className="text-sm font-medium text-red-600 group-hover:text-red-700">Keluar</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile Button */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full px-4 py-3 flex items-center gap-3 bg-[#F4F8FF] hover:bg-[#E8F1FF] transition-colors cursor-pointer rounded-b-2xl"
          >
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-600 truncate">{userRole}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile hamburger button bottom-left */}
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        aria-controls="mobile-sidebar"
        className="md:hidden fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 inline-flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-xl hover:shadow-2xl active:scale-95 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 12h16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 18h16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Mobile overlay & panel */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-50 shadow-2xl rounded-r-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col overflow-hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
        id="mobile-sidebar"
      >
        {/* Header with logo and close button */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-linear-to-r from-primary/5 to-transparent">
          <img 
            src="/assets/kemenkop/logo_header.png" 
            alt="SAKO Logo" 
            className="h-10 w-auto" 
          />
          <button 
            aria-label="Close menu" 
            onClick={() => setOpen(false)} 
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M6 18L18 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content wrapper for flex layout */}
        <div className="flex-1 overflow-y-auto">
          {/* Menu items */}
          <nav className="relative px-4 py-6 flex flex-col gap-2">
            {/* Animated indicator box at left edge for mobile */}
            <div 
              className="absolute left-0 w-1.5 h-12 bg-primary rounded-r-md transition-all duration-300 ease-out shadow-md"
              style={{ 
                top: `${indicatorPosition + 24}px`,
                opacity: menuItems.findIndex(item => item.path === location.pathname) !== -1 ? 1 : 0
              }}
            />
            
            {menuItems.map((item) => (
              <div key={item.path} onClick={handleMenuClick}>
                <SidebarMenuItem 
                  icon={item.Icon}
                  label={item.label}
                  active={location.pathname === item.path}
                  to={item.path}
                />
              </div>
            ))}
          </nav>
        </div>

        {/* Profile section at bottom - Mobile */}
        <div className="w-full relative" ref={mobileProfileMenuRef}>
          {/* Mobile Profile Menu Popup */}
          {showMobileProfileMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideUp">
              {/* User Info Header */}
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={userAvatar} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button 
                  onClick={() => {
                    setShowMobileProfileMenu(false);
                    setOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <MdPerson className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Profile</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowMobileProfileMenu(false);
                    setOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <MdSettings className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Pengaturan</span>
                </button>

                <div className="border-t border-gray-100 my-2"></div>

                <button 
                  onClick={() => {
                    setShowMobileProfileMenu(false);
                    setOpen(false);
                    navigate('/about');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <MdInfo className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tentang</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group"
                >
                  <MdLogout className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                  <span className="text-sm font-medium text-red-600 group-hover:text-red-700">Keluar</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Profile Button */}
          <button
            onClick={() => setShowMobileProfileMenu(!showMobileProfileMenu)}
            className="w-full px-4 py-3 flex items-center gap-3 bg-[#F4F8FF] hover:bg-[#E8F1FF] transition-colors cursor-pointer rounded-b-2xl"
          >
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-600 truncate">{userRole}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
