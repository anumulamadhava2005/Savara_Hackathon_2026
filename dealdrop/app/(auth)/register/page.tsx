'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<'customer' | 'retailer'>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createClient();

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?type=${accountType}`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?type=${accountType}`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else if (data.user && !data.session) {
      // Email confirmation required
      setSuccessMsg('Check your inbox! We sent a confirmation link to ' + email);
    } else if (data.session) {
      // Auto-confirmed (dev mode) — route through callback so DB determines destination
      window.location.href = `/api/auth/callback?type=${accountType}`;
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-md space-y-10">
        <header>
          <h1 className="text-5xl font-black italic tracking-tighter mb-2">Join the Squad</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Become a certified hyperlocal hunter</p>
        </header>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 space-y-8">
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-2xl text-sm font-bold">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-3 rounded-2xl text-sm font-bold">
              {successMsg}
            </div>
          )}

          {/* Account type selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAccountType('customer')}
              className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${accountType === 'customer' ? 'border-indigo-600 bg-indigo-600/20' : 'border-white/10 hover:border-indigo-600'}`}
            >
              <span className="text-3xl block mb-2">🛍️</span>
              <p className="text-xs font-black uppercase tracking-tight">I am a Customer</p>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('retailer')}
              className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${accountType === 'retailer' ? 'border-indigo-600 bg-indigo-600/20' : 'border-white/10 hover:border-indigo-600 text-white/60'}`}
            >
              <span className="text-3xl block mb-2">🏬</span>
              <p className="text-xs font-black uppercase tracking-tight">I am a Retailer</p>
            </button>
          </div>

          {/* Google sign-up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full bg-white text-indigo-950 py-3 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-50 transition-colors disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-white/40 px-2"><span>or with email</span></div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-white placeholder:text-white/30"
                placeholder="John Wick"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-white placeholder:text-white/30"
                placeholder="john@wick.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-white placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-indigo-900/50 mt-4 hover:bg-indigo-500 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Creating Account...' : 'Initialize Passport'}
            </button>
          </form>

          <Link href="/login" className="block text-sm font-bold text-white/50 hover:text-white transition">
            Already a member? <span className="text-indigo-400">Sign In</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
