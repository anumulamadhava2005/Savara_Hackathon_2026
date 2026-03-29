'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<'login' | 'email'>('login');

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setErrorMsg(error.message); setIsLoading(false); }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      window.location.href = '/api/auth/callback';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh]">

      {/* ── Left: hero image ───────────────────────────────── */}
      <div className="relative w-full h-[260px] md:h-auto md:flex-1 flex-shrink-0">
        <div className="absolute inset-0 bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop"
            alt="City" className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent" />

        {/* Logo */}
        <div className="absolute top-8 left-6 md:left-12 z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#a33700] flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L4.09 12.11a1 1 0 0 0-.09 1.16l6 10A1 1 0 0 0 11 24h2a1 1 0 0 0 .87-.5l6-10a1 1 0 0 0-.09-1.16L11 2a1 1 0 0 0-1.54 0z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">DealDrop</span>
        </div>

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 md:p-16 md:pb-24 z-10">
          <p className="text-white/80 text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase mb-2">
            Hyperlocal Flash Deals
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.05] tracking-tight max-w-2xl mb-4">
            The heartbeat of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7943] to-[#d35400] italic pr-1">
              your
            </span>{' '}
            neighborhood.
          </h2>
          <div className="hidden md:flex gap-3 mt-4">
            {['Hyperlocal', 'Real-Time', 'Exclusive'].map(tag => (
              <div key={tag} className="border border-white/30 rounded-full px-5 py-2 backdrop-blur-md bg-black/20 text-white text-xs font-bold tracking-widest uppercase">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: auth panel ──────────────────────────────── */}
      <div className="w-full md:w-[420px] lg:w-[460px] flex-shrink-0 bg-indigo-950 flex flex-col justify-center px-8 py-12 md:px-12">

        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">Welcome back</h2>
          <p className="text-indigo-400 font-medium text-sm">Sign in to your DealDrop account</p>
        </div>

        {errorMsg && (
          <div className="mb-5 bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-2xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">

          {/* Email / Password form */}
          {mode === 'login' ? (
            <button
              onClick={() => setMode('email')}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-500 transition-colors"
            >
              Sign In with Email
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-indigo-400 text-sm font-medium hover:text-white transition-colors"
              >
                ← Back
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-indigo-950 px-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                new here?
              </span>
            </div>
          </div>

          {/* Sign Up button */}
          <Link
            href="/register"
            className="block w-full text-center bg-[#a33700] text-white py-3.5 rounded-2xl font-bold hover:bg-orange-700 transition-colors"
          >
            Create an Account →
          </Link>
        </div>

        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed text-center mt-10">
          By continuing, you agree to our<br />Protocol &amp; Hunter Guidelines.
        </p>
      </div>
    </div>
  );
}
