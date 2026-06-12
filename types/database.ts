// Substitua todo o conteúdo do arquivo por isto.
// Mudança principal: Preços agora são tipados como 'number' e faremos o parse no fetch.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string | null; full_name: string | null; avatar_url: string | null; email: string | null; updated_at: string | null }
        Insert: { id: string; username?: string | null; full_name?: string | null; avatar_url?: string | null; email?: string | null; updated_at?: string | null }
        Update: { id?: string; username?: string | null; full_name?: string | null; avatar_url?: string | null; email?: string | null; updated_at?: string | null }
      }
      user_preferences: {
        Row: { user_id: string; favorite_platforms: string[]; favorite_stores: string[]; notification_settings: Json; updated_at: string | null }
        Insert: { user_id: string; favorite_platforms?: string[]; favorite_stores?: string[]; notification_settings?: Json; updated_at?: string | null }
        Update: { user_id?: string; favorite_platforms?: string[]; favorite_stores?: string[]; notification_settings?: Json; updated_at?: string | null }
      }
      products: {
        Row: { id: string; title: string; slug: string; image_url: string | null; platform: string; created_at: string | null; updated_at: string | null }
        Insert: { id?: string; title: string; slug: string; image_url?: string | null; platform: string; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; title?: string; slug?: string; image_url?: string | null; platform?: string; created_at?: string | null; updated_at?: string | null }
      }
      product_listings: {
        // CORREÇÃO: Supabase retorna 'numeric' como string. Tipamos como 'number' 
        // e fazemos o cast no momento do fetch para evitar toFixed() crashes.
        Row: { id: string; product_id: string; store: string; platform: string; url: string | null; current_price: number; original_price: number; discount_percent: number; is_lowest_price: boolean | null; is_new_offer: boolean | null; updated_at: string | null }
        Insert: { id?: string; product_id: string; store: string; platform: string; url?: string | null; current_price: number | string; original_price: number | string; discount_percent?: number; is_lowest_price?: boolean | null; is_new_offer?: boolean | null; updated_at?: string | null }
        Update: { id?: string; product_id?: string; store?: string; platform?: string; url?: string | null; current_price?: number | string; original_price?: number | string; discount_percent?: number; is_lowest_price?: boolean | null; is_new_offer?: boolean | null; updated_at?: string | null }
      }
      price_history: {
        Row: { id: string; listing_id: string; price: number; recorded_at: string | null }
        Insert: { id?: string; listing_id: string; price: number | string; recorded_at?: string | null }
        Update: { id?: string; listing_id?: string; price?: number | string; recorded_at?: string | null }
      }
      wishlists: {
        Row: { id: string; user_id: string; product_id: string; added_at: string | null }
        Insert: { id?: string; user_id: string; product_id: string; added_at?: string | null }
        Update: { id?: string; user_id?: string; product_id?: string; added_at?: string | null }
      }
      price_alerts: {
        Row: { id: string; user_id: string; product_id: string; target_price: number; is_active: boolean | null; created_at: string | null }
        Insert: { id?: string; user_id: string; product_id: string; target_price: number | string; is_active?: boolean | null; created_at?: string | null }
        Update: { id?: string; user_id?: string; product_id?: string; target_price?: number | string; is_active?: boolean | null; created_at?: string | null }
      }
      linked_accounts: {
        Row: { id: string; user_id: string; platform: string; platform_user_id: string | null; access_token: string | null; connected: boolean | null; connected_at: string | null }
        Insert: { id?: string; user_id: string; platform: string; platform_user_id?: string | null; access_token?: string | null; connected?: boolean | null; connected_at?: string | null }
        Update: { id?: string; user_id?: string; platform?: string; platform_user_id?: string | null; access_token?: string | null; connected?: boolean | null; connected_at?: string | null }
      }
      notifications: {
        Row: { id: string; user_id: string; listing_id: string | null; type: string; message: string; is_read: boolean | null; created_at: string | null }
        Insert: { id?: string; user_id: string; listing_id?: string | null; type: string; message: string; is_read?: boolean | null; created_at?: string | null }
        Update: { id?: string; user_id?: string; listing_id?: string | null; type?: string; message?: string; is_read?: boolean | null; created_at?: string | null }
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
  }
}