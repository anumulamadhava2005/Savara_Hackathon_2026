'use client';

import { Zap, MapPin, Store, Crosshair, Plus, Minus, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StoreSetupPage() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(['Urban Wellness']);
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const tags = [
    { name: 'Gastronomy', icon: '🍴' },
    { name: 'Urban Wellness', icon: '🌿' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Local Books', icon: '📖' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Craft & Arts', icon: '🎨' },
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/retailer/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_name: shopName,
          description: description,
          address: "742 North Michigan Ave, Chicago, IL 60611", // Defaulted mock
          category: selectedTags[0] || 'general',
          lat: 41.8962,
          lng: -87.6242
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to initialize store');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      
      {/* Left Form Panel */}
      <div className="w-full lg:w-[480px] flex-shrink-0 flex flex-col p-8 lg:p-12 overflow-y-auto border-r border-gray-100 relative z-10 bg-white">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
           <div className="bg-[#a33700] rounded-lg p-1.5 text-white">
             <Zap size={20} fill="currentColor" />
           </div>
           <span className="text-xl font-black text-gray-900 tracking-tighter">Pulse</span>
        </div>

        <div>
           <h1 className="text-[2.5rem] font-black text-gray-900 leading-tight tracking-tighter mb-4">
              Store Profile <br />
              <span className="text-[#a33700]">Setup</span>
           </h1>
           <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed max-w-sm">
              Tell your local community who you are. This information will help Pulse residents discover your store.
           </p>
        </div>

        <form className="flex-1 flex flex-col gap-10 max-w-sm w-full" onSubmit={handleSubmit}>
           {errorMsg && (
             <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100">
               {errorMsg}
             </div>
           )}
           
           {/* Essential Details */}
           <div>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-[#a33700] rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">Essential Details</h3>
             </div>
             <div className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Store Legal Name</label>
                  <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} required placeholder="e.g., The Urban Roast Coffee Co." className="w-full bg-gray-100 border-none rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-[#a33700]/20 outline-none transition-all" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Public Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe your store's vibe and what makes you unique..." rows={4} className="w-full bg-gray-100 border-none rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-[#a33700]/20 outline-none transition-all resize-none"></textarea>
               </div>
             </div>
           </div>

           {/* Category Tags */}
           <div>
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-[#0058ba] rounded-full"></div>
                   <h3 className="text-xl font-bold text-gray-900">Category Tags</h3>
                </div>
                <span className="text-[10px] font-black text-[#0058ba] bg-blue-100 px-2 py-0.5 rounded uppercase tracking-widest">Max 3</span>
             </div>
             <div className="flex flex-wrap gap-3">
               {tags.map((tag) => {
                 const isSelected = selectedTags.includes(tag.name);
                 return (
                   <button 
                     key={tag.name}
                     type="button"
                     onClick={() => handleTagToggle(tag.name)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-bold shadow-sm ${
                       isSelected 
                         ? 'border-[#a33700] text-[#a33700] bg-orange-50' 
                         : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                     }`}
                   >
                     <span>{tag.icon}</span> {tag.name}
                   </button>
                 );
               })}
             </div>
           </div>

           {/* Public Contacts */}
           <div>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-6 bg-yellow-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">Public Contacts</h3>
             </div>
             <div className="flex gap-4">
               <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-600 mb-2">Store Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+1 (555) 000-0000" className="w-full bg-gray-100 border-none rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-[#a33700]/20 outline-none transition-all" />
               </div>
               <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-600 mb-2">Website (Optional)</label>
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.yourstore.com" className="w-full bg-gray-100 border-none rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-[#a33700]/20 outline-none transition-all" />
               </div>
             </div>
           </div>

           {/* Submit */}
           <div className="pt-6">
              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full bg-gradient-to-r from-[#a33700] to-[#b34700] text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-orange-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
              >
                 {isLoading ? 'Saving...' : 'Save Profile & Launch'} <ArrowRight size={20} />
              </button>
              <div className="text-center mt-6">
                 <button type="button" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">I&apos;ll complete this later</button>
              </div>
           </div>

        </form>
      </div>

      {/* Right Map Panel */}
      <div className="flex-1 bg-[#47575e] relative min-h-[600px] overflow-hidden hidden md:block">
        
        {/* Mock Map Background Vector */}
        <div className="absolute inset-0 opacity-40 mix-blend-color-burn" style={{ backgroundImage: 'radial-gradient(circle at center, transparent, rgba(0,0,0,0.8))' }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
           {/* Radar Circles */}
           <div className="absolute w-[800px] h-[800px] rounded-full border border-white/20"></div>
           <div className="absolute w-[600px] h-[600px] rounded-full border border-white/20"></div>
           <div className="absolute w-[400px] h-[400px] rounded-full border-2 border-white/40 border-dashed animate-spin"></div>
           <div className="absolute w-[200px] h-[200px] rounded-full border border-white/20"></div>
           
           {/* Location Pin */}
           <div className="relative z-10 flex flex-col items-center">
             <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold mb-3 shadow-xl">
                Pin Store Location
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
             </div>
             <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse backdrop-blur-sm">
                <div className="w-10 h-10 bg-[#a33700] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                   <Store size={18} />
                </div>
             </div>
           </div>
        </div>

        {/* Address Search Overlay */}
        <div className="absolute top-6 left-6 right-24 max-w-md bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-xl z-20">
           <input type="text" value="742 North Michigan Ave, Chicago, IL 60611" readOnly className="w-full bg-transparent text-gray-900 font-bold outline-none" />
        </div>

        {/* Map Controls */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
           <button type="button" className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-700 shadow-xl hover:bg-white transition-colors">
             <Crosshair size={20} />
           </button>
           <div className="flex flex-col bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
             <button type="button" className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-white/50 transition-colors border-b border-gray-200">
               <Plus size={20} />
             </button>
             <button type="button" className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-white/50 transition-colors">
               <Minus size={20} />
             </button>
           </div>
        </div>

        {/* Info Card Bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-2xl z-20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-[#d9c49e] flex items-center justify-center text-amber-800 shadow-inner">
                 <Target size={20} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold">Precision Targeting</h3>
                <p className="text-sm font-medium text-gray-600 mt-0.5 max-w-[250px]">
                  Pins help us notify users within a <span className="text-[#a33700] font-bold">2-mile radius</span> when you launch exclusive flash deals.
                </p>
              </div>
           </div>
           <button type="button" className="bg-[#a33700] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg hover:bg-orange-800 transition-colors">
             Active Sync
           </button>
        </div>

      </div>

    </div>
  );
}
