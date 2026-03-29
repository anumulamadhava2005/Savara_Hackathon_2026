'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Zap, Star, Users, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState<'welcome' | 'location' | 'prefs'>('welcome');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [radius, setRadius] = useState(2);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userName, setUserName] = useState('');

  // Pull the full_name stored in Supabase auth metadata during registration
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'Friend';
        setUserName(name);
      }
    });
  }, []);

  const categories = [
    { id: 'grocery', label: 'Grocery', icon: '🛒' },
    { id: 'bakery', label: 'Bakery', icon: '🥐' },
    { id: 'dairy', label: 'Dairy', icon: '🥛' },
    { id: 'produce', label: 'Produce', icon: '🥦' },
    { id: 'general', label: 'General', icon: '🏪' },
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLat(12.9716); setLng(77.5946);
      setStep('prefs');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setStep('prefs');
      },
      () => {
        setLat(12.9716); setLng(77.5946);
        setStep('prefs');
      }
    );
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter((c: string) => c !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: userName,
          preferred_radius_km: radius,
          preferred_categories: selectedCategories.length > 0 ? selectedCategories : ['general'],
          lat: lat ?? 12.9716,
          lng: lng ?? 77.5946,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save preferences');
      }
      window.location.href = '/discover';
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">

        {/* ── Step 1: Welcome ─────────────────────────────────────── */}
        {step === 'welcome' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20">
              <Zap size={36} className="text-yellow-400" fill="currentColor" />
            </div>

            <h1 className="text-5xl font-black tracking-tighter mb-3">
              {firstName ? `Hey, ${firstName}! 👋` : 'Welcome to'}<br />
              <span className="text-yellow-400">DealDrop</span>
            </h1>
            <p className="text-indigo-300 font-medium text-lg mb-10 leading-relaxed">
              Hyperlocal flash deals, just minutes from you. Let&apos;s get you set up.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: <MapPin size={20} />, label: 'Hyperlocal', sub: 'Deals near you' },
                { icon: <Zap size={20} />, label: 'Flash Only', sub: 'Hours, not days' },
                { icon: <Star size={20} />, label: 'Earn Points', sub: 'Deal Passport' },
              ].map((f) => (
                <div key={f.label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-yellow-400 mb-2">{f.icon}</div>
                  <p className="font-black text-sm">{f.label}</p>
                  <p className="text-[10px] text-indigo-400 font-medium mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('location')}
              className="w-full bg-yellow-400 text-indigo-950 py-4 rounded-2xl font-black text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-3"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <p className="text-indigo-400 text-sm mt-4 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-white font-bold hover:text-yellow-400 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        )}

        {/* ── Step 2: Location ────────────────────────────────────── */}
        {step === 'location' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20">
              <MapPin size={36} className="text-green-400" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-3">Where are you?</h2>
            <p className="text-indigo-300 font-medium mb-10 leading-relaxed">
              DealDrop uses your location to surface only deals within walking distance.
            </p>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6 text-left">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3">Search Radius</p>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 5, 10].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                      radius === r ? 'bg-yellow-400 text-indigo-950' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGetLocation}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-400 transition-colors flex items-center justify-center gap-3 mb-4"
            >
              <MapPin size={20} /> Use My Location
            </button>
            <button
              onClick={() => { setLat(12.9716); setLng(77.5946); setStep('prefs'); }}
              className="w-full bg-white/10 text-white py-3 rounded-2xl font-bold hover:bg-white/20 transition-colors text-sm"
            >
              Skip — use default city
            </button>
          </div>
        )}

        {/* ── Step 3: Preferences ─────────────────────────────────── */}
        {step === 'prefs' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                <Users size={36} className="text-purple-400" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-2">What do you love?</h2>
              <p className="text-indigo-300 font-medium">Pick your favourite deal categories.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-2xl text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-8">
              {categories.map((cat) => {
                const selected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      selected
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{cat.icon}</span>
                    <p className={`font-black text-sm ${selected ? 'text-yellow-400' : 'text-white'}`}>
                      {cat.label}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleFinish}
              disabled={isLoading}
              className="w-full bg-yellow-400 text-indigo-950 py-4 rounded-2xl font-black text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isLoading ? 'Setting up...' : 'Start Hunting Deals'}{' '}
              <Zap size={20} fill="currentColor" />
            </button>
            <button
              onClick={() => { window.location.href = '/discover'; }}
              className="w-full mt-3 text-indigo-400 py-2 text-sm font-bold hover:text-white transition-colors"
            >
              Skip for now →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
