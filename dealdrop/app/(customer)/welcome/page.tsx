export default function WelcomePage() {
  return (
    <>
      <header className="glass-header fixed top-0 w-full z-50 flex items-center justify-between px-8 h-20">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tighter text-primary font-headline">Pulse</span>
        </div>
        <div className="hidden md:flex gap-6">
          <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </header>
      
      <main className="flex-grow pt-20 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-6 gap-12 items-center lg:items-stretch">
        <div className="w-full md:w-1/2 flex flex-col justify-center py-12">
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-tertiary-container rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary-container rounded-full opacity-20 blur-3xl"></div>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-low aspect-[4/5] md:aspect-[3/4] ambient-shadow">
              <img alt="Vibrant urban life" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" data-alt="Cinematic wide shot of a bustling neon-lit city street at dusk with people walking and glowing shop signs, warm and energetic atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_6PTcS8Vfvo0g0W5DC5Mv3sPs5bZ8zZM9y8abhgJmke-xR5aK-RgTSpqgOvY31m7sGUBFLrygz5ZW7NItB1MILdJ_nd_7baMjfG2eI7aToIKR64yy5kLj5EtcTZw3hXK3Kiul4dQl9CvNMPyTPyxHrpsQG9ogz5V7vk4djReTpRd8-M6R_rS1nX0dwtxHGqjHcff3hZd6tQgG_j926BFJrjNgYOVg-aCX1UJmc3L16smT1qZet56cuV1KcZnqO15EohoQtxsU5mg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                <span className="text-white/80 font-label text-sm uppercase tracking-widest mb-2">Hyperlocal Vitality</span>
                <h1 className="text-white text-4xl md:text-5xl font-headline font-extrabold leading-[1.1]">
                  Your city&apos;s <span className="text-primary-fixed">heartbeat</span> in your pocket.
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center py-12">
          <div className="space-y-10 max-w-md mx-auto md:mx-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface mb-4">Discover what&apos;s happening now.</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Join Urban Pulse to unlock exclusive deals, trending local spots, and the energy of your neighborhood.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button className="editorial-gradient text-on-primary font-headline font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">mail</span>
                Sign Up with Email
              </button>
              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                <span className="text-on-surface-variant text-xs font-bold tracking-widest uppercase">Or continue with</span>
                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-surface-container-lowest hover:bg-surface-container transition-colors py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-label font-semibold text-on-surface ambient-shadow">
                  <span className="material-symbols-outlined">google</span>
                  Google
                </button>
                <button className="bg-surface-container-lowest hover:bg-surface-container transition-colors py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-label font-semibold text-on-surface ambient-shadow">
                  <span className="material-symbols-outlined">smartphone</span>
                  Phone
                </button>
              </div>
            </div>
            <div className="pt-6 space-y-6">
              <p className="text-center md:text-left text-on-surface-variant text-sm">
                Already have an account? 
                <a className="text-primary font-bold hover:underline ml-1" href="#login">Log In</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline-variant/10">
        <p className="text-xs text-on-surface-variant font-label text-center md:text-left leading-relaxed max-w-xs md:max-w-none">
          By continuing, you agree to Urban Pulse&apos;s <br className="md:hidden"/>
          <a className="underline hover:text-primary" href="#tos">Terms of Service</a> and 
          <a className="underline hover:text-primary" href="#privacy">Privacy Policy</a>.
        </p>
        <div className="flex gap-8">
          <a className="text-on-surface-variant hover:text-secondary flex items-center gap-1 transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">language</span>
            <span className="text-xs font-bold tracking-tight">EN (US)</span>
          </a>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">public</span>
            <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">share</span>
          </div>
        </div>
      </footer>
    </>
  );
}
