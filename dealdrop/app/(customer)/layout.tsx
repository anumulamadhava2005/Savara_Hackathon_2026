"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Ticket, Bookmark, Activity, Sparkles, Map, Bell, Wallet, LogOut } from '@/components/ui/Icons';
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
            <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Sparkles size={20} fill="white" />
            </div>
            <span className="font-headline font-black text-2xl tracking-tight text-on-surface">DealDrop</span>
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
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold relative group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'} />
                <span className="text-[15px]">{item.name}</span>
                {isActive && <div className="absolute right-0 w-1.5 h-6 bg-primary rounded-l-full" />}
                {item.name === 'Alerts' && unreadCount > 0 && (
                  <span className="ml-auto bg-[#b31b25] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {Math.min(unreadCount, 9)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-6 border-t border-surface-container-high">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-2xl bg-surface-container-low border border-surface-container">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover shadow-sm bg-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-on-surface truncate">{currentUser?.full_name || 'Guest'}</p>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest">{currentUser?.passport_level || 'Newcomer'} · {currentUser?.reward_points || 0} pts</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl text-on-surface-variant hover:bg-[#fae8e8] hover:text-[#b31b25] transition-all font-bold text-sm border border-transparent hover:border-[#b31b25]/20"
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
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none">
          <nav className="flex w-full max-w-sm items-center justify-around rounded-[40px] bg-white/90 backdrop-blur-3xl py-4 px-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border border-white/20 pointer-events-auto relative ring-1 ring-black/5">
            {[
              { ...navItems[0], label: 'Feed' }, 
              { ...navItems[3], label: 'Tickets' }, 
              { ...navItems[4], label: 'Vault' }, 
              { ...navItems[7], label: 'Inbox' }
            ].map((item) => {
              const isActive = pathname === item.href || (pathname === '/' && item.href === '/discover');
              const Icon = item.icon;
              const isInbox = item.name === 'Alerts';
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-1.5 min-w-[68px] relative transition-transform active:scale-90 group"
                >
                  {isInbox && unreadCount > 0 && (
                    <span className="absolute top-1 right-3 bg-[#b31b25] text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center z-20 shadow-lg border-2 border-white ring-1 ring-[#b31b25]/20 animate-bounce">
                      {Math.min(unreadCount, 9)}
                    </span>
                  )}
                  
                  <div className={cn(
                    "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500",
                    isActive 
                      ? "primary-gradient text-white shadow-xl shadow-primary/30 scale-110 -translate-y-3" 
                      : "text-on-surface-variant group-hover:bg-surface-container group-hover:text-primary"
                  )}>
                    <Icon 
                      size={24} 
                      strokeWidth={isActive ? 3 : 2} 
                      className={isActive ? 'drop-shadow-sm' : ''}
                    />
                    {isActive && (
                       <div className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
                    )}
                  </div>
                  
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                    isActive ? "text-primary opacity-100 translate-y-[-4px]" : "text-on-surface-variant/40 opacity-70 group-hover:opacity-100"
                  )}>
                    {item.label}
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
