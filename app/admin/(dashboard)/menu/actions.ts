"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { translateText } from "@/app/actions/translate";
import type { MenuItem } from "@/lib/supabase/types";

/**
 * Auto-fills a missing Arabic value from its English counterpart so no menu
 * content ever goes out without an Arabic version, whether or not the admin
 * bothered with the manual translate button. Never overwrites an Arabic
 * value the admin actually typed — only steps in when it's blank. Best
 * effort: if the translation service is unreachable, the field is simply
 * left blank rather than blocking the save.
 */
async function autoTranslate(en: string, ar: string | null): Promise<string | null> {
  if (ar) return ar;
  if (!en.trim()) return null;
  try {
    const translated = await translateText(en, "en", "ar");
    return translated || null;
  } catch {
    return null;
  }
}

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

  const nameEn = String(formData.get("nameEn") ?? "");
  const descriptionEn = String(formData.get("descriptionEn") ?? "");

  const row = {
    name_en: nameEn,
    name_ar: await autoTranslate(nameEn, String(formData.get("nameAr") ?? "") || null),
    description_en: descriptionEn || null,
    description_ar: await autoTranslate(descriptionEn, String(formData.get("descriptionAr") ?? "") || null),
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

  const nameEn = String(formData.get("nameEn") ?? "");

  const { error } = await supabase.from("categories").insert({
    name_en: nameEn,
    name_ar: await autoTranslate(nameEn, String(formData.get("nameAr") ?? "") || null),
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

  const nameEn = String(formData.get("nameEn") ?? "");

  const row = {
    name_en: nameEn,
    name_ar: await autoTranslate(nameEn, String(formData.get("nameAr") ?? "") || null),
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

/**
 * One-time (or run-whenever-needed) sweep over content that predates the
 * auto-translate wiring in `saveMenuItem`/`saveCategory`/`updateCategory` —
 * every existing menu item, description, and category missing its Arabic
 * side gets one filled in now, not just new saves going forward. Skips
 * anything that already has Arabic; never overwrites admin-entered text.
 * Returns a count so the admin UI can report what actually changed.
 */
export async function backfillMissingTranslations(): Promise<{ items: number; categories: number }> {
  const supabase = createServiceClient();
  let itemsUpdated = 0;
  let categoriesUpdated = 0;

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("id, name_en, name_ar, description_en, description_ar");
  if (itemsError) throw new Error(itemsError.message);

  for (const item of items ?? []) {
    const needsName = !item.name_ar && item.name_en?.trim();
    const needsDescription = !item.description_ar && item.description_en?.trim();
    if (!needsName && !needsDescription) continue;

    const patch: Partial<Pick<MenuItem, "name_ar" | "description_ar">> = {};
    if (needsName) patch.name_ar = await autoTranslate(item.name_en ?? "", null);
    if (needsDescription) patch.description_ar = await autoTranslate(item.description_en ?? "", null);
    if (!patch.name_ar && !patch.description_ar) continue;

    const { error } = await supabase.from("menu_items").update(patch).eq("id", item.id);
    if (!error) itemsUpdated++;
  }

  const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, name_en, name_ar");
  if (categoriesError) throw new Error(categoriesError.message);

  for (const category of categories ?? []) {
    if (category.name_ar || !category.name_en?.trim()) continue;
    const nameAr = await autoTranslate(category.name_en ?? "", null);
    if (!nameAr) continue;
    const { error } = await supabase.from("categories").update({ name_ar: nameAr }).eq("id", category.id);
    if (!error) categoriesUpdated++;
  }

  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { items: itemsUpdated, categories: categoriesUpdated };
}
