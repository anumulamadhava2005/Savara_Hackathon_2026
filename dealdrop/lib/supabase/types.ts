// Generated Supabase Database types
// In production, generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
// This is a placeholder type file matching the schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      retailers: {
        Row: {
          id: string;
          user_id: string;
          shop_name: string;
          description: string | null;
          location: unknown;
          address: string;
          category: string;
          rating: number;
          total_ratings: number;
          fulfillment_rate: number;
          response_time_mins: number;
          is_verified: boolean;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_name: string;
          description?: string | null;
          location: unknown;
          address: string;
          category: string;
          rating?: number;
          total_ratings?: number;
          fulfillment_rate?: number;
          response_time_mins?: number;
          is_verified?: boolean;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['retailers']['Insert']>;
      };
      deals: {
        Row: {
          id: string;
          retailer_id: string;
          product_name: string;
          description: string | null;
          category: string;
          original_price: number;
          current_price: number;
          discount_percent: number;
          quantity_total: number;
          quantity_remaining: number;
          expiry_time: string;
          location: unknown;
          image_url: string | null;
          status: string;
          is_flash_mob: boolean;
          flash_mob_target: number | null;
          flash_mob_discount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          retailer_id: string;
          product_name: string;
          description?: string | null;
          category: string;
          original_price: number;
          current_price: number;
          discount_percent: number;
          quantity_total: number;
          quantity_remaining: number;
          expiry_time: string;
          location: unknown;
          image_url?: string | null;
          status?: string;
          is_flash_mob?: boolean;
          flash_mob_target?: number | null;
          flash_mob_discount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['deals']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          location: unknown;
          preferred_radius_km: number;
          preferred_categories: string[];
          deal_passport_stamps: number;
          passport_level: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          location?: unknown;
          preferred_radius_km?: number;
          preferred_categories?: string[];
          deal_passport_stamps?: number;
          passport_level?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      claims: {
        Row: {
          id: string;
          deal_id: string;
          user_id: string;
          claimed_at: string;
          status: string;
          squad_id: string | null;
        };
        Insert: {
          id?: string;
          deal_id: string;
          user_id: string;
          claimed_at?: string;
          status?: string;
          squad_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['claims']['Insert']>;
      };
      squads: {
        Row: {
          id: string;
          deal_id: string;
          target_count: number;
          current_count: number;
          status: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          deal_id: string;
          target_count: number;
          current_count?: number;
          status?: string;
          expires_at: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['squads']['Insert']>;
      };
      squad_members: {
        Row: {
          id: string;
          squad_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          squad_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: Partial<Database['public']['Tables']['squad_members']['Insert']>;
      };
      community_posts: {
        Row: {
          id: string;
          user_name: string;
          avatar: string | null;
          time_display: string;
          location: string | null;
          content: string;
          image: string | null;
          likes: number;
          comments: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          avatar?: string | null;
          time_display?: string;
          location?: string | null;
          content: string;
          image?: string | null;
          likes?: number;
          comments?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>;
      };
    };
    Functions: {
      get_nearby_deals: {
        Args: { user_lat: number; user_lng: number; radius_km?: number };
        Returns: Database['public']['Tables']['deals']['Row'][];
      };
      increment_passport_stamps: {
        Args: { uid: string };
        Returns: void;
      };
    };
  };
}
