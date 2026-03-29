'use client';
import { useState, useMemo } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  const passwordRules = useMemo(() => ([
    { id: 'length', label: '8+ characters', valid: password.length >= 8 },
    { id: 'number', label: 'One number', valid: /[0-9]/.test(password) },
    { id: 'special', label: 'One special char', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]), [password]);

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
        data: { full_name: fullName, role: accountType },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?type=${accountType}`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else if (data.user && !data.session) {
      setSuccessMsg(`Check your inbox! We sent a confirmation link to ${email}`);
    } else if (data.session) {
      window.location.href = `/api/auth/callback?type=${accountType}`;
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[100dvh] bg-[#0d0d0f] font-body overflow-hidden">
      {/* ── Left Hero Panel ── */}
      <div className="hidden lg:flex relative w-[45%] flex-shrink-0 flex-col justify-between p-12 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514328525431-eac296c00d27?q=80&w=1200&auto=format&fit=crop"
            alt="Join Community"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0f] via-[#0d0d0f]/80 to-[#0d0d0f]/40" />
          {/* Ambient blobs */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z" stroke="white" strokeWidth="2.5" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white text-xl font-black tracking-tight">DealDrop</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <h2 className="text-6xl font-black text-white leading-[1.05] tracking-tight mb-5">
            Join the<br />
            <span style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Squad.
            </span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-xs">
            Create your digital passport and start claiming exclusive neighborhood pulses.
          </p>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'].map((c, i) => (
                <div key={i} className={`w-9 h-9 rounded-full border-2 border-[#0d0d0f] ${c} flex items-center justify-center text-white text-xs font-black`}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm font-medium">
              <span className="text-white font-black">12,000+</span> members in your city
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/20 text-xs tracking-widest uppercase font-bold">
          © 2026 DealDrop · All rights reserved
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z" stroke="white" strokeWidth="2.5" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white text-lg font-black">DealDrop</span>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">Create account</h1>
            <p className="text-white/40 text-sm font-medium">Fill in the details below to get started</p>
          </div>

          {/* Account type toggle */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-7 border border-white/10">
            {(['customer', 'retailer'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${accountType === type
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-white/40 hover:text-white/70'
                  }`}
              >
                {type === 'customer' ? '🛍 Customer' : '🏪 Retailer'}
              </button>
            ))}
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <p className="text-emerald-400 text-sm font-bold">{successMsg}</p>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-red-400 text-sm font-bold">{errorMsg}</p>
            </div>
          )}

          {/* Google sign-up */}
          {/* <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-[0.98] mb-5 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button> */}

          {/* Divider */}
          {/* <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-[11px] font-black uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div> */}

          {/* Email form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Full name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Wick"
                className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-2xl px-4 py-3.5 text-white placeholder:text-white/20 font-medium text-sm focus:outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-2xl px-4 py-3.5 text-white placeholder:text-white/20 font-medium text-sm focus:outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 focus:border-primary rounded-2xl px-4 py-3.5 text-white placeholder:text-white/20 font-medium text-sm focus:outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  )}
                </button>
              </div>

              {/* Password strength pills */}
              {password.length > 0 && (
                <div className="flex gap-2 pt-1 pl-1">
                  {passwordRules.map(rule => (
                    <div key={rule.id} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full transition-colors ${rule.valid ? 'bg-emerald-400' : 'bg-white/15'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-tight transition-colors ${rule.valid ? 'text-emerald-400' : 'text-white/25'}`}>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-black text-base text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}
            >
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-white/30 font-medium mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-black hover:underline underline-offset-2">
              Sign in →
            </Link>
          </p>

          <p className="text-center text-[10px] text-white/15 uppercase tracking-widest font-bold mt-8 leading-relaxed">
            By registering you agree to the DealDrop<br />Neighborhood Guidelines & Privacy Protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
