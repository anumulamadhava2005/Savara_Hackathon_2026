'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Deals', icon: '🛍️', path: '/discover' },
    { label: 'Map', icon: '📍', path: '/map' },
    { label: 'Passport', icon: '🛂', path: '/passport' },
    { label: 'Profile', icon: '👤', path: '/interests' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center py-3 px-6 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
