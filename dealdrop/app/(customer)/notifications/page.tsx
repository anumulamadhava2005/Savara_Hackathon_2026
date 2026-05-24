"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Settings, MapPin, Users, AlertCircle, Zap, Check } from '@/components/ui/Icons';
import { useAppStore } from '@/store/appStore';

const ICON_MAP: Record<string, React.ReactNode> = {
  location: <MapPin className="text-[#0058ba]" size={20} />,
  squad: <Users className="text-white" size={20} />,
  alert: <AlertCircle className="text-[#9f0519]" size={20} />,
  system: <Zap className="text-[#fcab23]" size={20} />,
};

const BG_MAP: Record<string, string> = {
  location: 'bg-[#bed2ff]',
  squad: 'bg-primary btn-gradient',
  alert: 'bg-[#ffefee]',
  system: 'bg-[#ffefdb]',
};

export default function NotificationsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { notifications, markAllRead, syncNotifications } = useAppStore();
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    syncNotifications();
  }, [syncNotifications]);

  // Load Leverage AI widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://studio.levrage.ai/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const unread = (notifications || []).filter(n => n.unread && !dismissed.includes(n.id));
  const read = (notifications || []).filter(n => (!n.unread || dismissed.includes(n.id)));

  const handleDismiss = (id: string) => {
    setDismissed(p => [...p, id]);
  };

  if (!isHydrated) return null;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 border-b border-surface-container-high/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-on-surface flex items-center gap-2">
          Notifications <Bell size={20} className="text-primary" />
        </h1>
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface-container rounded-full text-[12px] font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="px-6 md:px-0 pt-4 space-y-6 max-w-3xl mx-auto w-full">
        {/* Unread */}
        {unread.length > 0 && (
          <div>
            <h3 className="font-bold text-[11px] text-outline-variant tracking-widest uppercase mb-3 pl-2">New & Unread</h3>
            <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-surface-container divide-y divide-surface-container-high/60">
              {unread.map(note => (
                <div key={note.id} className="p-5 flex gap-4 relative bg-white hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  onClick={() => handleDismiss(note.id)}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#b31b25]"></div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${BG_MAP[note.type] || 'bg-surface-container'}`}>
                    {ICON_MAP[note.type]}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-extrabold text-[15px] text-on-surface truncate">{note.title}</h4>
                      <span className="text-[11px] font-bold text-outline-variant ml-2 shrink-0 whitespace-nowrap">{note.time}</span>
                    </div>
                    <p className="text-[13px] font-medium text-on-surface-variant leading-relaxed line-clamp-2">{note.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read */}
        {read.length > 0 && (
          <div>
            <h3 className="font-bold text-[11px] text-outline-variant tracking-widest uppercase mb-3 pl-2">Earlier</h3>
            <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-surface-container divide-y divide-surface-container-high/60">
              {read.map(note => (
                <div key={note.id} className="p-5 flex gap-4 bg-surface/30 hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 opacity-60 ${BG_MAP[note.type] || 'bg-surface-container'}`}>
                    {ICON_MAP[note.type]}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-[14px] text-on-surface-variant truncate">{note.title}</h4>
                      <span className="text-[11px] font-medium text-outline ml-2 shrink-0 whitespace-nowrap">{note.time}</span>
                    </div>
                    <p className="text-[13px] font-normal text-outline leading-relaxed line-clamp-2">{note.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(notifications || []).length === 0 && (
          <div className="py-16 text-center">
            <Bell size={48} className="text-outline-variant mx-auto mb-4" />
            <h3 className="text-lg font-bold text-on-surface mb-2">All caught up!</h3>
            <p className="text-on-surface-variant font-medium">No new notifications. Go explore some pulses.</p>
          </div>
        )}
      </div>

      {/* Leverage AI Widget */}
      <div
        id="nova-widget"
        data-agent-id="7e268fb8-ebcf-4d03-bd14-c07c63fdcd7d"
        data-user-id="f2c8c709-e30a-4dd2-a4cd-6cc94c2fb3e3"
        data-embed-key="LEVRAGE_API_SECRET"
        data-style="glass"
        data-mode="voice"
        data-theme="dark"
        data-position="bottom-right"
        data-primary="#a0836e"
        data-secondary="#1f2937"
        data-primary-light="#0ea5e9"
        data-secondary-light="#f3f4f6"
        data-radius="16"
        data-blur="12"
        data-opacity="0.6"
        data-logo="https://cdn.vectorstock.com/i/500p/07/80/deal-drop-announcement-vector-62440780.jpg"
        data-track-navigation="true"
        data-track-forms="true"
        data-track-selection="true"
        data-track-scroll="true"
        data-track-exit="true"
        data-track-idle="true"
      ></div>
    </div>
  );
}
