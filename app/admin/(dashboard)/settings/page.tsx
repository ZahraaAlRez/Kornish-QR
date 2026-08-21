import { createServiceClient } from "@/lib/supabase/server";
import type { CafeSettings } from "@/lib/supabase/types";
import SettingsForm from "@/components/admin/SettingsForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import QrGenerator from "@/components/admin/QrGenerator";

export const dynamic = "force-dynamic";

const FALLBACK_SETTINGS: CafeSettings = {
  id: 1,
  cafe_name: "Sultana Restocafe",
  logo_url: "/brand/sultana-logo-full-light.png",
  main_picture_url: null,
  whatsapp_number: null,
  external_system_webhook_url: null,
  external_system_api_key: null,
  brand_colors: { primary: "#1F2B45", accent: "#C9A876", secondary: "#E5D7C3" },
  admin_password_hash: null,
  admin_recovery_email: null,
  admin_reset_token: null,
  admin_reset_token_expires_at: null,
  updated_at: new Date().toISOString(),
};

export default async function AdminSettingsPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from("cafe_settings").select("*").eq("id", 1).maybeSingle();
  const settings = data ?? FALLBACK_SETTINGS;

  return (
    <div className="space-y-6">
      <SettingsForm settings={settings} />
      <ChangePasswordForm />
      <QrGenerator />
    </div>
  );
}
