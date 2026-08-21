"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { hashPassword, verifyPasswordHash } from "@/lib/passwordHash";
import { checkAdminPassword } from "@/lib/auth";

async function uploadImage(
  supabase: ReturnType<typeof createServiceClient>,
  file: File,
  folder: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("photos").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
}

export async function saveSettings(formData: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const recoveryEmail = String(formData.get("recoveryEmail") ?? "").trim();
  // Required: it's the only way the forgot-password flow can reach the admin,
  // so an installation with no recovery email on file has no recovery path.
  if (!recoveryEmail) {
    return { ok: false, error: "recoveryEmail" };
  }

  const supabase = createServiceClient();
  const logo = formData.get("logo");

  const row: Record<string, unknown> = {
    cafe_name: String(formData.get("cafeName") ?? ""),
    whatsapp_number: String(formData.get("whatsappNumber") ?? "") || null,
    external_system_webhook_url: String(formData.get("webhookUrl") ?? "") || null,
    external_system_api_key: String(formData.get("apiKey") ?? "") || null,
    admin_recovery_email: recoveryEmail,
    brand_colors: {
      primary: String(formData.get("primaryColor") ?? "#1F2B45"),
      accent: String(formData.get("accentColor") ?? "#C9A876"),
      secondary: String(formData.get("secondaryColor") ?? "#E5D7C3"),
    },
    updated_at: new Date().toISOString(),
  };

  if (logo instanceof File && logo.size > 0) {
    row.logo_url = await uploadImage(supabase, logo, "logo");
  }

  const { error } = await supabase.from("cafe_settings").upsert({ id: 1, ...row });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true };
}

export async function changePassword(
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  const supabase = createServiceClient();
  const { data: settings } = await supabase
    .from("cafe_settings")
    .select("admin_password_hash")
    .eq("id", 1)
    .maybeSingle();

  const currentIsValid = settings?.admin_password_hash
    ? await verifyPasswordHash(currentPassword, settings.admin_password_hash)
    : checkAdminPassword(currentPassword);

  if (!currentIsValid) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const hash = await hashPassword(newPassword);
  const { error } = await supabase.from("cafe_settings").update({ admin_password_hash: hash }).eq("id", 1);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/settings");
  return { ok: true };
}
