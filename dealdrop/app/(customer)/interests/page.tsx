export default function InterestsPage() {
  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 glass-header px-6 h-16 flex items-center">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary cursor-pointer">arrow_back</span>
          <span className="text-xl font-bold tracking-tight text-orange-700 font-headline">Urban Pulse</span>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-lg mx-auto">
        {/* Header Section */}
        <section className="mb-10">
          <h1 className="font-headline text-[2.5rem] leading-tight font-extrabold text-on-background mb-3">
            What interests you?
          </h1>
          <p className="text-on-surface-variant font-body text-lg leading-relaxed">
            Pick at least 3 categories to personalize your local pulse.
          </p>
        </section>

        {/* Category Bento Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Food (Selected State) */}
          <div className="relative bg-orange-100 rounded-3xl p-6 flex flex-col justify-between min-h-[160px] border-2 border-primary transition-all scale-95 duration-200 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              <span className="bg-primary text-white rounded-full p-1 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">check</span>
              </span>
            </div>
            <span className="font-headline text-primary font-bold text-lg">Food</span>
          </div>

          {/* Fitness (Tall Asymmetric Layout) */}
          <div className="row-span-2 bg-surface-container-lowest rounded-3xl p-6 flex flex-col justify-between min-h-[220px] shadow-sm shadow-slate-200/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl">fitness_center</span>
            <div>
              <span className="font-headline text-on-background font-bold text-lg block mb-1">Fitness</span>
              <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Active Life</span>
            </div>
          </div>

          {/* Groceries */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 flex flex-col justify-between min-h-[160px] shadow-sm shadow-slate-200/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant text-3xl">shopping_basket</span>
            <span className="font-headline text-on-background font-bold text-lg">Groceries</span>
          </div>

          {/* Electronics (Selected State) */}
          <div className="bg-orange-100 rounded-3xl p-6 flex flex-col justify-between min-h-[160px] border-2 border-primary transition-all scale-95 duration-200 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>devices</span>
              <span className="bg-primary text-white rounded-full p-1 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">check</span>
              </span>
            </div>
            <span className="font-headline text-primary font-bold text-lg">Electronics</span>
          </div>

          {/* Fashion (Tall Asymmetric Layout) */}
          <div className="row-span-2 bg-surface-container-lowest rounded-3xl p-6 flex flex-col justify-between min-h-[220px] shadow-sm shadow-slate-200/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl">apparel</span>
            <div>
              <span className="font-headline text-on-background font-bold text-lg block mb-1">Fashion</span>
              <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Streetwear</span>
            </div>
          </div>

          {/* Travel (Selected State) */}
          <div className="bg-orange-100 rounded-3xl p-6 flex flex-col justify-between min-h-[160px] border-2 border-primary transition-all scale-95 duration-200 cursor-pointer">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
              <span className="bg-primary text-white rounded-full p-1 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">check</span>
              </span>
            </div>
            <span className="font-headline text-primary font-bold text-lg">Travel</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-outline-variant/30"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-outline-variant/30"></div>
          <div className="h-1.5 w-8 rounded-full bg-primary"></div>
        </div>
      </main>

      {/* Fixed Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <div className="max-w-lg mx-auto">
          <button className="btn-gradient w-full py-5 rounded-full text-white font-headline font-bold text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-transform">
            Get Started
          </button>
          <p className="text-center mt-4 text-on-surface-variant font-label text-xs">
            You can change these anytime in your profile settings.
          </p>
        </div>
      </div>

      {/* Background Decoration (Asymmetric Bleeds) */}
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed top-1/2 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
    </>
  );
}
