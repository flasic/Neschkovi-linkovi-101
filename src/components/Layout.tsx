import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  Settings as SettingsIcon, 
  BarChart3, 
  FileText, 
  Bell, 
  Wrench,
  Sliders,
  Menu,
  X,
  Egg
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { farm, alerts } = useFarm();

  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Monitoring', href: '/monitoring', icon: Activity },
    { name: 'Controls', href: '/controls', icon: Sliders },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Alerts', href: '/alerts', icon: Bell, badge: unreadAlerts },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-green-600 to-green-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Egg className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">FarmTech</h1>
              <p className="text-green-100 text-xs">Smart Poultry Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">{farm.name}</h2>
          <p className="text-xs text-gray-500">{farm.location}</p>
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
            <span>{farm.totalBirds.toLocaleString()} birds</span>
            <span>{farm.coopCount} coops</span>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 transition-colors
                    ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>System Status: <span className="text-green-600 font-medium">Online</span></p>
            <p className="mt-1">Last Update: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">FarmTech</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};