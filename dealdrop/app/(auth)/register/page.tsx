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

  // Password rules validation (matching login page for consistency)
  const passwordRules = useMemo(() => ([
    { id: 'length', label: '8+ characters', valid: password.length >= 8 },
    { id: 'number', label: 'At least one number', valid: /[0-9]/.test(password) },
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
      setSuccessMsg(`Welcome to the squad! We sent a confirmation link to ${email}`);
    } else if (data.session) {
      window.location.href = `/api/auth/callback?type=${accountType}`;
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-surface relative overflow-hidden font-body text-on-surface text-left">
      {/* Background Decor */}
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 -left-32 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative w-full h-[25vh] md:h-auto md:w-[45%] flex-shrink-0 flex items-center justify-center p-8 md:p-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514328525431-eac296c00d27?q=80&w=1200&auto=format&fit=crop"
            alt="Join Community" className="w-full h-full object-cover grayscale opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[15px] primary-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="white" strokeWidth="2.5" />
                <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white font-headline">DealDrop</h1>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
            Join the<br />
            <span className="text-transparent bg-clip-text primary-gradient italic">Squad.</span>
          </h2>

          <p className="text-white/60 text-base md:text-lg font-medium max-w-sm mb-8 leading-relaxed">
            Create your digital passport and start claiming exclusive neighborhood pulses.
          </p>

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

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Full Identity Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="First and last name"
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30 font-bold transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Electronic Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30 font-bold transition-all"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Security Cipher</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-3 text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30 font-bold transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Rules UI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-1 pb-2">
                {passwordRules.map(rule => (
                  <div key={rule.id} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors ${rule.valid ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {rule.valid && <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tight transition-colors ${rule.valid ? 'text-secondary' : 'text-on-surface-variant'}`}>{rule.label}</span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-[22px] font-black text-lg shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 ${accountType === 'customer' ? 'primary-gradient text-white shadow-primary/20 hover:opacity-90' : 'bg-secondary text-white shadow-secondary/20 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Creating...' : 'Finalize Registration'}
              </button>
            </form>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-grow bg-surface-container-high"></div>
              <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">or quick identity</span>
              <div className="h-[1px] flex-grow bg-surface-container-high"></div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-surface-container-lowest text-on-surface border border-surface-container-high py-3 rounded-[20px] font-bold text-sm flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all active:scale-[0.98] ambient-shadow"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button >

            <p className="text-center text-sm font-bold text-on-surface-variant">
              Already have a passport?
              <Link href="/login" className="text-primary font-black ml-1.5 hover:underline decoration-2">
                Sign In Instead →
              </Link>
            </p>
          </section >

          <footer className="pt-8 text-center">
            <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em] leading-relaxed opacity-50">
              By registering, you agree to the DealDrop<br />
              Neighborhood Guidelines &amp; Privacy Protocol.
            </p>
          </footer>
        </div >
      </div >
    </div >
  );
}
