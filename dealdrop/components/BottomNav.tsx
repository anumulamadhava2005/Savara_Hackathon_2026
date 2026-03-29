"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Ticket, Bookmark, Activity } from 'lucide-react';
import { cn } from './ui/Button';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'DISCOVER', icon: Compass, href: '/discover' },
    { name: 'DEALS', icon: Ticket, href: '/deals' },
    { name: 'SAVED', icon: Bookmark, href: '/saved' },
    { name: 'ACTIVITY', icon: Activity, href: '/activity' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pt-2 px-4 pointer-events-none">
      <nav className="flex w-full max-w-sm items-center justify-around rounded-[32px] bg-white py-3 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/discover');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[64px]"
            >
              <div 
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                  isActive ? "bg-primary text-white shadow-md btn-gradient" : "text-on-surface-variant hover:bg-surface-container"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span 
                className={cn(
                  "text-[10px] uppercase font-bold tracking-wider transition-colors duration-300",
                  isActive ? "text-primary" : "text-outline"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
