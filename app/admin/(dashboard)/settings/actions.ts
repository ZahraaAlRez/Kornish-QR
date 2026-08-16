"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

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

export async function saveSettings(formData: FormData) {
  const supabase = createServiceClient();

  const logo = formData.get("logo");
  const mainPicture = formData.get("mainPicture");

  const row: Record<string, unknown> = {
    cafe_name: String(formData.get("cafeName") ?? ""),
    whatsapp_number: String(formData.get("whatsappNumber") ?? "") || null,
    external_system_webhook_url: String(formData.get("webhookUrl") ?? "") || null,
    external_system_api_key: String(formData.get("apiKey") ?? "") || null,
    brand_colors: {
      primary: String(formData.get("primaryColor") ?? "#2B1B12"),
      accent: String(formData.get("accentColor") ?? "#B8862E"),
      secondary: String(formData.get("secondaryColor") ?? "#F3ECDC"),
    },
    updated_at: new Date().toISOString(),
  };

  if (logo instanceof File && logo.size > 0) {
    row.logo_url = await uploadImage(supabase, logo, "logo");
  }
  if (mainPicture instanceof File && mainPicture.size > 0) {
    row.main_picture_url = await uploadImage(supabase, mainPicture, "main-picture");
  }

  const { error } = await supabase.from("cafe_settings").upsert({ id: 1, ...row });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
