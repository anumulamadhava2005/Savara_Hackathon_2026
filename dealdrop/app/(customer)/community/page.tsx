"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Activity, MapPin } from 'lucide-react';

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      user: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      time: "2 hours ago",
      location: "The Butcher's Table",
      content: "Just claimed the 50% Off Ribs deal! You guys were not kidding about the portion sizes. Absolutely insane value through Urban Pulse.",
      image: "https://images.unsplash.com/photo-1544025162-836901980a56?q=80&w=800&auto=format&fit=crop",
      likes: 42,
      comments: 7
    },
    {
      id: 2,
      user: "Marcus V.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      time: "5 hours ago",
      location: "SneakerHead NYC",
      content: "Secured my spot in the Squad Flash Mob for the Yeezys! We only need 3 more people to trigger the 30% discount. Who's in?",
      image: null,
      likes: 128,
      comments: 34
    }
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 border-b border-surface-container-high/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-on-surface flex items-center gap-2 w-full">
          Community Vibe <Activity size={20} className="text-primary"/>
        </h1>
      </div>

      <div className="px-6 md:px-0 pt-6 space-y-6 max-w-2xl mx-auto w-full">
        {/* Post Input Header (Simulated) */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-surface-container flex items-center gap-3">
           <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 rounded-full object-cover"/>
           <div className="flex-1 bg-surface-container-low h-10 rounded-full flex items-center px-4 text-outline-variant font-medium text-sm cursor-text hover:bg-surface-container transition-colors">
              Share your pulse...
           </div>
        </div>

        {/* Feed Posts */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface-container">
             <div className="p-5">
                {/* Author Info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <img src={post.avatar} className="w-12 h-12 rounded-full object-cover border border-surface-container"/>
                    <div>
                      <h4 className="font-extrabold text-[15px] leading-tight text-on-surface">{post.user}</h4>
                      <p className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                         {post.time} • <MapPin size={10} className="ml-1"/> {post.location}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors text-outline-variant">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </div>
                </div>

                {/* Content */}
                <p className="text-[15px] text-on-surface-variant leading-relaxed font-medium mb-4">
                  {post.content}
                </p>
             </div>

             {/* Optional Image */}
             {post.image && (
                <div className="w-full aspect-[4/3] bg-slate-100">
                   <img src={post.image} className="w-full h-full object-cover" alt="Post media"/>
                </div>
             )}

             {/* Action Bar */}
             <div className="px-5 py-4 border-t border-surface-container-low flex justify-between items-center text-outline-variant">
                <div className="flex gap-6">
                   <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#b31b25] transition-colors">
                      <Heart size={20} className={post.id === 1 ? 'fill-[#b31b25] text-[#b31b25]' : ''} />
                      <span className={`font-bold text-sm ${post.id === 1 ? 'text-[#b31b25]' : ''}`}>{post.likes}</span>
                   </div>
                   <div className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                      <MessageCircle size={20} />
                      <span className="font-bold text-sm">{post.comments}</span>
                   </div>
                </div>
                <div className="cursor-pointer hover:text-primary transition-colors">
                   <Share2 size={18} />
                </div>
             </div>
          </div>
        ))}

        {/* Loading Spinner Area */}
        <div className="w-full flex justify-center pb-8 pt-4">
           <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
