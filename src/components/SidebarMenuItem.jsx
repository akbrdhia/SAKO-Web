import { Link } from 'react-router-dom';

export default function SidebarMenuItem({ icon: Icon, src, label, active, to, onClick }) {
  const content = (
    <div
      className={`
        group relative flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer 
        transition-all duration-200 text-base font-medium
        ${active 
          ? 'text-primary bg-primary/10 shadow-sm' 
          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
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
      {/* Icon container with animation */}
      <div className={`
        w-9 h-9 flex items-center justify-center rounded-lg
        transition-all duration-200
        ${active 
          ? 'bg-primary/15 scale-105' 
          : 'bg-transparent group-hover:bg-primary/5 group-hover:scale-105'
        }
      `}>
        {Icon ? (
          <Icon className={`
            w-5 h-5 transition-all duration-200
            ${active ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}
          `} />
        ) : src ? (
          <img 
            src={src} 
            alt={`${label} icon`} 
            className={`
              w-5 h-5 transition-all duration-200
              ${!active && 'opacity-70 group-hover:opacity-100'}
            `} 
          />
        ) : null}
      </div>
      
      {/* Label with smooth animation */}
      <span className="transition-all duration-200 select-none">
        {label}
      </span>
      
      {/* Subtle indicator on hover */}
      {!active && (
        <div className="absolute right-2 w-1 h-0 bg-primary/30 rounded-full transition-all duration-200 group-hover:h-6" />
      )}
    </div>
  );

  // If a "to" prop is provided, wrap the item with a Link for navigation
  return to ? <Link to={to} className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl">{content}</Link> : content;
}
