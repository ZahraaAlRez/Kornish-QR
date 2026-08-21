"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

async function uploadPhoto(supabase: ReturnType<typeof createServiceClient>, file: File, folder: string) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("photos").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
}

/** Recovers the storage object path from a public URL previously returned by `uploadPhoto`. */
function storagePathFromPublicUrl(url: string): string | null {
  const marker = "/object/public/photos/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

/** Best-effort cleanup — a failed delete here shouldn't block the save that triggered it. */
async function deleteStoredPhoto(supabase: ReturnType<typeof createServiceClient>, url: string | null | undefined) {
  if (!url) return;
  const path = storagePathFromPublicUrl(url);
  if (!path) return;
  await supabase.storage.from("photos").remove([path]);
}

export async function saveMenuItem(formData: FormData) {
  const supabase = createServiceClient();
  const id = String(formData.get("id") ?? "") || undefined;
  const photo = formData.get("photo");
  const removePhoto = formData.get("removePhoto") === "1";
  const hasNewPhoto = photo instanceof File && photo.size > 0;

  let oldPhotoUrl: string | null = null;
  if (id && (hasNewPhoto || removePhoto)) {
    const { data: existing } = await supabase.from("menu_items").select("photo_url").eq("id", id).maybeSingle();
    oldPhotoUrl = existing?.photo_url ?? null;
  }

  let photoUrl: string | undefined;
  if (hasNewPhoto) {
    photoUrl = await uploadPhoto(supabase, photo as File, "menu-items");
  }

  const row = {
    name_en: String(formData.get("nameEn") ?? ""),
    name_ar: String(formData.get("nameAr") ?? "") || null,
    description_en: String(formData.get("descriptionEn") ?? "") || null,
    description_ar: String(formData.get("descriptionAr") ?? "") || null,
    price: Number(formData.get("price") ?? 0),
    category_id: String(formData.get("categoryId") ?? ""),
    available: formData.get("available") === "on",
    sort_order: Number(formData.get("sortOrder") ?? 0),
    updated_at: new Date().toISOString(),
    // A new upload always wins; otherwise an explicit removal clears it;
    // otherwise leave the existing photo_url untouched.
    ...(photoUrl ? { photo_url: photoUrl } : removePhoto ? { photo_url: null } : {}),
  };

  if (id) {
    const { error } = await supabase.from("menu_items").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("menu_items").insert(row);
    if (error) throw new Error(error.message);
  }

  // Actually remove the superseded file from storage — not just overwrite
  // the database pointer — so replacing/removing a photo doesn't leave an
  // orphaned object behind.
  if (oldPhotoUrl && (photoUrl || removePhoto)) {
    await deleteStoredPhoto(supabase, oldPhotoUrl);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function deleteMenuItem(id: string) {
  const supabase = createServiceClient();
  const { data: existing } = await supabase.from("menu_items").select("photo_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStoredPhoto(supabase, existing?.photo_url);
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
  const photo = formData.get("photo");
  let photoUrl: string | undefined;

  if (photo instanceof File && photo.size > 0) {
    photoUrl = await uploadPhoto(supabase, photo, "categories");
  }

  const { error } = await supabase.from("categories").insert({
    name_en: String(formData.get("nameEn") ?? ""),
    name_ar: String(formData.get("nameAr") ?? "") || null,
    sort_order: Number(formData.get("sortOrder") ?? 0),
    ...(photoUrl ? { photo_url: photoUrl } : {}),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function updateCategory(formData: FormData) {
  const supabase = createServiceClient();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing category id.");

  const photo = formData.get("photo");
  const removePhoto = formData.get("removePhoto") === "1";
  const hasNewPhoto = photo instanceof File && photo.size > 0;

  let oldPhotoUrl: string | null = null;
  if (hasNewPhoto || removePhoto) {
    const { data: existing } = await supabase.from("categories").select("photo_url").eq("id", id).maybeSingle();
    oldPhotoUrl = existing?.photo_url ?? null;
  }

  let photoUrl: string | undefined;
  if (hasNewPhoto) {
    photoUrl = await uploadPhoto(supabase, photo as File, "categories");
  }

  const row = {
    name_en: String(formData.get("nameEn") ?? ""),
    name_ar: String(formData.get("nameAr") ?? "") || null,
    ...(photoUrl ? { photo_url: photoUrl } : removePhoto ? { photo_url: null } : {}),
  };

  const { error } = await supabase.from("categories").update(row).eq("id", id);
  if (error) throw new Error(error.message);

  if (oldPhotoUrl && (photoUrl || removePhoto)) {
    await deleteStoredPhoto(supabase, oldPhotoUrl);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const supabase = createServiceClient();
  const { data: existing } = await supabase.from("categories").select("photo_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStoredPhoto(supabase, existing?.photo_url);
  revalidatePath("/admin/menu");
  revalidatePath("/");
}
