export default function DealsPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
            <img alt="User Profile" className="w-full h-full object-cover" data-alt="Close-up portrait of a friendly young man with short dark hair and a warm smile, neutral studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdh1Q9VLYamyE-_Ks9fFHn72T-k7zeDvp83eOirzQuca1i5No2YEmN3Fl4fu3qyk4h6SsAXI1f424vN79ea0D75IzwOv_AZ1JNWK93AowAM9_DVK-Ww7PYZhG_dzxMBbcdE84C2DkRv6kmUcFedqP-w19ss2JdT_gnf0mu2zGKthKqDhuz1vF1c5VzvjsaV0IMzte0eNDb1J70N0eTNqx5OUeOsyNFJYcEYeIIAUreVhdeW99R8RvUDx32RPR7vmEclRpomWdiDUU" />
          </div>
          <span className="text-2xl font-extrabold text-[#a33700] tracking-tighter">Local Pulse</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">map</span>
        </button>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto pb-32">
        {/* View Toggle & Search */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex bg-surface-container-low p-1.5 rounded-full w-fit self-center md:self-start">
            <button className="px-6 py-2.5 rounded-full bg-surface-container-lowest shadow-sm text-primary font-bold text-sm transition-all flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-sm">list</span>
              List View 📃
            </button>
            <button className="px-6 py-2.5 rounded-full text-on-surface-variant font-medium text-sm transition-all flex items-center gap-2 hover:bg-surface-container-high/40 cursor-pointer">
              <span className="material-symbols-outlined text-sm">map</span>
              Map View 🗺️
            </button>
          </div>
          
          <div className="relative group">
            <input className="w-full bg-surface-container-highest border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-0 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-on-surface-variant/60 outline-none" placeholder="Search local gems..." type="text" />
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-12 -mx-6 px-6">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm whitespace-nowrap shadow-lg shadow-primary/20 cursor-pointer">
            <span className="material-symbols-outlined text-lg">category</span>
            Category
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/15 text-on-surface font-semibold text-sm whitespace-nowrap hover:bg-surface-container-low transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">distance</span>
            Distance
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/15 text-on-surface font-semibold text-sm whitespace-nowrap hover:bg-surface-container-low transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">payments</span>
            Price
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/15 text-on-surface font-semibold text-sm whitespace-nowrap hover:bg-surface-container-low transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">schedule</span>
            Urgency
          </button>
        </div>

        {/* Live Near You (Asymmetric Grid) */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Live Near You</h2>
              <p className="text-on-surface-variant font-medium mt-1">Real-time pulses in your neighborhood</p>
            </div>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:opacity-80 cursor-pointer">
              See all <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Primary Card */}
            <div className="md:col-span-8 group hover:cursor-pointer">
              <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden p-4 h-full flex flex-col transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-[320px] rounded-[1.5rem] overflow-hidden mb-4">
                  <img alt="Gourmet Burger" className="w-full h-full object-cover" data-alt="Mouth-watering gourmet wagyu burger with melting cheese and fresh greens in an upscale industrial restaurant setting, warm mood lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXafrBW0TqJTNERhESsa5gTwfAvt4qpXM3TfxixfDArCxPR3xuHnjZ6o3od6c3ppUPTdytxpuanoFnQ3CXz_Ez1Fu4ivNpJv65PusOTjm0uAvidK-dsboeqzkx-CsqvzRZGC5LstGpSuOFSWHJpBTdenjhs8uKz-aCUVAQrgwW2T2NjKmlg3Wi1zDORARkA1T4JGMXqa35vj5kub4rihA_QvVp7Qs-oSkmeNBoGZhaqzNsI9PKJjvJmQh-J96hYRYqsCt0ZIbTIjM" />
                  
                  <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    Trending
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-white">
                      <div className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Ending In</div>
                      <div className="text-lg font-black leading-none">01:42:05</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-xl">
                      <span className="material-symbols-outlined" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold leading-tight">The Butcher&apos;s Table - 50% Off Signature Ribs</h3>
                    <span className="text-primary font-black text-2xl">$18</span>
                  </div>
                  <div className="flex items-center gap-4 text-on-surface-variant text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">near_me</span>
                      0.4 miles away
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.9 (120)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Sidebar Card */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden p-4 transition-transform duration-300 hover:-translate-y-1 hover:cursor-pointer">
                <div className="relative h-44 rounded-[1.25rem] overflow-hidden mb-4">
                  <img alt="Urban Boutique" className="w-full h-full object-cover" data-alt="Interior of a modern high-end sneaker boutique with neon lighting and minimalist display shelves, vibrant urban atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFDDVy_hptiVp-sT-FZqmLGboAVAI0uS8dnpWLYLfYkmhfKZZv7YrN1cIVuTe6kUveQlXKQgXNJYEjM0jjxQT53P-YKCroqrysuGJgpoN_kAz1d9BhGUzXKKcCfuOb8h0xNuvVZj-FVa-2fsQ5ygUkZ3yY9kl6ZsRsQRHW0NLkj6oBbQHwWhofXdmysWUhQ3AHtQ4GxGNB9DuAT8Rdw0EQWoUPNS-KIIBxihFvXEkZsN3rkoau98tL-lOwGxz6UZ5nCE0KNNZ-vgk" />
                  <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Flash Sale</div>
                </div>
                <h3 className="font-bold text-lg leading-tight mb-2">Neon Kicks Drop - 30% Off Storewide</h3>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-xs font-semibold">1.2 miles away</span>
                  <span className="bg-surface-container-low px-2 py-1 rounded-lg text-[10px] font-bold text-secondary uppercase">Ending in 4h</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-6 text-white flex flex-col justify-between h-full min-h-[180px]">
                <div>
                  <span className="material-symbols-outlined text-3xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <h3 className="text-xl font-black leading-tight">Surprise Pulse!</h3>
                  <p className="text-white/80 text-sm mt-2 font-medium">Claim a mystery deal within 500m of your location.</p>
                </div>
                <button className="w-full bg-white text-primary font-bold py-3 rounded-2xl shadow-lg mt-4 text-sm active:scale-95 duration-150 transition-transform cursor-pointer">Unlock Deal</button>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Personalized for You (Horizontal Bento) */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">AI-Personalized for You</h2>
              <p className="text-on-surface-variant text-sm font-medium">Based on your love for Tech &amp; Travel</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Travel Card */}
            <div className="relative group rounded-[1.5rem] overflow-hidden aspect-[4/5] bg-surface-container-highest cursor-pointer">
              <img alt="Travel Trip" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Sunlit street in Paris with the Eiffel Tower in the far distance, vintage aesthetic with warm golden tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3rLrFFvg08E2-sMoq3EFPIjiYQe0KLYeCHZWPqCjjt21cSIqJKy-OJbMFfNI-4O8qe7yNnHaQvzXAgyIavcd6nq9tOrK8tBxpGjULJqerAvGzk6cL1qKIdCwKvMammLtmw9VWmlBrDgvJS8pMZlfJoeD9veiFOq8qRoIper-oY-xmz_OyV5Q47xwhnKc8J4DgojeAfUouXWVHkrF4vqx_uHRSuEv4xXrmBDIlTBNGavlHGKSPOZd42PrbEcNhAfbCp72NJ__xZo" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest mb-1">Travel</span>
                <h4 className="text-white font-bold text-lg leading-tight">Weekend Getaway: 40% Off Flights</h4>
              </div>
            </div>

            {/* Electronics Card */}
            <div className="relative group rounded-[1.5rem] overflow-hidden aspect-[4/5] bg-surface-container-highest cursor-pointer">
              <img alt="Electronics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Modern professional noise-canceling headphones resting on a sleek dark oak desk, minimalist aesthetic with clean lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFlAH_b4S4wMEr6D_PStTUHBZ9T3p4MrfY6KLumMNlJYQXhCO2wjZn9DiFFjsj1cfAFNC1VvGPV_YXCguF-ma8CVqFlYjx_TFcDN5TP-86JpUJfDj_tIk3Os_ZN8r7gYsQZIy_bxNAryLvCS-UNF8TZLhtFVj8nPDghjVcrsSkHFC4-s8-iPPURfKHPOkfs_HWlN6prNjKP_9U7OZUxecLJApSzUPD0OqObtPKn9kAd9_1nZv_XjRwsO--ke4PgyRSjt84lq9j6ag" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-secondary-fixed-dim uppercase tracking-widest mb-1">Electronics</span>
                <h4 className="text-white font-bold text-lg leading-tight">Next-Gen Audio Sale</h4>
              </div>
            </div>

            {/* Food Card */}
            <div className="relative group rounded-[1.5rem] overflow-hidden aspect-[4/5] bg-surface-container-highest cursor-pointer">
              <img alt="Food" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Artisanal thin-crust pizza with fresh basil and mozzarella being pulled apart, rustic Italian kitchen background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJVintd4usKiVnKoL1N5sTHJbw_L5Xt2EURrCAG80LB28-hSv4bkh0I9diE21rVuz6lZ0KK55b-9v6VjpELQoOdGI4n1VAKhqzZNlmv6ujahW8Cs38m7hcVALRsu77XbPC-GyK20FJY6gxT1sWCJdN5UorA1kk64lgAPGmov6kbGQDfd8Qdj0m91dFpx1J1u0poNaTVhu-Qd6DdxYeN-MTsrXTT1kDQmOfoRaNsT6-VCwlu4ROp88dqTAYvjBKaK9DTYnv4fZgSY4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-tertiary-container uppercase tracking-widest mb-1">Food</span>
                <h4 className="text-white font-bold text-lg leading-tight">Secret Menu Pizza Night</h4>
              </div>
            </div>

            {/* Lifestyle Card */}
            <div className="relative group rounded-[1.5rem] overflow-hidden aspect-[4/5] bg-surface-container-highest cursor-pointer">
              <img alt="Fitness" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Interior of a luxury modern gym with high-end equipment and large windows looking over a city skyline at dusk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsb4oq2aPbg9U0acsigAiTh0XnSDo3yF89aVP_ctIUSfYfFiZjiAyUO8ABEjPHeensRQGDSmJd6Lx1roONT41Aa6F79v1Z_Fb0yFXgH232toMcHEFLCmbiOI60zceFq-EL61AciE-kxuj_9pQLl-O_Iby8rw3lUzDlbM-pWxFmsujLHBVMmDj5KTDCrD6YJ1EBuAuGQEfGncHuQIeqQbZkHjD_Rfq9Nzyl0hOiiIdUmCO-VeI4h6cGQ3o04Sky6gqTVNfOTopwsFs" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Lifestyle</span>
                <h4 className="text-white font-bold text-lg leading-tight">Local Yoga: First Month Free</h4>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-8 left-0 right-0 z-50 flex justify-around items-center px-4 mx-auto w-[90%] max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_24px_rgba(44,47,48,0.06)]">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#a33700] to-[#ff7943] text-white rounded-full p-3 shadow-lg scale-90 duration-200 ease-out cursor-pointer">
          <span className="material-symbols-outlined">explore</span>
          <span className="plus-jakarta-sans font-bold text-[10px] uppercase tracking-widest mt-1">Discover</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#595c5d] dark:text-slate-400 p-3 hover:text-[#0058ba] transition-colors cursor-pointer">
          <span className="material-symbols-outlined">local_offer</span>
          <span className="plus-jakarta-sans font-bold text-[10px] uppercase tracking-widest mt-1">Deals</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#595c5d] dark:text-slate-400 p-3 hover:text-[#0058ba] transition-colors cursor-pointer">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="plus-jakarta-sans font-bold text-[10px] uppercase tracking-widest mt-1">Saved</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#595c5d] dark:text-slate-400 p-3 hover:text-[#0058ba] transition-colors cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
          <span className="plus-jakarta-sans font-bold text-[10px] uppercase tracking-widest mt-1">Activity</span>
        </div>
      </nav>

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-32 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-40 active:scale-95 transition-all outline-none border-none cursor-pointer">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </>
  );
}
