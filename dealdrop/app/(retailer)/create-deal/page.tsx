'use client';

import { AlertCircle, Clock, ImageIcon, Rocket, Lightbulb, Share2, Eye, UploadCloud, Info } from '@/components/ui/Icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateDealPage() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryHours, setExpiryHours] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const orig = parseFloat(originalPrice) || 0;
    const dist = parseFloat(discount) || 0;
    const current = orig - (orig * (dist / 100));

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          description: "Exclusive local fast-claim deal",
          category: "general",
          original_price: orig,
          current_price: current,
          discount_percent: dist,
          quantity_total: parseInt(quantity) || 0,
          expiry_hours: expiryHours,
          lat: 13.0827,
          lng: 80.2707,
          image_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=400&auto=format&fit=crop',
          is_flash_mob: false
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create deal');
      }

      router.push('/deals');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#a33700] to-[var(--color-primary-fixed)] rounded-[1.5rem] p-8 text-white shadow-xl shadow-orange-900/10 relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
             <Rocket size={200} fill="currentColor" />
           </div>
           
           <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
             Pulse Engine Active
           </span>
           <h2 className="text-3xl font-black mb-3">Drive Instant Foot Traffic</h2>
           <p className="text-orange-50 font-medium text-lg leading-relaxed max-w-lg">
             Flash deals appear at the top of local users&apos; feeds. High urgency leads to 4x higher conversion rates.
           </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-[1.5rem] p-8 text-white shadow-xl shadow-yellow-900/10 relative overflow-hidden flex flex-col justify-between">
           <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest bg-yellow-900/20 px-2 py-1 rounded">
             Live Analytics
           </span>
           <div className="mt-8">
             <div className="flex items-start gap-1">
               <div className="opacity-80">
                 <Rocket size={32} />
               </div>
               <h2 className="text-6xl font-black tracking-tighter">84<span className="text-4xl">%</span></h2>
             </div>
             <p className="font-bold text-yellow-900 leading-tight mt-2">Average claim rate for<br/>flash deals today</p>
           </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Deal Configuration</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Fields marked with an asterisk are required for broadcast.</p>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-100"></div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
           <div className="md:col-span-12">
             <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
               Product Name *
               <Info size={14} className="text-gray-400" />
             </label>
             <div className="relative">
               <input 
                 type="text" 
                 value={productName}
                 onChange={(e) => setProductName(e.target.value)}
                 required
                 placeholder="e.g. Artisanal Espresso Beans" 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
               />
             </div>
           </div>
           <div className="md:col-span-4">
             <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
               Original Price *
             </label>
             <div className="relative flex items-center">
               <span className="absolute left-4 text-gray-400 font-black">$</span>
               <input 
                 type="number" 
                 value={originalPrice}
                 onChange={(e) => setOriginalPrice(e.target.value)}
                 required
                 placeholder="20" 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               />
             </div>
           </div>
           
           <div className="md:col-span-4">
             <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
               Discount *
             </label>
             <div className="relative flex items-center">
               <input 
                 type="number" 
                 value={discount}
                 onChange={(e) => setDiscount(e.target.value)}
                 required
                 placeholder="25" 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               />
               <span className="absolute right-4 text-gray-400 font-black">%</span>
             </div>
           </div>

           <div className="md:col-span-4">
             <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
               Quantity *
             </label>
             <div className="relative flex items-center">
               <input 
                 type="number" 
                 value={quantity}
                 onChange={(e) => setQuantity(e.target.value)}
                 required
                 placeholder="50" 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-16 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               />
               <span className="absolute right-4 text-gray-500 font-bold text-sm">Units</span>
             </div>
           </div>
        </div>

        {/* Expiry Time Card */}
        <div className="bg-gray-50/50 rounded-2xl p-6 mb-10 border border-gray-100/80">
           <div className="flex items-start gap-4 mb-6">
             <div className="w-12 h-12 rounded-full bg-[#b31b25] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200">
               <Clock size={24} />
             </div>
             <div>
               <h4 className="font-bold text-gray-900 text-lg">Expiry Time & Urgency</h4>
               <p className="text-sm text-gray-500 font-medium">When should this flash deal disappear?</p>
             </div>
           </div>

           <div className="flex flex-wrap gap-3 mb-6">
             <button type="button" onClick={() => setExpiryHours(0.25)} className={`font-bold px-6 py-3 rounded-full transition-all text-sm shadow-sm ${expiryHours === 0.25 ? 'bg-[#b31b25] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}>
               15 Minutes
             </button>
             <button type="button" onClick={() => setExpiryHours(0.5)} className={`font-bold px-6 py-3 rounded-full transition-all text-sm shadow-sm ${expiryHours === 0.5 ? 'bg-[#b31b25] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}>
               30 Minutes
             </button>
             <button type="button" onClick={() => setExpiryHours(1)} className={`font-bold px-6 py-3 rounded-full transition-all text-sm shadow-sm ${expiryHours === 1 ? 'bg-[#b31b25] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}>
               1 Hour (Recommended)
             </button>
             <button type="button" onClick={() => setExpiryHours(3)} className={`font-bold px-6 py-3 rounded-full transition-all text-sm shadow-sm ${expiryHours === 3 ? 'bg-[#b31b25] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}>
               3 Hours
             </button>
           </div>

           <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 shadow-sm">
               <span className="text-gray-400 font-bold font-mono tracking-widest text-lg">--:--</span>
               <div className="h-4 w-px bg-gray-200"></div>
               <span className="text-sm text-gray-400 font-medium">Custom Time</span>
           </div>

           <div className="bg-red-50 text-[#b31b25] px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
               <AlertCircle size={16} />
               Flash deals cannot exceed 4 hours. Pulse algorithm prioritizes shorter duration deals for maximum notification velocity.
           </div>
        </div>

        {/* Deal Visual */}
        <div className="mb-10">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-gray-400" />
            Deal Visual
          </label>
          <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group">
             <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-4 group-hover:scale-110 transition-transform">
               <UploadCloud size={24} />
             </div>
             <p className="font-bold text-gray-700 mb-1">Drag and drop or click to upload</p>
             <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">High-Quality JPG/PNG (Max 5MB)</p>
          </div>
        </div>

        {/* Action Area */}
        <div className="text-center">
          <button disabled={isLoading} type="submit" className={`w-full bg-gradient-to-r from-[#a33700] to-orange-500 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-orange-900/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
             <Rocket size={24} fill="currentColor" className="opacity-80"/> {isLoading ? 'Publishing...' : 'Publish One-Click Flash Deal'}
          </button>
          <p className="text-xs text-gray-500 font-medium mt-4">By publishing, you agree to fulfill all claimed vouchers within 24 hours.</p>
        </div>
      </form>

      {/* Footer Tip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
              <Lightbulb size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Pro Tip: 40/40 Rule</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Deals with 40% discount and 40 units available perform best for lunchtime surges.</p>
         </div>

         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-primary flex items-center justify-center mb-4">
              <Share2 size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Auto-Broadcasting</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Pulse automatically pings the top 500 loyal customers nearby when you launch.</p>
         </div>

         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <Eye size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Live Preview</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Click any field to see how your deal looks on the customer-facing Pulse mobile app.</p>
         </div>
      </div>
    </div>
  );
}
