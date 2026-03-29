'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Plus, Trash2, UploadCloud, X, Zap, Tag, ArrowRight, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

const CATEGORIES = ['food', 'wellness', 'fashion', 'grocery', 'electronics', 'general'];

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  image_url?: string;
  created_at: string;
}

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [basePrice, setBasePrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/retailer/items');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch { setItems([]); }
    setLoading(false);
  }

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select a valid image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    setIsUploading(false);
    if (!res.ok) throw new Error(json.error ?? 'Upload failed');
    return json.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice) { setError('Name and base price are required.'); return; }
    setIsSaving(true);
    setError('');
    try {
      let imageUrl: string | undefined;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const res = await fetch('/api/retailer/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, category, base_price: parseFloat(basePrice), image_url: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save item');

      setSuccess('Item added!');
      resetForm();
      fetchItems();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/retailer/items?id=${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const resetForm = () => {
    setName(''); setDescription(''); setCategory('general');
    setBasePrice(''); setImageFile(null); setImagePreview(null);
    setShowForm(false);
  };

  const categoryEmoji = (cat: string) => ({
    food: '🍽️', wellness: '🧘', fashion: '👗', grocery: '🛒',
    electronics: '💻', general: '🏷️',
  }[cat] ?? '🏷️');

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between mt-2">
        <div>
          <h1 className="text-[2rem] font-black text-gray-900 tracking-tight">My Items</h1>
          <p className="text-gray-500 font-medium mt-0.5">Add products to your catalog, then launch flash deals from them.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(''); }}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} /> Add Item
        </button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">New Catalog Item</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left col */}
            <div className="space-y-4">
              {/* Image upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageSelect(f); }}
                onDragOver={e => e.preventDefault()}
                className="relative h-48 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-orange-50/30 transition-all group overflow-hidden"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <span className="text-white font-bold text-sm">Click to change</span>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud size={40} className="text-gray-300 mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-bold text-gray-400 group-hover:text-primary">Drop image or click to upload</p>
                    <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP · Max 5MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }}
                />
              </div>

              {/* Category pills */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-black capitalize transition-all ${
                        category === cat
                          ? 'bg-primary text-white shadow-md shadow-orange-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {categoryEmoji(cat)} {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Item Name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Masala Dosa Combo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-semibold text-gray-900 placeholder-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of this item…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-semibold text-gray-900 placeholder-gray-300 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1.5">Base Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-black text-gray-900 placeholder-gray-300"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black text-[16px] shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving || isUploading ? (
                  <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {isUploading ? 'Uploading…' : 'Saving…'}</>
                ) : (
                  <><Package size={18} /> Save Item</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-2 text-green-700 font-bold bg-green-50 border border-green-200 px-5 py-3 rounded-2xl">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="h-72 bg-gray-100 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[2rem] border border-gray-100">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
            <Package size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-black text-gray-700">No items yet</h3>
          <p className="text-sm text-gray-400 text-center max-w-xs font-medium">
            Add your products to the catalog. You can then create flash deals from them instantly.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
          >
            <Plus size={18} /> Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={() => deleteItem(item.id)}
              onCreateDeal={() => router.push(`/create-deal?item_id=${item.id}&name=${encodeURIComponent(item.name)}&price=${item.base_price}&category=${item.category}&desc=${encodeURIComponent(item.description ?? '')}&img=${encodeURIComponent(item.image_url ?? '')}`)}
            />
          ))}
          {/* Add more item card */}
          <button
            onClick={() => setShowForm(true)}
            className="flex flex-col items-center justify-center gap-3 h-72 rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary hover:bg-orange-50/30 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <Plus size={28} className="text-gray-300 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[13px] font-black text-gray-400 group-hover:text-primary transition-colors">Add Item</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, onDelete, onCreateDeal }: { item: Item; onDelete: () => void; onCreateDeal: () => void }) {
  const categoryEmoji = (cat: string) => ({ food: '🍽️', wellness: '🧘', fashion: '👗', grocery: '🛒', electronics: '💻', general: '🏷️' }[cat] ?? '🏷️');
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
            <span className="text-6xl">{categoryEmoji(item.category)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Category pill */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-700 text-[10px] font-black px-2.5 py-1 rounded-xl capitalize shadow">
          {categoryEmoji(item.category)} {item.category}
        </div>
        {/* Delete */}
        <button
          onClick={() => { if (confirming) { onDelete(); } else { setConfirming(true); setTimeout(() => setConfirming(false), 2500); } }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${confirming ? 'bg-red-500 text-white scale-110' : 'bg-white/80 text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
          title={confirming ? 'Tap again to confirm' : 'Delete item'}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-[15px] text-gray-900 leading-tight mb-0.5 truncate">{item.name}</h3>
        <p className="text-[12px] text-gray-400 font-medium leading-relaxed line-clamp-2 mb-3 flex-1">{item.description || 'No description'}</p>
        <div className="flex items-center justify-between">
          <span className="font-black text-[18px] text-primary">₹{item.base_price.toFixed(0)}</span>
          <button
            onClick={onCreateDeal}
            className="flex items-center gap-1.5 bg-primary text-white text-[12px] font-black px-3.5 py-2 rounded-xl shadow-md shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95"
          >
            <Zap size={13} fill="white" /> Create Deal
          </button>
        </div>
      </div>
    </div>
  );
}
