"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Activity, MapPin } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

export default function CommunityPage() {
  const currentUser = MOCK_USERS[0]; // using Priya Sharma
  const supabase = createClient();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Fetch error:", error);
        alert(`Database Error: ${error.message}\n\nDid you run the SQL script to create the 'community_posts' table in Supabase?`);
      }

      if (data && data.length > 0) {
        setPosts(data.map(p => ({
          ...p,
          user: p.user_name,
          time: p.time_display,
          isLiked: false
        })));
      } else {
        setPosts([]);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [supabase]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPostData = {
      user_name: currentUser.full_name,
      avatar: currentUser.avatar_url,
      time_display: "Just now",
      location: "Nearby",
      content: newPostContent,
      image: null,
      likes: 0,
      comments: 0
    };

    const tempId = Date.now().toString();
    const optimisticPost = {
      id: tempId,
      ...newPostData,
      user: newPostData.user_name,
      time: newPostData.time_display,
      isLiked: false
    };
    
    setPosts([optimisticPost, ...posts]);
    setNewPostContent('');

    const { data, error } = await supabase
      .from('community_posts')
      .insert([newPostData])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      alert(`Failed to save post: ${error.message}\n\nPlease make sure the table exists and RLS allows inserts.`);
      // Revert the optimistic UI update
      setPosts(current => current.filter(p => p.id !== tempId));
      return;
    }

    if (data) {
      setPosts(current => current.map(p => p.id === tempId ? {
        ...data,
        user: data.user_name,
        time: data.time_display,
        isLiked: false
      } : p));
    }
  };

  const handleToggleLike = async (postId: string | number) => {
    const postToUpdate = posts.find(p => p.id === postId);
    if (!postToUpdate) return;

    const newIsLiked = !postToUpdate.isLiked;
    const newLikes = newIsLiked ? postToUpdate.likes + 1 : postToUpdate.likes - 1;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isLiked: newIsLiked, likes: newLikes };
      }
      return post;
    }));

    if (typeof postId === 'string' && postId.includes('-')) {
        await supabase
          .from('community_posts')
          .update({ likes: newLikes })
          .eq('id', postId);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 border-b border-surface-container-high/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-on-surface flex items-center gap-2 w-full">
          Community Vibe <Activity size={20} className="text-primary"/>
        </h1>
      </div>

      <div className="px-6 md:px-0 pt-6 space-y-6 max-w-2xl mx-auto w-full">
        {/* Post Input Header (Interactive) */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-surface-container flex items-center gap-3">
           <img src={currentUser.avatar_url} className="w-10 h-10 rounded-full object-cover"/>
           <form onSubmit={handlePostSubmit} className="flex-1 flex items-center bg-surface-container-low rounded-full px-2">
             <input 
                type="text" 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your pulse..." 
                className="w-full bg-transparent h-10 px-2 text-on-surface text-sm focus:outline-none placeholder:text-outline-variant font-medium transition-colors"
             />
             <button 
                type="submit" 
                disabled={!newPostContent.trim()}
                className="text-primary hover:bg-surface-container p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
                <Share2 size={16} />
             </button>
           </form>
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
                   <div 
                      onClick={() => handleToggleLike(post.id)}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-[#b31b25] transition-colors"
                   >
                      <Heart size={20} className={post.isLiked ? 'fill-[#b31b25] text-[#b31b25]' : ''} />
                      <span className={`font-bold text-sm ${post.isLiked ? 'text-[#b31b25]' : ''}`}>{post.likes}</span>
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
        {loading && (
          <div className="w-full flex justify-center pb-8 pt-4">
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div className="w-full text-center text-on-surface-variant pt-10 font-medium">
             No pulses found yet. Be the first to share!
          </div>
        )}
      </div>
    </div>
  );
}
