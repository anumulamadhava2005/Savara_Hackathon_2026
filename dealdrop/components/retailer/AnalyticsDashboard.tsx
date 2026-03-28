'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockData = [
  { name: 'Mon', claims: 45, revenue: 4500 },
  { name: 'Tue', claims: 52, revenue: 5200 },
  { name: 'Wed', claims: 38, revenue: 3800 },
  { name: 'Thu', claims: 65, revenue: 6500 },
  { name: 'Fri', claims: 89, revenue: 8900 },
  { name: 'Sat', claims: 42, revenue: 4200 },
  { name: 'Sun', claims: 35, revenue: 3500 },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase">Total Claims</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">366</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% vs last week</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase">Revenue Lost Avoided</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹36,600</p>
          <p className="text-xs text-green-600 mt-1">↑ 8% vs last week</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase">Customer Reach</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">1.2k</p>
          <p className="text-xs text-blue-600 mt-1">Nearby residents</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Weekly Claims Pulse</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="claims" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Revenue Saved</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
