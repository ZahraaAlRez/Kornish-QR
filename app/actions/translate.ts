"use server";

/**
 * Free, keyless machine translation (MyMemory) for the admin's "auto-fill
 * the other language" buttons on menu item/category names and descriptions.
 * This only ever assists a manual field the admin can still edit before
 * saving — never a silent overwrite of customer-facing content — so
 * occasional imperfect phrasing from a free API is an acceptable trade for
 * not requiring every admin to write both languages by hand.
 */
export async function translateText(text: string, from: "en" | "ar", to: "en" | "ar"): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const params = new URLSearchParams({ q: trimmed, langpair: `${from}|${to}` });
  const res = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Translation request failed");

  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (typeof translated !== "string" || !translated) throw new Error("Translation response was empty");

  return translated;
}
