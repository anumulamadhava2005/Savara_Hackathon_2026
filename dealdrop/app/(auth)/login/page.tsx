"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import { MOCK_USERS } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const setCurrentUser = useAppStore(s => s.setCurrentUser);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // Simulate network

    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      router.push('/discover');
    } else {
      setError(`No account found for "${email}". Try a demo account below.`);
    }
    setLoading(false);
  };

  const quickLogin = (user: typeof MOCK_USERS[0]) => {
    setCurrentUser(user);
    router.push('/discover');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-surface relative">
      {/* Hero Section */}
      <div className="relative w-full h-[320px] md:h-auto md:w-[60%] lg:w-[65%] flex-shrink-0">
        <div className="absolute inset-0 bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop"
            alt="City" className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent"></div>
        <div className="absolute top-8 left-6 md:left-12 z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#a33700] flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 8L16 12L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">DealDrop</h1>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 md:p-16 md:pb-24 z-10">
          <p className="text-white/80 text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase mb-2">Hyperlocal Flash Deals</p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.05] tracking-tight max-w-2xl mb-4">
            The heartbeat of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7943] to-[#d35400] italic pr-1">your</span> neighborhood.
          </h2>
          <div className="hidden md:flex gap-3 mt-4">
            <div className="border border-white/30 rounded-full px-5 py-2 backdrop-blur-md bg-black/20 text-white text-xs font-bold tracking-widest uppercase">Hyperlocal</div>
            <div className="border border-white/30 rounded-full px-5 py-2 backdrop-blur-md bg-black/20 text-white text-xs font-bold tracking-widest uppercase">Real-Time</div>
            <div className="border border-white/30 rounded-full px-5 py-2 backdrop-blur-md bg-black/20 text-white text-xs font-bold tracking-widest uppercase">Exclusive</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 md:p-16 bg-white">
        <div className="max-w-sm mx-auto w-full">
          <h3 className="text-3xl md:text-4xl font-extrabold text-on-surface leading-tight mb-3 tracking-tight">Join the Pulse</h3>
          <p className="text-[15px] text-on-surface-variant font-medium leading-relaxed mb-8">
            Sign in to unlock exclusive local deals in your neighborhood.
          </p>

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-bold text-on-surface-variant mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-14 bg-surface-container-low rounded-xl px-4 text-[15px] font-medium text-on-surface border border-transparent focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            {error && <p className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>}
            <Button type="submit" className="w-full h-14 text-lg shadow-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Continue with Email'}
            </Button>
          </form>

          {/* Demo Quick Login */}
          <div className="border border-surface-container-high rounded-2xl p-4 mb-6">
            <p className="text-[11px] font-bold text-outline-variant uppercase tracking-widest mb-3">Demo Accounts — Click to Login</p>
            <div className="space-y-2">
              {MOCK_USERS.map(user => (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-left group border border-transparent hover:border-surface-container-high"
                >
                  <img src={user.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{user.full_name}</p>
                    <p className="text-xs text-outline-variant">{user.email} · {user.passport_level}</p>
                  </div>
                  <ArrowRight size={16} className="text-outline-variant group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs font-medium text-on-surface-variant">
            By continuing, you agree to DealDrop's{' '}
            <span className="text-[#a33700] cursor-pointer hover:underline">Terms of Service</span>{' '}and{' '}
            <span className="text-[#a33700] cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
