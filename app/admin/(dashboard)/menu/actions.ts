"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

export async function saveMenuItem(formData: FormData) {
  const supabase = createServiceClient();
  const id = String(formData.get("id") ?? "") || undefined;
  const photo = formData.get("photo");
  let photoUrl: string | undefined;

  if (photo instanceof File && photo.size > 0) {
    const ext = photo.name.split(".").pop() || "jpg";
    const path = `menu-items/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("photos").upload(path, photo, {
      contentType: photo.type,
      upsert: false,
    });
    if (uploadError) throw new Error(uploadError.message);
    photoUrl = supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  const row = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    price: Number(formData.get("price") ?? 0),
    category_id: String(formData.get("categoryId") ?? ""),
    available: formData.get("available") === "on",
    sort_order: Number(formData.get("sortOrder") ?? 0),
    updated_at: new Date().toISOString(),
    ...(photoUrl ? { photo_url: photoUrl } : {}),
  };

  if (id) {
    const { error } = await supabase.from("menu_items").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("menu_items").insert(row);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function deleteMenuItem(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function toggleAvailability(id: string, available: boolean) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("menu_items").update({ available }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function saveCategory(formData: FormData) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("categories").insert({
    name: String(formData.get("name") ?? ""),
    animation_key: String(formData.get("animationKey") ?? ""),
    sort_order: Number(formData.get("sortOrder") ?? 0),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/");
}
