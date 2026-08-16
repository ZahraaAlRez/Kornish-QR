// TEMPORARY — visual QA fixture, not part of the app. Renders CustomerApp
// with hardcoded data (mirrors supabase/seed.sql) so the UI can be
// screenshot-tested without a live Supabase project. Delete before ship.
import CustomerApp from "@/components/customer/CustomerApp";
import type { Category, MenuItem, CafeSettings } from "@/lib/supabase/types";

const categories: Category[] = [
  { id: "cat-hot", name: "Hot Drinks", animation_key: "hot-drinks", sort_order: 1, created_at: "" },
  { id: "cat-cold", name: "Cold Drinks", animation_key: "cold-drinks", sort_order: 2, created_at: "" },
  { id: "cat-sandwiches", name: "Sandwiches", animation_key: "sandwiches", sort_order: 3, created_at: "" },
  { id: "cat-desserts", name: "Desserts", animation_key: "desserts", sort_order: 4, created_at: "" },
];

const menuItems: MenuItem[] = [
  { id: "item-1", name: "Cardamom Latte", description: "Espresso, steamed milk, a pinch of cardamom", price: 3.5, category_id: "cat-hot", photo_url: null, available: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "item-2", name: "Turkish Coffee", description: "Traditional slow-brewed coffee", price: 2.75, category_id: "cat-hot", photo_url: null, available: true, sort_order: 2, created_at: "", updated_at: "" },
  { id: "item-3", name: "Iced Cold Brew", description: "Slow-steeped cold brew over ice", price: 3.75, category_id: "cat-cold", photo_url: null, available: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "item-4", name: "Halloumi Sandwich", description: "Grilled halloumi, tomato, pickles, olive bread", price: 5.25, category_id: "cat-sandwiches", photo_url: null, available: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "item-5", name: "Chocolate Crepe", description: "Warm crepe, chocolate chips, strawberries", price: 4.5, category_id: "cat-desserts", photo_url: null, available: true, sort_order: 1, created_at: "", updated_at: "" },
];

const cafeSettings: CafeSettings = {
  id: 1,
  cafe_name: "Cardamom Café",
  logo_url: "/brand/logo.svg",
  main_picture_url: "/brand/main-pic-placeholder.svg",
  whatsapp_number: null,
  external_system_webhook_url: null,
  external_system_api_key: null,
  brand_colors: { primary: "#2B1B12", accent: "#B8862E", secondary: "#F3ECDC" },
  updated_at: "",
};

export default function PreviewPage() {
  return <CustomerApp categories={categories} menuItems={menuItems} cafeSettings={cafeSettings} initialTableNumber="4" />;
}
