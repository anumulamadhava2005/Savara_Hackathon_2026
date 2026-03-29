'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Truck,
  HelpCircle,
  LogOut,
  Zap,
  Store,
} from '@/components/ui/Icons';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/appStore';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useAppStore();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard',   icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Create Deal', icon: <PlusCircle size={20} />,      path: '/create-deal' },
    { label: 'My Items',    icon: <Package size={20} />,         path: '/items' },
    { label: 'Manage Deals',icon: <Package size={20} />,         path: '/deals' },
    { label: 'Fulfillment', icon: <Truck size={20} />,           path: '/fulfillment' },
  ];


  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col pt-6 pb-6 shadow-sm z-10 flex-shrink-0">
      {/* Logo */}
      <div className="px-6 flex items-center gap-2 mb-8">
        <div className="text-primary">
          <Zap size={24} fill="currentColor" strokeWidth={0} />
        </div>
        <h1 className="text-[1.1rem] font-bold text-primary leading-tight">
          Pulse Retailer <br /> Portal
        </h1>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-8">
        <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-primary overflow-hidden">
            {currentUser?.avatar_url ? (
              <img src={currentUser.avatar_url} alt="Shop" className="w-full h-full object-cover" />
            ) : (
              <Store size={20} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{currentUser?.full_name || 'Store Manager'}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider truncate">
              {currentUser?.address?.split(',')[0] || 'Downtown Branch'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-orange-50 text-primary self-start min-w-[12rem]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={isActive ? 'text-primary' : 'text-gray-400'}>
                {item.icon}
              </div>
              <span className={isActive ? 'font-bold' : ''}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="px-4 border-t border-gray-100 pt-4 flex flex-col gap-1">
        <Link
          href="/support"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-all"
        >
          <HelpCircle size={20} className="text-gray-400" />
          <span>Support Center</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-all text-left w-full">
          <LogOut size={20} className="text-gray-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
