'use client';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-sm space-y-10">
        <header>
          <h1 className="text-6xl font-black italic tracking-tighter mb-2">DealDrop</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Unlock deals, save the city</p>
        </header>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="space-y-4">
            <button className="w-full bg-white text-indigo-950 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
              <span className="text-xl">G</span> Continue with Google
            </button>
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg">
              Sign In with Email
            </button>
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
          By signing in, you agree to our <br /> Protocol & Hunter Guidelines.
        </footer>
      </div>
    </div>
  );
}
