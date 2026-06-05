'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ClaimResult {
  id: string;
  status: string;
  claimed_at: string;
  deal: {
    product_name: string;
    discount_percent: number;
    current_price: number;
    expiry_time: string;
    shop_name: string;
    address: string;
  };
}

export default function PhoneClaimPage() {
  const searchParams = useSearchParams();
  const phoneFromUrl = searchParams.get('phone') ?? '';

  const [phone, setPhone] = useState(phoneFromUrl);
  const [claims, setClaims] = useState<ClaimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Auto-search if phone is in URL
  useEffect(() => {
    if (phoneFromUrl) handleSearch(phoneFromUrl);
  }, [phoneFromUrl]);

  async function handleSearch(phoneNum?: string) {
    const searchPhone = phoneNum ?? phone;
    if (!searchPhone) return;

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const res = await fetch(`/api/claims/by-phone?phone=${encodeURIComponent(searchPhone)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to find claims');
      setClaims(data.claims ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setClaims([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function getTimeLeft(expiryTime: string) {
    const minsLeft = Math.round((new Date(expiryTime).getTime() - Date.now()) / 60000);
    if (minsLeft <= 0) return 'Expired';
    if (minsLeft > 60) return `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m left`;
    return `${minsLeft}m left`;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '24px 16px',
    }}>
      {/* Header */}
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <Link href="/discover" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #a0836e, #d4a574)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🛍️</div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' }}>DealDrop</span>
          </div>
        </Link>

        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          Your Claimed Deals
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 15 }}>
          Enter the phone number you gave DropBot to see your claims.
        </p>

        {/* Phone input */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="+91 98765 43210"
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: 16,
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading || !phone}
            style={{
              padding: '14px 20px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #a0836e, #d4a574)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !phone ? 0.6 : 1,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '...' : 'Find Claims'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            marginBottom: 24,
            fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* No claims */}
        {searched && claims.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ color: '#94a3b8', fontSize: 16, marginBottom: 8 }}>No claims found for this number.</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>
              Did DropBot send you a link? Try browsing live deals instead.
            </div>
            <Link href="/discover">
              <button style={{
                marginTop: 20,
                padding: '12px 24px',
                borderRadius: 10,
                border: '1.5px solid rgba(160,131,110,0.4)',
                background: 'transparent',
                color: '#d4a574',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}>
                Browse Live Deals →
              </button>
            </Link>
          </div>
        )}

        {/* Claims list */}
        {claims.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {claims.map(claim => {
              const timeLeft = getTimeLeft(claim.deal.expiry_time);
              const expired = timeLeft === 'Expired';
              const isRedeemed = claim.status === 'redeemed';

              return (
                <div key={claim.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${isRedeemed ? 'rgba(34,197,94,0.3)' : expired ? 'rgba(239,68,68,0.2)' : 'rgba(160,131,110,0.3)'}`,
                  borderRadius: 16,
                  padding: '20px',
                  transition: 'transform 0.2s',
                }}>
                  {/* Status badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      background: isRedeemed ? 'rgba(34,197,94,0.15)' : expired ? 'rgba(239,68,68,0.12)' : 'rgba(160,131,110,0.15)',
                      color: isRedeemed ? '#4ade80' : expired ? '#f87171' : '#d4a574',
                    }}>
                      {isRedeemed ? '✓ Redeemed' : expired ? '✕ Expired' : '🔥 Active'}
                    </span>
                    {!expired && !isRedeemed && (
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>⏱️ {timeLeft}</span>
                    )}
                  </div>

                  {/* Deal info */}
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
                    {claim.deal.product_name}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span style={{
                      background: 'rgba(160,131,110,0.2)',
                      color: '#d4a574',
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      {claim.deal.discount_percent}% OFF
                    </span>
                    <span style={{ color: '#e2e8f0', fontSize: 14, alignSelf: 'center' }}>
                      ₹{claim.deal.current_price}
                    </span>
                  </div>

                  {/* Store info */}
                  <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>
                    🏪 {claim.deal.shop_name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>
                    📍 {claim.deal.address}
                  </div>

                  {/* Show at store */}
                  {!expired && !isRedeemed && (
                    <Link href={`/claim/${claim.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #a0836e, #d4a574)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: 'pointer',
                      }}>
                        Show at Store →
                      </button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 40, color: '#475569', fontSize: 13 }}>
          Deals are first-come, first-served · Show your claim before it expires
        </div>
      </div>
    </div>
  );
}
