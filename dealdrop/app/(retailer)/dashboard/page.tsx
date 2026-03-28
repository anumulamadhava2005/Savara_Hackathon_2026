'use client';
import { AnalyticsDashboard } from '@/components/retailer/AnalyticsDashboard';
import Link from 'next/link';

export default function RetailerDashboard() {
  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Business Overview</h1>
          <p className="text-gray-500 font-medium">Real-time performance of your active deals</p>
        </div>
        <Link 
          href="/post-deal"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
        >
          🚀 Create New Deal
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnalyticsDashboard />
        
        <div className="space-y-6">
          <section className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
            <h3 className="text-indigo-900 font-black text-lg mb-2">Inventory Heatmap</h3>
            <p className="text-sm text-indigo-700 leading-relaxed mb-4">
              Your "Fresh Bread" deal is 80% sold out. Suggested action: Create a 2nd flash mob deal for remaining 20 units to clear stock before 9 PM.
            </p>
            <button className="text-sm font-bold text-indigo-600 bg-white px-4 py-2 rounded-lg">
              View AI Suggestion
            </button>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-black text-lg mb-4">Live Claims Activity</h3>
            <div className="space-y-4">
              {[
                { time: '2m ago', user: 'Rahul S.', deal: 'Milk 1L (Fresh)', points: '+15 XP' },
                { time: '15m ago', user: 'Ananya P.', deal: 'Eggs (Dozen)', points: '+15 XP' },
                { time: '45m ago', user: 'Vicky K.', deal: 'Bread (Brown)', points: '+15 XP' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">👤</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.deal}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-indigo-600 uppercase">{activity.points}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
