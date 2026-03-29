'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
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
      // Let the callback check the DB to determine role → /dashboard or /
      window.location.href = '/api/auth/callback';
    }
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M12 8L16 12L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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

      <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 space-y-6">
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-2xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-indigo-950 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-50 transition-colors disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {!showEmail ? (
            <button
              onClick={() => setShowEmail(true)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-colors"
            >
              Sign In with Email
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/30 font-medium"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/30 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase font-bold text-white/40 bg-transparent px-2"><span>or create account</span></div>
        </div>

        <Link href="/register" className="block text-sm font-bold text-indigo-400 hover:text-white transition">
          Join the DealDrop Squad →
        </Link>
      </section>

      <footer className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed">
        By signing in, you agree to our <br /> Protocol &amp; Hunter Guidelines.
      </footer>
    </div>
  );
}
