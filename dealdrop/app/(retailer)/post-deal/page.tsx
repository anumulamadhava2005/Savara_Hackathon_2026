'use client';
import { DealForm } from '@/components/retailer/DealForm';
import { VoiceInput } from '@/components/retailer/VoiceInput';
import { useState } from 'react';
import { VoiceParsedDeal, GeoPoint } from '@/types';
import { useRouter } from 'next/navigation';

export default function PostDealPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Partial<VoiceParsedDeal>>({});
  const [loading, setLoading] = useState(false);

  const handleVoiceParsed = (deal: VoiceParsedDeal) => {
    setInitialData({
      ...deal,
      // Suggested discount from AI might need mapping to original price
    });
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Mock location for the retailer shop
      const shopLoc: GeoPoint = { lat: 13.0827, lng: 80.2707 };

      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          lat: shopLoc.lat,
          lng: shopLoc.lng,
        }),
      });

      if (res.ok) {
        alert('Deal posted successfully!');
        router.push('/deals');
      } else {
        alert('Failed to post deal.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Post Live Deal</h1>
        <p className="text-gray-500 font-medium">Clear out your inventory in minutes</p>
      </header>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Option 1: Voice Command</h3>
          <VoiceInput onParsed={handleVoiceParsed} />
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Option 2: Manual Entry</span>
          </div>
          <DealForm 
            key={JSON.stringify(initialData)} // Re-mount form when voice data arrives
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isLoading={loading} 
          />
        </section>
      </div>

      <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
        <h4 className="text-yellow-800 font-black text-sm mb-1 uppercase tracking-tight italic">💡 Pro Tip</h4>
        <p className="text-xs text-yellow-700 leading-relaxed font-medium">
          Deals expiring within 4 hours get priority placement in the "Nearby" feed for high-urgency customers.
        </p>
      </div>
    </div>
  );
}
