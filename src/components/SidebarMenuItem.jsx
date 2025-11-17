export default function SidebarMenuItem({ icon: Icon, label, active, iconClass }) {
  return (
    <div
      className={`flex items-center gap-4 px-2 py-2 rounded-lg cursor-pointer transition text-lg
        ${active ? 'font-bold text-primary bg-primary/10' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      <div className="w-7 h-7 flex items-center justify-center">
        {/* SVG icon as React component, color via class */}
        {Icon ? <Icon className={iconClass || "w-6 h-6 text-primary"} /> : null}
      </div>
      <span>{label}</span>
    </div>
  );
}
