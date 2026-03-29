'use client';

import {
  Info, Clock, AlertTriangle, Image as ImageIcon, Rocket, Lightbulb,
  Share2, Eye, UploadCloud, X, AlertCircle, Package,
} from 'lucide-react';
import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = ['food', 'wellness', 'fashion', 'grocery', 'electronics', 'general'];

/* ─── inner form (needs useSearchParams → must be inside Suspense) ─── */
function CreateDealForm() {
  const router = useRouter();
  const params = useSearchParams();

  // Pre-fill from Items catalog (passed via query params)
  const prefillName     = params.get('name')     ?? '';
  const prefillPrice    = params.get('price')    ?? '';
  const prefillCategory = params.get('category') ?? 'general';
  const prefillDesc     = params.get('desc')     ?? '';
  const prefillImg      = params.get('img')      ?? '';
  const fromItem        = !!params.get('item_id');

  const [productName,   setProductName]   = useState(prefillName);
  const [description,   setDescription]   = useState(prefillDesc);
  const [category,      setCategory]      = useState(prefillCategory);
  const [originalPrice, setOriginalPrice] = useState(prefillPrice);
  const [discount,      setDiscount]      = useState('');
  const [quantity,      setQuantity]      = useState('');
  const [expiryHours,   setExpiryHours]   = useState(1);
  const [isLoading,     setIsLoading]     = useState(false);
  const [errorMsg,      setErrorMsg]      = useState('');

  // Image state — pre-seed from catalog if available
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(prefillImg || null);
  const [imageUrl,     setImageUrl]     = useState<string>(prefillImg);
  const [isUploading,  setIsUploading]  = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setErrorMsg('Please select a valid image (JPG, PNG, WebP).'); return; }
    if (file.size > 5 * 1024 * 1024)    { setErrorMsg('Image must be under 5MB.'); return; }
    setErrorMsg('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl(''); // clear prefill, will re-upload
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res  = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    setIsUploading(false);
    if (!res.ok) throw new Error(json.error ?? 'Image upload failed');
    return json.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const orig    = parseFloat(originalPrice) || 0;
    const dist    = parseFloat(discount)      || 0;
    const current = parseFloat((orig - orig * dist / 100).toFixed(2));

    try {
      // Use new upload, existing prefill URL, or default placeholder
      let finalImageUrl = imageUrl ||
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=400&auto=format&fit=crop';
      if (imageFile) finalImageUrl = await uploadImageFile(imageFile);

      // Get retailer's stored location
      const sessionRes  = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      let retailerLat = 12.9716; // Bangalore default
      let retailerLng = 77.5946;

      if (sessionData?.retailer?.location) {
        const loc = sessionData.retailer.location;
        if (loc.coordinates) { retailerLng = loc.coordinates[0]; retailerLat = loc.coordinates[1]; }
      } else if (navigator.geolocation) {
        await new Promise<void>(resolve => {
          navigator.geolocation.getCurrentPosition(
            pos => { retailerLat = pos.coords.latitude; retailerLng = pos.coords.longitude; resolve(); },
            () => resolve(),
            { timeout: 3000 }
          );
        });
      }

      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name:     productName,
          description:      description || `Exclusive local deal on ${productName}`,
          category:         category || 'general',
          original_price:   orig,
          current_price:    current,
          discount_percent: dist,
          quantity_total:   parseInt(quantity) || 10,
          expiry_hours:     expiryHours,
          lat:              retailerLat,
          lng:              retailerLng,
          image_url:        finalImageUrl,
          is_flash_mob:     false,
        }),
      });

      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to create deal'); }
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto">

      {/* 'From Item' banner */}
      {fromItem && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3">
          <Package size={18} className="text-primary" />
          <span className="font-bold text-primary text-sm">
            Pre-filled from your item catalog.
          </span>
          <Link href="/items" className="ml-auto text-[12px] font-black text-primary hover:underline">
            ← Back to items
          </Link>
        </div>
      )}

      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#a33700] to-[var(--color-primary-fixed)] rounded-[1.5rem] p-8 text-white shadow-xl shadow-orange-900/10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
            <Rocket size={200} fill="currentColor" />
          </div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Pulse Engine Active
          </span>
          <h2 className="text-3xl font-black mb-3">Drive Instant Foot Traffic</h2>
          <p className="text-orange-50 font-medium text-lg leading-relaxed max-w-lg">
            Flash deals appear at the top of local users&apos; feeds. High urgency leads to 4x higher conversion rates.
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-[1.5rem] p-8 text-white shadow-xl shadow-yellow-900/10 relative overflow-hidden flex flex-col justify-between">
          <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest bg-yellow-900/20 px-2 py-1 rounded">
            Live Analytics
          </span>
          <div className="mt-8">
            <div className="flex items-start gap-1">
              <div className="opacity-80"><Rocket size={32} /></div>
              <h2 className="text-6xl font-black tracking-tighter">84<span className="text-4xl">%</span></h2>
            </div>
            <p className="font-bold text-yellow-900 leading-tight mt-2">Average claim rate for<br />flash deals today</p>
          </div>
        </div>
      </div>

      {/* Main Configuration Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Deal Configuration</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Fields marked with * are required to publish.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Product name */}
          <div className="md:col-span-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              required
              placeholder="e.g. Masala Dosa Combo"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Category */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all capitalize"
            >
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-12">
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe this deal briefly…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Price */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Original Price *</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-400 font-black">₹</span>
              <input
                type="number"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                required
                placeholder="200"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Discount */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Discount *</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                required
                placeholder="25"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <span className="absolute right-4 text-gray-400 font-black">%</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Quantity *</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                placeholder="50"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-16 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <span className="absolute right-4 text-gray-500 font-bold text-sm">Units</span>
            </div>
          </div>
        </div>

        {/* Expiry */}
        <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-100/80">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#b31b25] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Expiry Time &amp; Urgency</h4>
              <p className="text-sm text-gray-500 font-medium">When should this flash deal disappear?</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { label: '15 Minutes', val: 0.25 },
              { label: '30 Minutes', val: 0.5 },
              { label: '1 Hour (Recommended)', val: 1 },
              { label: '3 Hours', val: 3 },
            ].map(({ label, val }) => (
              <button
                key={val}
                type="button"
                onClick={() => setExpiryHours(val)}
                className={`font-bold px-6 py-3 rounded-full transition-all text-sm shadow-sm ${
                  expiryHours === val
                    ? 'bg-[#b31b25] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="bg-red-50 text-[#b31b25] px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} />
            Flash deals cannot exceed 4 hours. Shorter durations get higher placement in the feed.
          </div>
        </div>

        {/* Image upload */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-gray-400" />
            Deal Visual
            {(imageFile || imageUrl) && <span className="text-xs text-emerald-600 font-bold ml-1">✓ Image ready</span>}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }}
          />

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 bg-gray-50 group">
              <img src={imagePreview} alt="Deal preview" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-50">
                  Change Image
                </button>
                <button type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); setImageUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="bg-red-500 text-white p-2 rounded-xl shadow-lg hover:bg-red-600">
                  <X size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                Ready
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-primary/40 transition-all group"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-4 group-hover:scale-110 group-hover:text-primary transition-all">
                <UploadCloud size={24} />
              </div>
              <p className="font-bold text-gray-700 mb-1">Drag and drop or click to upload</p>
              <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">JPG, PNG or WebP · Max 5MB</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            disabled={isLoading || isUploading}
            type="submit"
            className={`w-full bg-gradient-to-r from-[#a33700] to-orange-500 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-orange-900/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 ${isLoading || isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <Rocket size={24} fill="currentColor" className="opacity-80" />
            {isUploading ? 'Uploading image…' : isLoading ? 'Publishing…' : 'Publish Flash Deal'}
          </button>
          <p className="text-xs text-gray-500 font-medium mt-4">By publishing, you agree to fulfil all claimed vouchers within 24 hours.</p>
        </div>
      </form>

      {/* Footer tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4"><Lightbulb size={20} /></div>
          <h4 className="font-bold text-gray-900 mb-2">Pro Tip: 40/40 Rule</h4>
          <p className="text-sm text-gray-500 leading-relaxed">Deals with 40% discount and 40 units available perform best for lunchtime surges.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-primary flex items-center justify-center mb-4"><Share2 size={20} /></div>
          <h4 className="font-bold text-gray-900 mb-2">Auto-Broadcasting</h4>
          <p className="text-sm text-gray-500 leading-relaxed">Pulse automatically pings the top 500 loyal customers nearby when you launch.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4"><Eye size={20} /></div>
          <h4 className="font-bold text-gray-900 mb-2">Live Preview</h4>
          <p className="text-sm text-gray-500 leading-relaxed">Click any field to see how your deal looks on the customer-facing Pulse mobile app.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── page export (wraps form in Suspense for useSearchParams) ─── */
export default function CreateDealPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <CreateDealForm />
    </Suspense>
  );
}
