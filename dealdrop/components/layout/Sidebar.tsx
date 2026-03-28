'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Post New Deal', icon: '🚀', path: '/post-deal' },
    { label: 'Manage Deals', icon: '📋', path: '/deals' },
    { label: 'Analytics', icon: '📈', path: '/analytics' },
    { label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <aside className="w-64 h-full bg-indigo-950 text-indigo-100 flex flex-col p-6 gap-8">
      <div>
        <h1 className="text-2xl font-black italic tracking-tighter text-white">DealDrop</h1>
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Retailer Portal</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-900/50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-indigo-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-800 flex items-center justify-center text-xl">🏬</div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Green Grocery</p>
            <p className="text-[10px] text-indigo-400 uppercase font-black">Verified Partner</p>
          </div>
        </div>
        <button className="w-full py-2 rounded-lg bg-indigo-900 text-xs font-bold hover:bg-red-900/50 transition-colors">
          Log Out
        </button>
      </div>
    </aside>
  );
}
