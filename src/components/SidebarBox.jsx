import SidebarMenuItem from "./SidebarMenuItem.jsx";

export default function SidebarBox() {
  return (
    <div
      className="
        w-full h-20 fixed left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50 flex items-center justify-center
        md:w-[286px] md:h-[calc(100vh-40px)] md:static md:rounded-2xl md:shadow-2xl md:ml-5 md:mt-5 md:flex-col md:items-start md:justify-start
      "
    >
      {/* Logo section (dummy) */}
      <div className="hidden md:flex flex-col items-center w-full mb-8 mt-2">
        <img src="/assets/kemenkop/logo_header.png" alt="logo" className="w-[68%] h-[100%]" />
       </div>

      {/* Menu section */}
      <nav className="flex-1 w-full flex flex-col gap-8 md:gap-8 px-8">
        <SidebarMenuItem icon="/assets/icon/dashboard.svg" label="Dashboard" active iconClass="w-6 h-6 text-primary" />
        <SidebarMenuItem icon="/assets/icon/dashboard.svg" label="Ajukan Pinjaman" iconClass="w-6 h-6 text-primary" />
        <SidebarMenuItem icon="/assets/icon/dashboard.svg" label="Pinjaman Saya" iconClass="w-6 h-6 text-primary" />
        <SidebarMenuItem icon="/assets/icon/dashboard.svg" label="Riwayat Simpanan" iconClass="w-6 h-6 text-primary" />
      </nav>
    </div>
  );
}
