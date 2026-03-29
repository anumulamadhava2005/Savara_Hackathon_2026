export default function DealDetailsPage() {
  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none">
        <div className="flex items-center px-4 h-16 w-full">
          <button className="flex items-center justify-center w-10 h-10 active:scale-95 duration-150 transition-opacity hover:opacity-80 text-orange-700 cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg flex-1 ml-2 text-orange-700">Deal Details</h1>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center active:scale-95 duration-150 text-slate-600 cursor-pointer">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center active:scale-95 duration-150 text-slate-600 cursor-pointer">
              <span className="material-symbols-outlined">bookmark</span>
            </button>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 h-px w-full opacity-20"></div>
      </header>

      <main className="pt-16 pb-40">
        {/* Hero Section */}
        <section className="relative h-[397px] w-full overflow-hidden">
          <img alt="Gourmet Burger" className="w-full h-full object-cover" data-alt="Close-up of a premium gourmet wagyu beef burger with melting cheese, caramelized onions, and fresh arugula on a toasted brioche bun, warm restaurant lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfgw1s1RWF1Tc3aKUfiJUVN-CKGIvS2X6AgezpEvxLH9TyKsM4XhldhvDg_RQ1b71qr4aEV7Qz7XwTbWQ2ne5Z1qC7ACoakLvpbVCfDHIOfVQ2zVByt8IkuNk-6e84Ei6rEOlIo4KLEb1LghAoC9av6rxaMx89VWlfsLEGhwfj2QEHBIN6kK1YpAp5_OnVz1V36ikvXIvJ7IYdauK8KpC9sl2uV49HXU3iTQ8Ac7xGAwRwnDaZQ__U9vVcOEH1pHbubC2W338ZLX8" />
          
          {/* Badges Overlapping Hero */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <div className="bg-primary text-on-primary px-4 py-2 rounded-full font-headline font-extrabold text-xl shadow-lg ring-4 ring-white/20">
              50% OFF
            </div>
            <div className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-lg font-headline font-bold text-sm flex items-center gap-1 shadow-md">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span>FLASH DEAL</span>
            </div>
          </div>
          
          {/* Image Gradient Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex gap-1">
              <div className="w-8 h-1 rounded-full bg-white"></div>
              <div className="w-2 h-1 rounded-full bg-white/40"></div>
              <div className="w-2 h-1 rounded-full bg-white/40"></div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-medium">
              1/5 Photos
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="px-5 -mt-6 relative z-10 max-w-xl mx-auto">
          {/* Main Title Card */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-primary uppercase tracking-widest font-headline">Limited Discovery</span>
                <h2 className="text-3xl font-headline font-extrabold leading-tight text-on-surface">The Truffle Monster Burger</h2>
              </div>
            </div>

            {/* Pulse Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container-low p-3 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">timer</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase">Ends In</p>
                  <p className="font-headline font-bold text-on-surface">02h 45m 12s</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase">Availability</p>
                  <p className="font-headline font-bold text-error">Only 3 left!</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-on-surface-variant leading-relaxed font-body mb-6">
              Experience the ultimate flavor explosion with our signature wagyu patty, infused with black truffle oil, topped with aged swiss cheese, and nestled in a gold-leaf dusted brioche bun.
            </p>

            {/* Store Info Section */}
            <div className="pt-6 border-t border-outline-variant/10">
              <div className="flex items-center gap-4">
                <img alt="Merchant" className="w-14 h-14 rounded-2xl object-cover" data-alt="Modern upscale bistro interior with warm lighting and minimalist wood decor, professional photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh4Qnjwn37hA7YEeMcUUwfdipFZs7WLMjwdKDdFJ_UUlO6A4HV0MnYh8ts8qztGbeOM_fmU_pJlpu_6J6hu7cDGsFe1P3SMGgq5AzRqYtp4mOschFD6SWU9myhVIe5uXezaVuQ_zLKUnuJtj1w0VFR_qrbBwxFkw2e4dWvb5BdzT4_Ggzu82VBWhlOUfKeriwBfRA8-Ajl4FRiSM3Ih12ZCyZE9XzlpEq4ew9X0MR-hbTyUIZvBJXMsdxAobKg_C8Gdlo2pm4d8sU" />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-headline font-bold text-on-surface text-lg">Urban Bistro &amp; Grill</h3>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      0.8 miles away
                    </span>
                    <span className="flex items-center gap-1 font-medium text-tertiary">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.9 (2.4k reviews)
                    </span>
                  </div>
                </div>
                <button className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center cursor-pointer hover:opacity-90">
                  <span className="material-symbols-outlined">directions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section - Asymmetric Layout */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-end px-2">
              <h4 className="font-headline font-bold text-xl">Word on the Street</h4>
              <button className="text-primary font-bold text-sm cursor-pointer hover:underline">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {/* Review Card 1 */}
              <div className="min-w-[280px] bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm transform rotate-1">
                <div className="flex gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                  <div>
                    <p className="text-xs font-bold font-headline">Sarah J.</p>
                    <div className="flex text-[10px] text-tertiary">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm italic text-on-surface-variant">&quot;The truffle aroma hits you before the plate even reaches the table. Absolute 10/10.&quot;</p>
              </div>

              {/* Review Card 2 */}
              <div className="min-w-[280px] bg-white p-5 rounded-[1.5rem] shadow-sm transform -rotate-1 translate-y-2">
                <div className="flex gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                  <div>
                    <p className="text-xs font-bold font-headline">Marcus K.</p>
                    <div className="flex text-[10px] text-tertiary">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[12px]">star</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm italic text-on-surface-variant">&quot;Best deal I&apos;ve found on Pulse yet. The wagyu was perfectly cooked.&quot;</p>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="mt-8">
            <h4 className="font-headline font-bold text-lg px-2 mb-4">Payment Preference</h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative cursor-pointer group">
                <input defaultChecked className="peer sr-only" name="payment" type="radio" />
                <div className="p-4 rounded-2xl bg-surface-container-low border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary-container/10 transition-all duration-200">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    <span className="text-sm font-bold font-headline">Pay Now (Online)</span>
                    <span className="text-[10px] text-on-surface-variant text-center leading-tight">Instant confirmation &amp; priority queue</span>
                  </div>
                </div>
              </label>

              <label className="relative cursor-pointer group">
                <input className="peer sr-only" name="payment" type="radio" />
                <div className="p-4 rounded-2xl bg-surface-container-low border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary-container/10 transition-all duration-200">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">storefront</span>
                    <span className="text-sm font-bold font-headline">Pay at Store</span>
                    <span className="text-[10px] text-on-surface-variant text-center leading-tight">Pay on pickup or while dining in</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-[0_-8px_24px_rgba(44,47,48,0.1)]">
        <div className="px-6 pt-4 pb-8 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Total Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-headline font-extrabold text-on-surface">$14.50</span>
                <span className="text-sm text-on-surface-variant line-through">$29.00</span>
              </div>
            </div>
            <div className="flex items-center bg-surface-container rounded-full p-1 h-10">
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-white active:scale-90 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-8 text-center font-bold text-sm">1</span>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-white active:scale-90 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
          <button className="pulse-gradient w-full h-16 rounded-full flex items-center justify-center gap-3 text-white font-headline font-extrabold text-lg shadow-[0_8px_20px_rgba(163,55,0,0.3)] active:scale-95 transition-all cursor-pointer">
            <span>Reserve Now / Pickup Later</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </>
  );
}
