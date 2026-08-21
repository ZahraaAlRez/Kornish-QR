import { createBrowserClient } from "@/lib/supabase/client";
import type { Category, MenuItem, CafeSettings } from "@/lib/supabase/types";
import CustomerApp from "@/components/customer/CustomerApp";

// Without this, Next's fetch Data Cache can serve a stale snapshot of the
// menu/settings indefinitely (customers ordering items the admin already
// removed, seeing edits that never arrive) — every admin page already opts
// out the same way, this one just needs it more.
export const dynamic = "force-dynamic";

const FALLBACK_SETTINGS: CafeSettings = {
  id: 1,
  cafe_name: "Sultana Restocafe",
  logo_url: "/brand/sultana-logo-full-light.png",
  main_picture_url: null,
  whatsapp_number: null,
  external_system_webhook_url: null,
  external_system_api_key: null,
  brand_colors: { primary: "#1F2B45", accent: "#C8A66A", secondary: "#F4EBDD" },
  admin_password_hash: null,
  admin_recovery_email: null,
  admin_reset_token: null,
  admin_reset_token_expires_at: null,
  updated_at: new Date().toISOString(),
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: { table?: string };
}) {
  let categories: Category[] = [];
  let menuItems: MenuItem[] = [];
  let cafeSettings: CafeSettings = FALLBACK_SETTINGS;
  let configured = true;

  try {
    const supabase = createBrowserClient();
    const [categoriesRes, menuItemsRes, settingsRes] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").eq("available", true).order("sort_order"),
      supabase.from("cafe_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    categories = categoriesRes.data ?? [];
    menuItems = menuItemsRes.data ?? [];
    cafeSettings = settingsRes.data ?? FALLBACK_SETTINGS;
  } catch {
    configured = false;
  }

  if (!configured) {
    return <SupabaseNotConfigured />;
  }

  return (
    <CustomerApp
      categories={categories}
      menuItems={menuItems}
      cafeSettings={cafeSettings}
      initialTableNumber={searchParams?.table}
    />
  );
}

function SupabaseNotConfigured() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream p-8 text-center text-navy">
      <h1 className="font-serif text-2xl italic">Almost there</h1>
      <p className="max-w-sm text-sm text-navy/70">
        This app needs a Supabase project connected before it can show the menu. Copy{" "}
        <code className="rounded bg-navy/10 px-1">.env.local.example</code> to{" "}
        <code className="rounded bg-navy/10 px-1">.env.local</code>, fill in your project&apos;s keys, run the
        migrations in <code className="rounded bg-navy/10 px-1">supabase/</code>, then restart the dev server. See
        README.md for the full steps.
      </p>
    </div>
  );
}
