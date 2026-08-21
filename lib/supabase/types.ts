export type OrderType = "dine_in" | "delivery";
export type OrderStatus = "new" | "preparing" | "done";

// Row shapes are `type` aliases rather than `interface`s on purpose: an
// `interface` doesn't get TypeScript's implicit index signature, so it
// fails the `Row extends Record<string, unknown>` constraint that
// @supabase/supabase-js's generic Database typing relies on — silently
// collapsing every table's Insert/Update type to `never`.
export type Category = {
  id: string;
  name_en: string;
  name_ar: string | null;
  photo_url: string | null;
  sort_order: number;
  created_at: string;
};

export type MenuItem = {
  id: string;
  name_en: string;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  price: number;
  category_id: string;
  photo_url: string | null;
  available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  created_at: string;
  order_type: OrderType;
  table_number: string | null;
  customer_name: string | null;
  phone: string | null;
  delivery_address: string | null;
  delivery_location_url: string | null;
  total: number;
  status: OrderStatus;
  whatsapp_sent: boolean;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  price: number;
  quantity: number;
  notes: string | null;
};

export type BrandColors = {
  primary: string;
  accent: string;
  secondary: string;
};

export type CafeSettings = {
  id: number;
  cafe_name: string;
  logo_url: string | null;
  main_picture_url: string | null;
  whatsapp_number: string | null;
  external_system_webhook_url: string | null;
  external_system_api_key: string | null;
  brand_colors: BrandColors;
  admin_password_hash: string | null;
  admin_recovery_email: string | null;
  admin_reset_token: string | null;
  admin_reset_token_expires_at: string | null;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Partial<Category>;
        Update: Partial<Category>;
        Relationships: [];
      };
      menu_items: {
        Row: MenuItem;
        Insert: Partial<MenuItem>;
        Update: Partial<MenuItem>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Partial<Order>;
        Update: Partial<Order>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Partial<OrderItem>;
        Update: Partial<OrderItem>;
        Relationships: [];
      };
      cafe_settings: {
        Row: CafeSettings;
        Insert: Partial<CafeSettings>;
        Update: Partial<CafeSettings>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
