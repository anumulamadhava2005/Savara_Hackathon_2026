'use client';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-md space-y-10">
        <header>
          <h1 className="text-5xl font-black italic tracking-tighter mb-2">Join the Squad</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Become a certified hyperlocal hunter</p>
        </header>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-600/20 text-center cursor-pointer">
              <span className="text-3xl block mb-2">🛍️</span>
              <p className="text-xs font-black uppercase tracking-tight">I am a Customer</p>
            </div>
            <div className="p-4 rounded-2xl border-2 border-white/10 hover:border-indigo-600 transition-all text-center cursor-pointer">
              <span className="text-3xl block mb-2">🏬</span>
              <p className="text-xs font-black uppercase tracking-tight text-white/60">I am a Retailer</p>
            </div>
          </div>

          <form className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Full Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" placeholder="John Wick" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" placeholder="john@wick.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-1">Password</label>
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-indigo-900/50 mt-4">
              Initialize Passport
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
