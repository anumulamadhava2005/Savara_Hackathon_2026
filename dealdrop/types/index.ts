export type DealCategory = 'grocery' | 'bakery' | 'dairy' | 'produce' | 'general';
export type DealStatus = 'active' | 'expired' | 'sold_out' | 'cancelled';
export type SquadStatus = 'forming' | 'complete' | 'expired';
export type PassportLevel = 'newcomer' | 'explorer' | 'hunter' | 'hero';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Retailer {
  id: string;
  user_id: string;
  shop_name: string;
  description?: string;
  location: GeoPoint;
  address: string;
  category: DealCategory;
  rating: number;
  total_ratings: number;
  fulfillment_rate: number;
  response_time_mins: number;
  is_verified: boolean;
  avatar_url?: string;
  trust_score?: number; // computed
  created_at: string;
}

export interface Deal {
  id: string;
  retailer_id: string;
  retailer?: Retailer;
  product_name: string;
  description?: string;
  category: DealCategory;
  original_price: number;
  current_price: number;
  discount_percent: number;
  quantity_total: number;
  quantity_remaining: number;
  expiry_time: string;
  location: GeoPoint;
  image_url?: string;
  status: DealStatus;
  is_flash_mob: boolean;
  flash_mob_target?: number;
  flash_mob_discount?: number;
  distance_km?: number; // computed from user location
  walk_time_mins?: number; // computed
  urgency_level?: 'low' | 'medium' | 'high' | 'critical'; // computed
  created_at: string;
  updated_at: string;
}

export interface Squad {
  id: string;
  deal_id: string;
  target_count: number;
  current_count: number;
  status: SquadStatus;
  expires_at: string;
  created_at: string;
  members?: SquadMember[];
}

export interface SquadMember {
  id: string;
  squad_id: string;
  user_id: string;
  joined_at: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  location?: GeoPoint;
  preferred_radius_km: number;
  preferred_categories: DealCategory[];
  deal_passport_stamps: number;
  passport_level: PassportLevel;
  created_at: string;
}

export interface Claim {
  id: string;
  deal_id: string;
  user_id: string;
  claimed_at: string;
  status: 'claimed' | 'fulfilled' | 'cancelled';
  squad_id?: string;
}

export interface DealPulseEvent {
  type: 'claim' | 'new_deal' | 'squad_join';
  message: string;
  timestamp: string;
  distance_m?: number;
}

export interface VoiceParsedDeal {
  product_name: string;
  quantity_total: number;
  expiry_hours: number;
  suggested_discount: number;
  category: DealCategory;
  description: string;
}

export interface PricingSuggestion {
  suggested_discount: number;
  suggested_price: number;
  reasoning: string;
  urgency_tier: 'low' | 'medium' | 'high' | 'critical';
}
