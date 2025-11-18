import { Link } from 'react-router-dom';

export default function SidebarMenuItem({ icon: Icon, src, label, active, iconClass, to }) {
  const content = (
    <div
      className={`flex items-center gap-4 px-2 py-2 rounded-lg cursor-pointer transition text-lg
        ${active ? 'font-bold text-primary bg-primary/10' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      <div className="w-7 h-7 flex items-center justify-center">
        {/* Allow either a React icon component or a string src for image */}
        {Icon ? (
          <Icon className={iconClass || 'w-6 h-6 text-primary'} />
        ) : src ? (
          <img src={src} alt={`${label} icon`} className={iconClass || 'w-6 h-6'} />
        ) : null}
      </div>
      <span>{label}</span>
    </div>
  );

  // If a "to" prop is provided, wrap the item with a Link for navigation
  return to ? <Link to={to}>{content}</Link> : content;
}
