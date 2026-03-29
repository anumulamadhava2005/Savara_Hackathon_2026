"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Utensils, Dumbbell, ShoppingBasket, Laptop, Shirt, Plane, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function InterestsPage() {
  const [selected, setSelected] = useState<string[]>(['Food', 'Electronics']);

  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const categories = [
    { id: 'Food', label: 'Food', icon: Utensils },
    { id: 'Fitness', label: 'Fitness', icon: Dumbbell, subtitle: 'ACTIVE LIFE' },
    { id: 'Groceries', label: 'Groceries', icon: ShoppingBasket },
    { id: 'Electronics', label: 'Electronics', icon: Laptop },
    { id: 'Fashion', label: 'Fashion', icon: Shirt },
    { id: 'Travel', label: 'Travel', icon: Plane },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative">
      {/* Header */}
      <div className="flex items-center p-6 pb-2 pt-8 z-10 sticky top-0 bg-surface">
        <Link href="/login" className="mr-4 text-primary hover:text-primary-dim transition-colors">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </Link>
        <span className="text-primary font-bold tracking-tight text-lg">Urban Pulse</span>
      </div>

      {/* Content */}
      <div className="px-6 pt-4 pb-40 flex-1 overflow-y-auto no-scrollbar">
        <h1 className="text-4xl font-extrabold text-on-surface mb-4 leading-[1.1] tracking-tight">
          What interests<br />you?
        </h1>
        <p className="text-[15px] font-medium text-on-surface-variant mb-8 leading-relaxed">
          Pick at least 3 categories to<br />personalize your local pulse.
        </p>

        {/* Categories Grid */}
        <div className="bento-grid">
          {categories.map((cat, idx) => {
            const isSelected = selected.includes(cat.id);
            const Icon = cat.icon;
            // Make Food (0) and Electronics (3) tall for bento look
            const isTall = idx === 0 || idx === 3;
            
            return (
              <div 
                key={cat.id}
                onClick={() => toggleInterest(cat.id)}
                className={`
                  relative cursor-pointer rounded-3xl p-5 flex flex-col justify-between transition-all duration-300
                  ${isTall ? 'aspect-[3/4] bento-item-tall' : 'aspect-square'}
                  ${isSelected ? 'bg-[#ffefdb] border border-primary/20 shadow-sm' : 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-md'}
                `}
              >
                <div className="flex justify-between items-start w-full">
                  <Icon 
                    size={28} 
                    className={isSelected ? 'text-[#8f2f00]' : 'text-outline-variant'} 
                    strokeWidth={isSelected ? 2.5 : 2}
                  />
                  {isSelected && (
                    <CheckCircle2 size={20} className="text-[#8f2f00]" fill="#ffefdb" />
                  )}
                </div>
                
                <div className="mt-auto">
                  <h3 className={`font-bold ${isSelected ? 'text-[#8f2f00]' : 'text-on-surface'}`}>
                    {cat.label}
                  </h3>
                  {cat.subtitle && (
                    <p className="text-[10px] font-bold tracking-widest text-outline uppercase mt-1">
                      {cat.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-end pointer-events-none max-w-md mx-auto z-20">
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-[180px] bg-gradient-to-t from-surface via-surface/90 to-transparent -z-10 pointer-events-auto"></div>
        
        <div className="w-full pointer-events-auto pb-4">
          <Link href="/location" className="w-full">
            <Button className="w-full h-14 mb-4 shadow-xl">
              Get Started
            </Button>
          </Link>
          <p className="text-center text-[11px] font-medium text-on-surface-variant mb-6">
            You can change these anytime in your profile settings.
          </p>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-2 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/40"></div>
            <div className="w-6 h-1.5 rounded-full bg-[#8f2f00]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
