'use client';

import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell
} from 'recharts';
import { Tag, Bookmark, Zap, Calendar, Activity, TrendingUp } from '@/components/ui/Icons';
import { useState, useEffect } from 'react';

const areaData = [
  { name: 'MON', value: 24000 },
  { name: 'TUE', value: 25000 },
  { name: 'WED', value: 45000 },
  { name: 'THU', value: 65000 },
  { name: 'FRI', value: 87000 },
  { name: 'SAT', value: 90000 },
  { name: 'SUN', value: 85000 },
];

const barData = [
  { value: 40 }, { value: 30 }, { value: 60 }, { value: 45 }, { value: 80 }, { value: 95 }
];

const lineData = [
  { value: 10 }, { value: 12 }, { value: 11 }, { value: 25 }, { value: 15 }, { value: 45 }, { value: 30 }
];

export default function RetailerDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, redeemed: 0, activeDeals: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/retailer/sales');
        if (!res.ok) return;
        const data = await res.json();
        
        let rev = 0;
        let red = 0;
        if (data.stats && Array.isArray(data.stats)) {
          data.stats.forEach((s: any) => {
            rev += s.revenue_potential;
            red += s.redeemed_count;
          });
          setStats({ totalRevenue: rev, redeemed: red, activeDeals: data.stats.length });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header Section */}
      <div className="flex items-end justify-between mt-2">
        <div>
          <h1 className="text-[2.2rem] font-bold text-gray-900 tracking-tight leading-tight">Morning, Alex.</h1>
          <p className="text-gray-500 font-medium text-lg mt-1">
            Your Downtown Branch performance is up <span className="text-blue-600 font-bold">12.4%</span> this week.
          </p>
        </div>
        <Link 
          href="/create-deal"
          className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center gap-2"
        >
          <PlusIcon /> Launch New Deal
        </Link>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Deal Views */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col justify-between h-48 relative overflow-hidden">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Deal Posts</p>
            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
                {isLoading ? '-' : stats.activeDeals}
              </h2>
              <span className="text-orange-600 font-bold text-sm mb-1 bg-orange-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <TrendingUp size={14}/> Live
              </span>
            </div>
          </div>
          <div className="h-16 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                 <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === barData.length - 1 ? '#a33700' : index === barData.length - 2 ? '#d97746' : index === barData.length - 3 ? '#e2a382' : '#f0d6c8'} />
                  ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col justify-between h-48 relative">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Claim Redemptions</p>
            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
                {isLoading ? '-' : stats.redeemed}
              </h2>
              <span className="text-blue-600 font-bold text-sm mb-1 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Activity size={14}/> Solid
              </span>
            </div>
          </div>
          <div className="h-16 w-[110%] -ml-2 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="value" stroke="#0058ba" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completed Sales */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-5 text-gray-900">
            <Activity size={120} />
          </div>
          <div>
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Revenue Potential</p>
              <span className="text-primary font-bold text-xs bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                <Calendar size={12}/> Today
              </span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
              ${isLoading ? '-' : stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h2>
          </div>
          
          <div className="mt-4">
             <div className="flex gap-1 mb-2">
               <div className="h-2 flex-1 bg-[#0058ba] rounded-full"></div>
               <div className="h-2 flex-1 bg-[#0058ba] rounded-full opacity-80"></div>
               <div className="h-2 flex-1 bg-[#0058ba] rounded-full opacity-60"></div>
               <div className="h-2 flex-1 bg-[#0058ba] rounded-full opacity-40"></div>
               <div className="h-2 flex-1 bg-gray-100 rounded-full"></div>
             </div>
             <p className="text-xs text-gray-500 font-medium">Daily conversion goal: <span className="font-bold text-gray-900">82% achieved</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Area */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Performance Trends</h3>
                <p className="text-sm text-gray-500 font-medium">Engagement across all active campaign deals</p>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button className="px-4 py-1.5 text-sm font-bold text-gray-500 rounded-md hover:text-gray-900">Daily</button>
                <button className="px-4 py-1.5 text-sm font-bold text-white bg-primary rounded-md shadow-sm shadow-orange-200">Weekly</button>
                <button className="px-4 py-1.5 text-sm font-bold text-gray-500 rounded-md hover:text-gray-900">Monthly</button>
              </div>
            </div>
            <div className="h-72 w-full mt-4 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a33700" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a33700" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => `${val/1000}K`} />
                  <Area type="monotone" dataKey="value" stroke="#a33700" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Campaigns Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 flex items-center gap-4">
               <div className="w-20 h-20 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500 font-black italic text-xl">RUNNER</span>
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Active Now</p>
                 <h4 className="font-bold text-gray-900 leading-tight mb-3">Flash Sale: Crimson Runner Series</h4>
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Reserved</p>
                      <p className="font-black text-gray-900">142/200</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Time Left</p>
                      <p className="font-black text-primary">02h 45m</p>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 flex items-center gap-4">
               <div className="w-20 h-20 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-300 font-black italic text-xl -rotate-12 bg-white/20 px-2 py-1 rounded">DEAL</span>
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Scheduled</p>
                 <h4 className="font-bold text-gray-900 leading-tight mb-3">Tech Night: Smart Connect Pro</h4>
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Waitlist</p>
                      <p className="font-black text-gray-900">3,401</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Starts In</p>
                      <p className="font-black text-gray-900">14h 22m</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Columns */}
        <div className="space-y-6">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-start gap-4 mb-5 relative z-10 w-full">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-white shadow-sm">
                    <Tag size={12} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">New Sale!</span> Crimson Runner redeemed by <span className="text-blue-600 font-bold">@marcus_dev</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-start gap-4 mb-5 relative z-10 w-full">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-white shadow-sm">
                    <Bookmark size={12} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">Reservation Hit!</span> Weekly goal for <span className="font-bold">Urban Tech</span> achieved.
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">15 minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-start gap-4 mb-5 relative z-10 w-full">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-white shadow-sm">
                    <Zap size={12} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">Campaign Weekend Bliss</span> has been approved and scheduled.
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-start gap-4 relative z-10 w-full">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-white shadow-sm">
                    <Tag size={12} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">New Sale!</span> Crimson Runner redeemed by <span className="text-blue-600 font-bold">@sarah_lee</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>

            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-gray-50 text-gray-900 font-bold text-sm hover:bg-gray-100 transition-colors uppercase tracking-widest">
              View Full Audit Log
            </button>
          </div>

          <div className="bg-[#0058ba] rounded-[1.5rem] p-6 shadow-lg shadow-blue-200 text-white relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
               <Zap size={120} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-2">Boost Your Visibility</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Promoted deals get 3x more engagement. Start a Pulse Boost today.
            </p>
            <button className="bg-white text-[#0058ba] font-bold px-5 py-2.5 rounded-lg text-sm hover:scale-105 transition-transform z-10 relative">
              Learn More
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
