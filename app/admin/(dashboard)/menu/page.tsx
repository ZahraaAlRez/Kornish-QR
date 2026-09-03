import { createServiceClient } from "@/lib/supabase/server";
import MenuManager from "@/components/admin/MenuManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const supabase = createServiceClient();
  const [{ data: categories }, { data: menuItems }, { data: settings }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
    supabase.from("cafe_settings").select("usd_to_lbp_rate").eq("id", 1).maybeSingle(),
  ]);

  const usdToLbpRate =
    settings?.usd_to_lbp_rate && Number.isFinite(settings.usd_to_lbp_rate) && settings.usd_to_lbp_rate > 0
      ? settings.usd_to_lbp_rate
      : 90000;

  return <MenuManager categories={categories ?? []} menuItems={menuItems ?? []} usdToLbpRate={usdToLbpRate} />;
}
