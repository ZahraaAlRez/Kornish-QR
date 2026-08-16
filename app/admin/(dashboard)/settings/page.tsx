import { createServiceClient } from "@/lib/supabase/server";
import type { CafeSettings } from "@/lib/supabase/types";
import SettingsForm from "@/components/admin/SettingsForm";
import QrGenerator from "@/components/admin/QrGenerator";

export const dynamic = "force-dynamic";

const FALLBACK_SETTINGS: CafeSettings = {
  id: 1,
  cafe_name: "Cardamom Café",
  logo_url: "/brand/logo.svg",
  main_picture_url: "/brand/main-pic-placeholder.svg",
  whatsapp_number: null,
  external_system_webhook_url: null,
  external_system_api_key: null,
  brand_colors: { primary: "#2B1B12", accent: "#B8862E", secondary: "#F3ECDC" },
  updated_at: new Date().toISOString(),
};

export default async function AdminSettingsPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from("cafe_settings").select("*").eq("id", 1).maybeSingle();
  const settings = data ?? FALLBACK_SETTINGS;

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl italic">Settings</h2>
      <SettingsForm settings={settings} />
      <QrGenerator />
    </div>
  );
}
