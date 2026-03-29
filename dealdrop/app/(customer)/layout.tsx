"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Ticket, Bookmark, Activity, Sparkles, Map, Bell, Wallet, LogOut } from 'lucide-react';
import { cn } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import { useRouter } from 'next/navigation';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser, notifications = [] } = useAppStore();

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => n.unread).length : 0;

  const navItems = [
    { name: 'Discover', icon: Compass, href: '/discover' },
    { name: 'Flash Deals', icon: Sparkles, href: '/flash' },
    { name: 'Pulse Map', icon: Map, href: '/map' },
    { name: 'My Deals', icon: Ticket, href: '/deals' },
    { name: 'Wallet', icon: Wallet, href: '/wallet' },
    { name: 'Saved', icon: Bookmark, href: '/saved' },
    { name: 'Community', icon: Activity, href: '/community' },
    { name: 'Alerts', icon: Bell, href: '/notifications' },
  ];

  const hideMobileNavPaths = ['/interests', '/location', '/redeem'];
  const isNavHiddenOnMobile = hideMobileNavPaths.some(p => pathname?.startsWith(p));

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (!isHydrated) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>;
  }

  return (
    <div className="flex bg-[#f5f6f7] min-h-[100dvh]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white border-r border-surface-container-high h-[100dvh] sticky top-0 px-4 py-8">
        <div className="mb-10 px-4">
          <Link href="/discover" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M12 8L16 12L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-primary">Urban Pulse</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/discover');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold relative",
                  isActive
                    ? "bg-[#ffefdb] text-[#8f2f00]"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
                {item.name === 'Alerts' && unreadCount > 0 && (
                  <span className="ml-auto bg-[#b31b25] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                    {Math.min(unreadCount, 9)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-6 border-t border-surface-container-high">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{currentUser?.full_name || 'Guest'}</p>
              <p className="text-xs text-outline-variant font-medium">{currentUser?.passport_level || 'Newcomer'} · {currentUser?.reward_points || 0} pts</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-semibold text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative w-full pb-20 md:pb-0 overflow-x-hidden flex flex-col">
        {pathname === '/map' ? (
          // Map page: full-bleed, no padding, no max-width
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        ) : (
          <div className="md:max-w-6xl md:mx-auto md:p-8 w-full md:bg-white md:min-h-screen md:shadow-sm">
            {children}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {!isNavHiddenOnMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pt-2 px-4 pointer-events-none">
          <nav className="flex w-full max-w-sm items-center justify-around rounded-[32px] bg-white py-3 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] pointer-events-auto">
            {[navItems[0], navItems[3], navItems[5], navItems[7]].map((item) => {
              const isActive = pathname === item.href || (pathname === '/' && item.href === '/discover');
              const Icon = item.icon;
              const isBell = item.name === 'Alerts';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-1 min-w-[64px] relative"
                >
                  {isBell && unreadCount > 0 && (
                    <span className="absolute top-0 right-3 bg-[#b31b25] text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center z-10">
                      {Math.min(unreadCount, 9)}
                    </span>
                  )}
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                    isActive ? "bg-primary text-white shadow-md btn-gradient" : "text-on-surface-variant hover:bg-surface-container"
                  )}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-wider transition-colors duration-300",
                    isActive ? "text-primary" : "text-outline"
                  )}>
                    {item.name === 'My Deals' ? 'DEALS' : item.name.toUpperCase()}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
