'use client';

import { ScanLine, Search, CheckCircle2, Info, Check, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function FulfillmentPage() {
  const [claimId, setClaimId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [redeemedClaims, setRedeemedClaims] = useState<{ id: string; time: string }[]>([]);

  const handleRedeem = async (id?: string) => {
    const targetId = id || claimId;
    if (!targetId.trim()) {
      setErrorMsg('Please enter a valid Claim ID.');
      return;
    }
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/claims/${targetId.trim()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'redeemed' })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Verification failed');
      }

      setSuccessMsg(`Claim #${targetId} has been successfully redeemed!`);
      setRedeemedClaims(prev => [{ id: targetId, time: new Date().toLocaleTimeString() }, ...prev]);
      setClaimId('');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-6xl mx-auto">
      
      <div className="mt-2 text-center md:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order Fulfillment</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">Verify customer redemptions and complete store transactions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Scanner & Active Scan */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-100 flex-1">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                   <ScanLine size={24} className="text-primary" /> Scan Customer QR Code
                </h3>
                <span className="bg-[#e6effc] text-[#0058ba] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                   Camera Active
                </span>
             </div>

             {/* Mock Viewfinder */}
             <div className="w-full aspect-video bg-gray-900 rounded-2xl relative overflow-hidden flex items-center justify-center border-4 border-gray-900 shadow-inner group cursor-pointer">
                {/* Simulated Camera Feed Texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#a33700] to-gray-900 opacity-80 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-red-900/40 mix-blend-color-burn"></div>
                
                {/* The Scanner Reticle */}
                <div className="relative z-10 w-full max-w-sm aspect-[4/3] border-2 border-primary/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] flex items-center justify-center">
                   {/* Corner Accents */}
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg max-w-full"></div>
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg max-w-full"></div>
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg max-w-full"></div>
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg max-w-full"></div>
                   
                   {/* Scan Line */}
                   <div className="absolute left-0 w-full h-1 bg-primary blur-[2px] opacity-80 animate-[scan_2s_ease-in-out_infinite]"></div>

                   {/* Help Text */}
                   <p className="absolute bottom-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold opacity-80 shadow-md">
                     Center the QR code within the frame
                   </p>
                </div>
                
                {/* Watermark/Mock Text inside camera */}
                <div className="absolute font-black text-6xl text-white/5 opacity-50 text-center uppercase tracking-tighter leading-none pointer-events-none transform -skew-x-12">
                   DEALDROP <br/> SAFE <br/> ZONE
                </div>
             </div>

             {/* Active Scan Found Container */}
             <div className="bg-orange-50/50 rounded-2xl p-6 mt-6 border-2 border-orange-100 shadow-md transform transition-all hover:-translate-y-1">
                <div className="flex gap-6 items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner flex flex-col justify-center items-center text-white border-4 border-white">
                    <div className="w-12 h-14 bg-red-600 rounded-lg rounded-t-xl overflow-hidden shadow-sm flex flex-col items-center">
                      <div className="w-full h-3 bg-red-800"></div>
                      <span className="text-[8px] font-black uppercase mt-4 tracking-widest text-red-100">Deal</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Active Scan Found</p>
                    <h4 className="text-2xl font-black text-gray-900 leading-tight">UltraBoost Cloud Runner</h4>
                    <p className="text-sm font-bold text-gray-500 mt-0.5">Reservation ID: <span className="text-gray-900">#PLS-8829-QX</span></p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 text-sm font-bold line-through">$180.00</p>
                    <p className="text-4xl font-black text-gray-900 leading-tight">$126.00</p>
                    <span className="inline-block mt-1 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-0.5 rounded shadow-sm">
                      30% OFF REDEEMED
                    </span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Manual Verification</h3>
             <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
               Claim / Confirmation ID
             </label>
             <div className="relative mb-4">
               <input 
                 type="text"
                 value={claimId}
                 onChange={(e) => setClaimId(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                 placeholder="e.g. PLS-0000-00" 
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-[#0058ba]/20 focus:border-[#0058ba] outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
               />
               <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
             <button 
               onClick={() => handleRedeem()}
               disabled={isLoading}
               className={`w-full bg-[#0058ba] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-[#004da4] transition-colors ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
               <ScanLine size={18} /> {isLoading ? 'Verifying...' : 'Verify Manually'}
             </button>

             {errorMsg && (
               <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                 <XCircle size={16} /> {errorMsg}
               </div>
             )}
             {successMsg && (
               <div className="mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold border border-green-100 flex items-center gap-2">
                 <CheckCircle2 size={16} /> {successMsg}
               </div>
             )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Transaction</h3>
             <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
               Confirm customer has received the item and finalize the deal status.
             </p>
             <button 
               onClick={() => handleRedeem(claimId || undefined)}
               disabled={isLoading || !claimId.trim()}
               className={`w-full bg-gradient-to-br from-[#a33700] to-orange-500 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(163,55,0,0.25)] hover:scale-105 transition-all mb-6 ${(isLoading || !claimId.trim()) ? 'opacity-60 pointer-events-none' : ''}`}>
               <div className="w-8 h-8 rounded-full bg-white text-[#a33700] flex items-center justify-center">
                 <Check size={20} strokeWidth={3} />
               </div>
               Mark as Redeemed
             </button>

             <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                  Marking as redeemed will automatically update your <strong className="text-gray-900">Fulfillment Dashboard</strong> and notify the customer via email.
                </p>
             </div>
          </div>

          <div className="px-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Redeemed Today</h4>
            <div className="space-y-4">
              {redeemedClaims.length === 0 && (
                <p className="text-xs text-gray-400 font-medium">No redemptions yet today.</p>
              )}
              {redeemedClaims.map((claim, i) => (
                <div key={i} className="flex items-start gap-3">
                   <div className="w-2 h-2 rounded-full bg-[#34A853] mt-1.5 shadow-[0_0_8px_rgba(52,168,83,0.6)]"></div>
                   <div>
                     <p className="font-bold text-gray-900 text-sm">#{claim.id}</p>
                     <p className="text-xs text-gray-500 font-medium">Redeemed at {claim.time}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}
