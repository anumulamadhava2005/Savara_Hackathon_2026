'use client';

import React from 'react';
import { Bell, Settings, Search } from '@/components/ui/Icons';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

export function TopNav() {
  const pathname = usePathname();
  const { currentUser, syncWallet, syncNotifications } = useAppStore();

  React.useEffect(() => {
    // Sync on mount for retailers too
    syncWallet();
    syncNotifications();
  }, [syncWallet, syncNotifications]);

  // Map route to title
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return <span className="text-primary font-bold">Pulse Retailer Portal</span>;
      case '/create-deal':
        return 'Create Flash Deal';
      case '/deals':
        return 'Manage Deals';
      case '/fulfillment':
        return 'Order Fulfillment';
      default:
        return 'Pulse Retailer Portal';
    }
  };

  return (
    <div className="h-20 w-full flex items-center justify-between px-8 bg-[#f5f6f7] flex-shrink-0 z-0 border-b border-gray-100/50">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700"
          />
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          <button className="hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
          
          <div className="flex items-center gap-3 ml-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none">{currentUser?.full_name || 'Retailer'}</p>
              <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">Premium Partner</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer">
              <img 
                src={currentUser?.avatar_url || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
