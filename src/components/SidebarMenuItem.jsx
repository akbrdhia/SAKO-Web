import { Link } from 'react-router-dom';

export default function SidebarMenuItem({ icon: Icon, src, label, active, to, onClick }) {
  const content = (
    <div
      className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer 
        transition-all duration-200 text-base font-medium
        ${active 
          ? 'text-primary font-semibold' 
          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
        }
      `}
      onClick={onClick}
      role={to ? undefined : "button"}
      tabIndex={to ? undefined : 0}
      onKeyDown={onClick && !to ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Icon */}
      <div className="w-6 h-6 flex items-center justify-center">
        {Icon ? (
          <Icon className={`
            w-6 h-6 transition-all duration-200
            ${active ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}
          `} />
        ) : src ? (
          <img 
            src={src} 
            alt={`${label} icon`} 
            className={`
              w-6 h-6 transition-all duration-200
              ${!active && 'opacity-70 group-hover:opacity-100'}
            `} 
          />
        ) : null}
      </div>
      
      {/* Label */}
      <span className="transition-all duration-200 select-none">
        {label}
      </span>
    </div>
  );

  // If a "to" prop is provided, wrap the item with a Link for navigation
  return to ? <Link to={to} className="focus:outline-none">{content}</Link> : content;
}
