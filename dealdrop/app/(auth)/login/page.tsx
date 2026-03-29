'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  // Password rules validation
  const passwordRules = useMemo(() => ([
    { id: 'length', label: '8+ characters', valid: password.length >= 8 },
    { id: 'number', label: 'At least one number', valid: /[0-9]/.test(password) },
    { id: 'special', label: 'One special char', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]), [password]);

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
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-surface relative overflow-hidden font-body">
      {/* Background Decor */}
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-1/2 -left-32 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Hero Section (Vibrant & Editorial) */}
      <div className="relative w-full h-[35vh] md:h-auto md:w-[55%] flex-shrink-0 flex items-center justify-center p-8 md:p-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop"
            alt="City Atmosphere" className="w-full h-full object-cover grayscale opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-[18px] primary-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="white" strokeWidth="2.5" />
                <path d="M12 16V8M8 12L12 8L16 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white font-headline">DealDrop</h1>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-[1] tracking-tight mb-6">
            Hyperlocal vitality,<br />
            delivered.
          </h2>

          <p className="text-white/60 text-lg md:text-xl font-medium max-w-lg mb-10 leading-relaxed">
            Join the elite circle of hunters discovering real-time neighborhood pulses before they vanish.
          </p>

          <div className="flex gap-4">
            <div className="h-1.5 w-12 rounded-full bg-primary"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Auth Interface */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24 bg-surface z-10">
        <div className="w-full max-w-md mx-auto space-y-12">
          <header className="space-y-4 text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tighter font-headline">Welcome.</h3>
            <p className="text-on-surface-variant text-lg font-medium">Capture the pulse of your city today.</p>
          </header>

          <section className="space-y-6">
            {errorMsg && (
              <div className="bg-error-container/20 border border-error-container/30 text-error-dim px-5 py-4 rounded-[20px] text-sm font-bold flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">

              {!showEmail ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowEmail(true)}
                    className="w-full primary-gradient text-white py-4 rounded-[22px] font-bold text-[15px] shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Login
                  </button>

                  <Link href="/register" className="block w-full">
                    <button className="w-full bg-surface-container-low text-on-surface border border-surface-container-high py-4 rounded-[22px] font-bold text-[15px] hover:bg-surface-container-high transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></svg>
                      Register
                    </button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest ml-1">E-Mail Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-3.5 text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30 font-bold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Secure Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl px-5 py-3.5 text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30 font-bold transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors"
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Rules UI */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-1">
                    {passwordRules.map(rule => (
                      <div key={rule.id} className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${rule.valid ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          {rule.valid && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight transition-colors ${rule.valid ? 'text-secondary' : 'text-on-surface-variant'}`}>{rule.label}</span>
                      </div>
                    ))}
                  </div> */}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full primary-gradient text-white py-4 rounded-[22px] font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                  >
                    {isLoading ? 'Decrypting...' : 'Initiate Session'}
                  </button>
                </form>
              )}
            </div>

            {!showEmail && (
              <p className="text-center text-sm font-bold text-on-surface-variant">
                Experience the neighborhood pulse as a
                <Link href="/register?role=retailer" className="text-secondary font-black ml-1.5 hover:underline text-xs">
                  Merchant Partner →
                </Link>
              </p>
            )}
          </section>

          <footer className="pt-12 flex flex-col items-center gap-6 border-t border-surface-container-high">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] text-center leading-relaxed opacity-60">
              Your security protocol is operational.<br />
              All neighborhood discovery is encrypted.
            </p>
            <div className="flex gap-6 text-on-surface-variant/40">
              <span className="text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-primary">Legal</span>
              <span className="text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-primary">Safety</span>
              <span className="text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-primary">Support</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
