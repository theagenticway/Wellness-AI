import { Home, Activity, Users, Settings, Pill } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/progress', label: 'Progress', icon: Activity },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/supplements', label: 'Supplements', icon: Pill },
];

export function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-t-md">
      <div className="flex justify-around max-w-md mx-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
              }`
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
