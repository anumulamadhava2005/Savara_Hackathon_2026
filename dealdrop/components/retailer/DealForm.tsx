'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DealCategory, VoiceParsedDeal } from '@/types';
import { useState, useEffect } from 'react';

const dealSchema = z.object({
  product_name: z.string().min(2, 'Product name required'),
  description: z.string().optional(),
  category: z.enum(['grocery', 'bakery', 'dairy', 'produce', 'general'] as const),
  original_price: z.number().min(1),
  current_price: z.number().min(1),
  discount_percent: z.number().min(0).max(100),
  quantity_total: z.number().min(1),
  expiry_hours: z.number().min(1),
  is_flash_mob: z.boolean().default(false),
  flash_mob_target: z.number().optional(),
  flash_mob_discount: z.number().optional(),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface DealFormProps {
  initialData?: Partial<DealFormValues>;
  onSubmit: (data: DealFormValues) => void;
  isLoading?: boolean;
}

export function DealForm({ initialData, onSubmit, isLoading }: DealFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: initialData || {
      category: 'grocery',
      is_flash_mob: false,
    },
  });

  const originalPrice = watch('original_price');
  const discountPercent = watch('discount_percent');
  const isFlashMob = watch('is_flash_mob');

  useEffect(() => {
    if (originalPrice && discountPercent) {
      const current = Math.round(originalPrice * (1 - discountPercent / 100));
      setValue('current_price', current);
    }
  }, [originalPrice, discountPercent, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Product Name</label>
        <input
          {...register('product_name')}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Fresh Wheat Bread"
        />
        {errors.product_name && <p className="text-xs text-red-500">{errors.product_name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category')}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="grocery">Grocery</option>
            <option value="bakery">Bakery</option>
            <option value="dairy">Dairy</option>
            <option value="produce">Produce</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            {...register('quantity_total', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Original Price</label>
          <input
            type="number"
            {...register('original_price', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Discount %</label>
          <input
            type="number"
            {...register('discount_percent', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Deal Price</label>
          <input
            type="number" readOnly
            {...register('current_price', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Expires in (Hours)</label>
        <input
          type="number"
          {...register('expiry_hours', { valueAsNumber: true })}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="e.g. 24"
        />
      </div>

      <div className="p-3 bg-indigo-50 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('is_flash_mob')} className="w-4 h-4 text-indigo-600 rounded" />
          <span className="text-sm font-semibold text-indigo-900">Enable Flash Mob Squad Deal</span>
        </label>
        {isFlashMob && (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <label className="text-xs text-indigo-700 font-medium">Target People</label>
              <input
                type="number"
                {...register('flash_mob_target', { valueAsNumber: true })}
                className="w-full p-1.5 border border-indigo-200 rounded text-sm"
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-indigo-700 font-medium">Extra % Off</label>
              <input
                type="number"
                {...register('flash_mob_discount', { valueAsNumber: true })}
                className="w-full p-1.5 border border-indigo-200 rounded text-sm"
                placeholder="e.g. 10"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50"
      >
        {isLoading ? 'Creating Deal...' : '🚀 Post Live Deal'}
      </button>
    </form>
  );
}
