'use client';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <Link href="/">
        <h1 className="text-xl font-black italic tracking-tighter text-indigo-950">DealDrop</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100">
          🔔
        </button>
        <div className="h-10 px-4 rounded-full bg-indigo-50 border border-indigo-100 flex items-center gap-2">
          <span className="text-sm font-black text-indigo-800 tracking-tight">250 pts</span>
        </div>
      </div>
    </header>
  );
}
