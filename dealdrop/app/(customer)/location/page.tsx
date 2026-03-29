export default function LocationPage() {
  return (
    <main className="w-full max-w-md px-8 py-12 flex flex-col min-h-screen justify-between relative overflow-hidden mx-auto">
      {/* Top App Bar (Simplified for Onboarding) */}
      <header className="flex items-center justify-between h-16 w-full z-10">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></div>
          <div className="w-6 h-1.5 rounded-full bg-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></div>
        </div>
        <div className="w-10"></div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center space-y-12">
        {/* Hero Illustration: The Pulse */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Decorative Abstract Shapes (Editorial Asymmetry) */}
          <div className="absolute -top-4 -right-8 w-32 h-32 bg-secondary-container/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-4 w-40 h-40 bg-tertiary-container/30 rounded-full blur-3xl"></div>

          {/* Main Icon Container */}
          <div className="relative z-10 w-48 h-48 bg-surface-container-lowest rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-on-surface/5">
            <div className="absolute inset-0 border border-outline-variant/10 rounded-[2.5rem]"></div>

            {/* Animated Map Pin Representation */}
            <div className="relative">
              <div className="w-24 h-24 bg-primary-container/10 rounded-full flex items-center justify-center pulse-animation">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center text-on-primary shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-4xl" data-weight="fill">location_on</span>
                </div>
              </div>

              {/* Mini Map UI Detail */}
              <div className="absolute -bottom-2 -right-2 bg-surface-container-lowest p-2 rounded-xl shadow-md flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-bold font-headline tracking-widest text-secondary uppercase">LIVE</span>
              </div>
            </div>
          </div>

          {/* Abstract Map Lines Bleed */}
          <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
            <svg height="100%" viewBox="0 0 200 200" width="100%">
              <path d="M0,50 Q50,0 100,50 T200,50" fill="none" stroke="currentColor" strokeWidth="2"></path>
              <path d="M0,150 Q50,100 100,150 T200,150" fill="none" stroke="currentColor" strokeWidth="2"></path>
              <line fill="none" stroke="currentColor" strokeWidth="2" x1="100" x2="100" y1="0" y2="200"></line>
            </svg>
          </div>
        </div>

        {/* Content Area */}
        <div className="text-center space-y-4 px-2">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-background">
            Set Your Location
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed font-body">
            To show you the best real-time deals in your neighborhood, we need your location.
          </p>

          {/* Benefit Badges (Editorial Detail) */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined text-primary text-sm">bolt</span>
              <span className="text-xs font-semibold text-on-surface-variant">Instant Access</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined text-secondary text-sm">distance</span>
              <span className="text-xs font-semibold text-on-surface-variant">Radius Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <footer className="space-y-4 pb-8">
        <button className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
          Allow Location Access
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
        <button className="w-full h-14 rounded-full text-on-surface-variant font-body font-semibold hover:bg-surface-container-low transition-colors active:scale-[0.98] cursor-pointer">
          Skip for Now
        </button>

        {/* Transparency Disclaimer */}
        <p className="text-[10px] text-center text-outline leading-tight px-6 pt-4">
          We respect your privacy. Your location data is used only to personalize your experience and is never shared with third parties without your explicit consent.
        </p>
      </footer>

      {/* Decorative Background Element (Asymmetry) */}
      <div className="absolute top-1/4 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Hidden Map Context for Prompt Integrity */}
      <div className="hidden">
        <img data-alt="vibrant abstract digital map representation with glowing orange GPS pin icons and pulsing energy waves over a minimalist cityscape grid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUSLos6BCq2Fl34qYzMfRrBBzKWadhea-7UB00D2w2vStZeJPN1FS6E__FgSWqAVDLWITU0AbYW7eHhigvOclEQej0FxSA-Ok0hI27WClGV4AIBfTUlgoap_fKme8UEifEc_oaKucHI4-AFViju-zQWhymvWY4R2glXu1DY3_LVavte0BcmkSFtheCNuCpm5y1P_REfIRb7uobYePg7FuVFBPnfCv59UdJAFyGMT_3dwtxo_Hy6uWbAZ_uR-ihqDVASoMpqd96TkI" alt="map" />
      </div>
    </main>
  );
}
