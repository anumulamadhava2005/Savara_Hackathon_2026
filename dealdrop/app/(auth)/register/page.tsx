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

          <div className="flex gap-4">
            <div className="h-1 w-1.5 rounded-full bg-white/20"></div>
            <div className="h-1 w-8 rounded-full bg-primary"></div>
            <div className="h-1 w-1.5 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Registration Interface */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-20 bg-surface z-10">
        <div className="w-full max-w-md mx-auto space-y-10">
          <header className="space-y-3">
            <h3 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tighter font-headline">Initialize Passport.</h3>
            <p className="text-on-surface-variant text-base font-medium">Become a certified member of your city&apos;s pulse.</p>
          </header>

          <section className="space-y-6">
            {errorMsg && (
              <div className="bg-error-container/20 border border-error-container/30 text-error-dim px-5 py-4 rounded-[20px] text-sm font-bold flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-secondary-container/20 border border-secondary-container/30 text-secondary-dim px-5 py-4 rounded-[20px] text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {successMsg}
              </div>
            )}

            {/* Account Type Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-surface-container-low rounded-[24px] border border-surface-container-high">
              <button
                type="button"
                onClick={() => setAccountType('customer')}
                className={`py-3 rounded-[20px] font-bold text-xs uppercase tracking-widest transition-all ${accountType === 'customer' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setAccountType('retailer')}
                className={`py-3 rounded-[20px] font-bold text-xs uppercase tracking-widest transition-all ${accountType === 'retailer' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Retailer
              </button>
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Rules UI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-1 pb-2">
                {passwordRules.map(rule => (
                  <div key={rule.id} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors ${rule.valid ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {rule.valid && <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
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
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Join with Google
            </button>

            <p className="text-center text-sm font-bold text-on-surface-variant">
              Already have a passport? 
              <Link href="/login" className="text-primary font-black ml-1.5 hover:underline decoration-2">
                Sign In Instead →
              </Link>
            </p>
          </section>

          <footer className="pt-8 text-center">
            <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em] leading-relaxed opacity-50">
              By registering, you agree to the DealDrop<br />
              Neighborhood Guidelines &amp; Privacy Protocol.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
