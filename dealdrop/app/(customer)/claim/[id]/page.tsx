export default function RedeemDealPage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="text-orange-700 dark:text-orange-500 hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200 cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-orange-700 dark:text-orange-500">Redeem Deal</h1>
          </div>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Hero Header */}
        <section className="mb-8">
          <span className="font-label text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Success! Your reservation is active</span>
          <h2 className="editorial-headline text-4xl font-extrabold tracking-tight leading-tight mb-2">Ready to Claim!</h2>
          <p className="font-headline text-xl text-on-surface-variant font-medium">The Truffle Monster Burger</p>
        </section>

        {/* QR Redemption Card */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(44,47,48,0.04)] mb-8 relative overflow-hidden">
          {/* Decorative Element */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full"></div>
          
          <div className="flex flex-col items-center">
            <div className="bg-surface-container-low p-6 rounded-[1.5rem] mb-6 relative group">
              <img alt="Redemption QR Code" className="w-48 h-48 mix-blend-multiply opacity-90" data-alt="a clean high-contrast black and white QR code centered on a minimal white background for digital scanning" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxcaolO4Med8e8jL7VuJdbmWyNIBjuyyUNBAvmQgIvtHbBNlNPODLJfgi5dtYOXoWgJgCFanEyr7wBSvYKrrp86A0-WGWLf_4Zgx0BmIRCjahJcG-D6J7OheA-U3wV_muUB8-z3KnZD7Mdbum3q4mkYW5cx9hHpREmExD5LBRWl1zY3-m8uRk67MXHkpwPF_akOQO0wpbAP1IfTVIf6qSrSOMci9x9Iq60FEejIsCoVgCPVwaDHsyKaLKzyoGzwbO7aM1vsAZjAvg" />
              {/* Scan line decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 rounded-full"></div>
            </div>
            
            <div className="text-center">
              <p className="font-label text-sm text-on-surface-variant uppercase tracking-widest mb-1">Confirmation Number</p>
              <p className="editorial-headline text-2xl font-bold tracking-wider text-on-surface">#UP-882-990</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-12">
          <button className="w-full primary-gradient text-white font-headline font-bold py-5 px-8 rounded-full shadow-[0_8px_24px_rgba(163,55,0,0.2)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer">
            <span className="material-symbols-outlined">map</span>
            <span>Navigate to Store</span>
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="font-body text-sm">Downtown Plaza, Level 2 • 0.4 miles away</span>
          </div>
        </div>

        {/* Rating Section */}
        <section className="bg-surface-container-low rounded-[2rem] p-8 text-center border border-white/50">
          <h3 className="editorial-headline text-xl font-bold mb-2">How was your experience?</h3>
          <p className="font-body text-on-surface-variant text-sm mb-6 px-4">Your feedback helps us keep the urban pulse alive.</p>
          <div className="flex justify-center gap-3">
            <button className="text-tertiary-container hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </button>
            <button className="text-tertiary-container hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </button>
            <button className="text-tertiary-container hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </button>
            <button className="text-tertiary-container hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </button>
            <button className="text-surface-variant hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined !text-4xl">star</span>
            </button>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-4 left-4 right-4 rounded-3xl z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(44,47,48,0.06)] max-w-md mx-auto">
        <div className="flex justify-around items-center p-2 w-full">
          <a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all active:scale-90 duration-300 ease-out cursor-pointer" href="#">
            <span className="material-symbols-outlined">explore</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] font-medium tracking-wide uppercase mt-1">Discover</span>
          </a>
          <a className="flex flex-col items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-2xl px-5 py-2 active:scale-90 transition-all duration-300 ease-out cursor-pointer" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_offer</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] font-medium tracking-wide uppercase mt-1">Deals</span>
          </a>
          <a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all active:scale-90 duration-300 ease-out cursor-pointer" href="#">
            <span className="material-symbols-outlined">bookmark</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] font-medium tracking-wide uppercase mt-1">Saved</span>
          </a>
          <a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all active:scale-90 duration-300 ease-out cursor-pointer" href="#">
            <span className="material-symbols-outlined">confirmation_number</span>
            <span className="font-['Be_Vietnam_Pro'] text-[10px] font-medium tracking-wide uppercase mt-1">Activity</span>
          </a>
        </div>
      </nav>
    </>
  );
}
