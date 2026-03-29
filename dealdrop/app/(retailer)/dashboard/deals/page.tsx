'use client';
import { Deal } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ManageDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be authenticated to the retailer
    const fetchDeals = async () => {
      // Mocking fetch all deals for demo
      const res = await fetch('/api/deals');
      const data = await res.json();
      setDeals(data.deals || []);
      setLoading(false);
    };
    fetchDeals();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/deals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setDeals(deals.map(d => d.id === id ? { ...d, status: status as any } : d));
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Manage Inventory</h1>
          <p className="text-gray-500 font-medium">Active campaigns and flash mobs</p>
        </div>
      </header>

      {loading ? (
        <div className="h-64 animate-pulse bg-gray-100 rounded-3xl" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {deals.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest">No active deals. Start clearing stock!</p>
              <Link href="/post-deal" className="mt-4 inline-block text-indigo-600 font-black underline decoration-2 underline-offset-4">Post your first deal →</Link>
            </div>
          ) : (
            deals.map((deal) => (
              <div key={deal.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">🛍️</div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{deal.product_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        deal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {deal.status}
                      </span>
                      <span className="text-xs text-gray-400 font-bold tracking-tight">
                        {deal.quantity_remaining} / {deal.quantity_total} left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900">{formatCurrency(deal.current_price)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Expires {new Date(deal.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {deal.status === 'active' ? (
                      <button 
                        onClick={() => handleStatusChange(deal.id, 'sold_out')}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(deal.id, 'active')}
                        className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100"
                      >
                        Re-activate
                      </button>
                    )}
                    <button 
                      onClick={() => handleStatusChange(deal.id, 'cancelled')}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
