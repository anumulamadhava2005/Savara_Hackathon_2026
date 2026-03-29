'use client';

import { Flame, ShoppingCart, TrendingUp, Search, Bell, Settings, Edit3, CheckCircle2, XCircle, SearchIcon, Sparkles, Lightbulb, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ManageDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, redeemed: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dealsRes, salesRes] = await Promise.all([
          fetch('/api/retailer/deals'),
          fetch('/api/retailer/sales')
        ]);
        
        if (dealsRes.ok) {
          const dData = await dealsRes.json();
          setDeals(dData.deals || []);
        }
        
        if (salesRes.ok) {
          const sData = await salesRes.json();
          let rev = 0; let red = 0;
          if (sData.stats) {
            sData.stats.forEach((s: any) => {
              rev += s.revenue_potential;
              red += s.redeemed_count;
            });
            setStats({ revenue: rev, redeemed: red });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeCount = deals.filter(d => d.status === 'active').length;

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Top Navigation Row (replicated the search from layout to be safe? 
          Wait, the layout has TopNav. I will only build the page content.) */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Deals</p>
             <h2 className="text-4xl font-black text-gray-900">{isLoading ? '-' : activeCount}</h2>
           </div>
           <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-primary shadow-sm">
             <Flame size={24} fill="currentColor" />
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Redeemed</p>
             <h2 className="text-4xl font-black text-gray-900">{isLoading ? '-' : stats.redeemed}</h2>
           </div>
           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0058ba] shadow-sm">
             <ShoppingCart size={24} fill="currentColor" />
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Revenue Boost</p>
             <h2 className="text-4xl font-black text-gray-900">${isLoading ? '-' : stats.revenue.toLocaleString()}</h2>
           </div>
           <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-100">
             <TrendingUp size={24} />
           </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col min-h-[500px]">
        
        {/* Header Setup */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
           <div className="flex items-center gap-6">
             <h3 className="text-xl font-black text-gray-900">Deal Inventory</h3>
             <div className="flex bg-gray-100 rounded-lg p-1">
                <button className="px-4 py-1.5 text-sm font-bold text-gray-900 bg-white rounded-md shadow-sm">All</button>
                <button className="px-4 py-1.5 text-sm font-bold text-gray-500 rounded-md hover:text-gray-900">Active</button>
                <button className="px-4 py-1.5 text-sm font-bold text-gray-500 rounded-md hover:text-gray-900">History</button>
             </div>
           </div>
           <Link href="/create-deal" className="bg-gradient-to-r from-[#a33700] to-orange-500 text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-orange-900/20 text-sm hover:scale-105 transition-all">
             + Launch New Deal
           </Link>
        </div>

        {/* Table itself */}
        <div className="w-full overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-[10px] font-black tracking-widest uppercase text-gray-400">
                <th className="pb-4 pl-4 font-bold">Item Name & Category</th>
                <th className="pb-4 font-bold text-center">Status</th>
                <th className="pb-4 font-bold">Inventory</th>
                <th className="pb-4 font-bold text-center">Ends In</th>
                <th className="pb-4 font-bold">Auto-Removal</th>
                <th className="pb-4 pr-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 font-bold">Loading deals...</td>
                </tr>
              )}
              {!isLoading && deals.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 font-bold">No deals published yet.</td>
                </tr>
              )}
              {deals.map((deal) => {
                const isExpired = deal.status === 'expired';
                const pct = Math.round((deal.quantity_remaining / deal.quantity_total) * 100) || 0;
                const isLow = pct < 20;

                return (
                  <tr key={deal.id} className={`hover:bg-gray-50/50 transition-colors group ${isExpired ? 'opacity-50' : ''}`}>
                    <td className="py-5 pl-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-sm overflow-hidden text-2xl ${isExpired ? 'bg-gray-200 grayscale' : 'bg-gradient-to-br from-orange-400 to-orange-600'}`}>
                         🏷️
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-[15px]">{deal.product_name}</h4>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{deal.category} • {deal.discount_percent}% OFF</p>
                      </div>
                    </td>
                    <td className="py-5 text-center px-2">
                       {deal.status === 'active' ? (
                         <span className="inline-flex items-center gap-1.5 bg-orange-50 text-primary border border-orange-100 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Active
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 border border-gray-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                           {deal.status.toUpperCase()}
                         </span>
                       )}
                    </td>
                    <td className="py-5 w-48 pr-6">
                       <div className={`flex justify-between text-xs font-bold mb-1 ${isLow && !isExpired ? 'text-red-500' : 'text-gray-900'}`}>
                         <span>{deal.quantity_remaining} Left</span>
                         <span className={isLow && !isExpired ? 'text-red-500' : 'text-gray-500'}>{pct}%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full ${isLow ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                       </div>
                    </td>
                    <td className="py-5 text-center">
                       <div className="inline-flex items-center gap-1.5 text-gray-500 font-black text-xs">
                         <Clock size={16} className={deal.status === 'active' ? 'text-primary' : ''} /> {new Date(deal.expiry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </div>
                    </td>
                    <td className="py-5">
                       <div className={`flex items-center gap-1.5 text-xs font-bold ${isExpired ? 'text-gray-400' : 'text-[#34A853]'}`}>
                         {isExpired ? <XCircle size={16} /> : <CheckCircle2 size={16} />} 
                         {isExpired ? 'Removed' : 'On Expiry'}
                       </div>
                    </td>
                    <td className="py-5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
                           <Edit3 size={18} />
                        </button>
                        {/* Toggle Switch */}
                        <div className={`w-10 h-6 rounded-full relative cursor-pointer shadow-inner ${deal.status === 'active' ? 'bg-primary' : 'bg-gray-200 border border-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${deal.status === 'active' ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Area */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
          <p className="text-sm font-medium text-gray-500">Showing {deals.length} total deals</p>
          <div className="flex items-center gap-2 text-gray-400">
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:text-gray-900 transition-colors">{'<'}</button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:text-gray-900 transition-colors">{'>'}</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {/* Blue Opt-in Card */}
        <div className="bg-[#0058ba] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200 flex flex-col justify-center">
          <div className="absolute right-0 top-0 opacity-20 transform scale-150 -translate-y-4 text-white">
            <Sparkles size={120} />
          </div>
          <h3 className="text-2xl font-bold mb-2 z-10">Automated Optimization is On</h3>
          <p className="text-blue-100 text-sm mb-6 leading-relaxed max-w-sm z-10">
            Pulse AI is monitoring your inventory. Deals with less than 5 units are being prioritized in user feeds to ensure zero waste.
          </p>
          <button className="bg-white text-[#0058ba] font-bold px-6 py-2.5 rounded-full text-sm w-fit z-10 shadow-sm hover:bg-gray-50 transition-colors">
            Review Settings
          </button>
        </div>

        {/* Yellow Tip Card */}
        <div className="bg-orange-50 rounded-2xl p-8 text-gray-900 flex items-start gap-6 border border-orange-100">
          <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center flex-shrink-0 shadow-sm mt-1 border-4 border-orange-50">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 tracking-tight">Pro Tip: Lunch Rush</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Deals launched between 10:00 AM and 11:30 AM see a 40% higher redemption rate in your area.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

function ImageIcon({ size } : { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}
