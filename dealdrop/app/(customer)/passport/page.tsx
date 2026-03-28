'use client';
import { DealPassport } from '@/components/passport/DealPassport';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types';
import { useEffect, useState } from 'react';

export default function PassportPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data as unknown as UserProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Rewards & XP</h2>
        <p className="text-sm text-gray-500 font-medium px-8">
          The more deals you claim, the higher your hunter rank grows!
        </p>
      </section>

      {loading ? (
        <div className="h-64 animate-pulse bg-gray-100 rounded-3xl" />
      ) : profile ? (
        <DealPassport
          stamps={profile.deal_passport_stamps}
          level={profile.passport_level}
          fullName={profile.full_name || undefined}
        />
      ) : (
        <div className="p-8 bg-indigo-50 rounded-3xl text-center">
          <p className="text-indigo-900 font-bold mb-4">You need to be logged in to track your passport!</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">Log In</button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Recent Achievements</h3>
        <div className="space-y-3">
          {[
            { label: 'First Catch', desc: 'Claimed your first deal', date: '2 days ago', icon: '🐣' },
            { label: 'Hyperfocal', desc: 'Saved 3 deals in one day', date: 'Yesterday', icon: '🔥' },
            { label: 'Squad Leader', desc: 'Fulfilled a Flash Mob deal', date: 'Locked', icon: '👥', locked: true },
          ].map((achievement, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                achievement.locked ? 'bg-gray-50 border-gray-100 opacity-50 grayscale' : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <span className="text-3xl">{achievement.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-900">{achievement.label}</p>
                <p className="text-xs text-gray-500 font-medium">{achievement.desc}</p>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">{achievement.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
