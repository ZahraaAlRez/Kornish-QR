import { createServiceClient } from "@/lib/supabase/server";
import MenuManager from "@/components/admin/MenuManager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const supabase = createServiceClient();
  const [{ data: categories }, { data: menuItems }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ]);

  return <MenuManager categories={categories ?? []} menuItems={menuItems ?? []} />;
}
