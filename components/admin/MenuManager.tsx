"use client";

import { useRef, useState } from "react";
import type { Category, MenuItem } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import PhotoTile from "@/components/PhotoTile";
import { translateText } from "@/app/actions/translate";
import {
  saveMenuItem,
  deleteMenuItem,
  toggleAvailability,
  saveCategory,
  updateCategory,
  deleteCategory,
  backfillMissingTranslations,
} from "@/app/admin/(dashboard)/menu/actions";

interface Props {
  categories: Category[];
  menuItems: MenuItem[];
}

export default function MenuManager({ categories, menuItems }: Props) {
  const { t, pick } = useLocale();
  const [editingItem, setEditingItem] = useState<MenuItem | "new" | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryNameEn, setNewCategoryNameEn] = useState("");
  const [newCategoryNameAr, setNewCategoryNameAr] = useState("");
  const [backfilling, setBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<{ items: number; categories: number } | null>(null);

  async function handleBackfill() {
    setBackfilling(true);
    setBackfillResult(null);
    try {
      const result = await backfillMissingTranslations();
      setBackfillResult(result);
    } finally {
      setBackfilling(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl italic text-navy">{t("admin.menu.title")}</h2>
        <button
          onClick={() => setEditingItem("new")}
          className="flex min-h-11 items-center rounded-full bg-gold-gradient px-4 text-xs font-semibold uppercase tracking-wide text-navy"
        >
          {t("admin.menu.addItem")}
        </button>
      </div>

      <div>
        <button
          onClick={handleBackfill}
          disabled={backfilling}
          className="flex min-h-11 items-center rounded-full border border-gold/50 px-4 text-xs font-semibold uppercase tracking-wide text-bronze disabled:opacity-50"
        >
          {backfilling ? t("admin.menu.translateMissingRunning") : t("admin.menu.translateMissing")}
        </button>
        {backfillResult && (
          <p className="mt-1.5 text-xs text-navy/60">
            {backfillResult.items === 0 && backfillResult.categories === 0
              ? pick("Everything already has Arabic.", "كل شيء مترجم بالفعل.")
              : pick(
                  `Translated ${backfillResult.items} item(s) and ${backfillResult.categories} categor${backfillResult.categories === 1 ? "y" : "ies"}.`,
                  `تمت ترجمة ${backfillResult.items} عنصرًا و${backfillResult.categories} قسمًا.`
                )}
          </p>
        )}
      </div>

      {categories.map((category) => {
        const items = menuItems.filter((item) => item.category_id === category.id);
        return (
          <section key={category.id}>
            <div className="mb-2 flex items-center gap-3">
              <PhotoTile src={category.photo_url} alt="" className="h-10 w-10 shrink-0 rounded-lg" sizes="40px" />
              <h3 className="flex-1 text-sm font-semibold uppercase tracking-wide text-navy/70">
                {pick(category.name_en, category.name_ar)}
              </h3>
              <button
                onClick={() => setEditingCategory(category)}
                className="-my-2 flex min-h-11 shrink-0 items-center px-1 text-xs text-navy/60 underline"
              >
                {t("admin.menu.editCategory")}
              </button>
              <form action={deleteCategory.bind(null, category.id)}>
                <button className="-my-2 flex min-h-11 shrink-0 items-center px-1 text-xs text-navy/50 underline">
                  {t("admin.menu.deleteCategory")}
                </button>
              </form>
            </div>
            <div className="space-y-2">
              {items.length === 0 && <p className="text-xs text-navy/50">{t("admin.menu.noItems")}</p>}
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
                  <PhotoTile src={item.photo_url} alt="" className="h-14 w-14 shrink-0 rounded-xl" sizes="56px" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{pick(item.name_en, item.name_ar)}</p>
                    <p className="text-xs text-gold">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => toggleAvailability(item.id, !item.available)}
                    className={`flex min-h-11 shrink-0 items-center rounded-full px-3 text-xs font-medium ${
                      item.available ? "bg-whatsapp/15 text-whatsapp" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.available ? t("admin.menu.available") : t("admin.menu.soldOut")}
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="-my-2 flex min-h-11 shrink-0 items-center px-1 text-xs text-navy/60 underline"
                  >
                    {t("admin.menu.edit")}
                  </button>
                  <form action={deleteMenuItem.bind(null, item.id)}>
                    <button className="-my-2 flex min-h-11 shrink-0 items-center px-1 text-xs text-red-600 underline">
                      {t("admin.menu.delete")}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {addingCategory ? (
        <form
          action={async (formData) => {
            await saveCategory(formData);
            setAddingCategory(false);
            setNewCategoryNameEn("");
            setNewCategoryNameAr("");
          }}
          className="space-y-2 rounded-2xl bg-white p-3 shadow-card"
        >
          <p className="text-xs text-navy/50">{t("admin.menu.arabicOptionalHint")}</p>
          <div className="flex items-center gap-2">
            <input
              name="nameEn"
              required
              value={newCategoryNameEn}
              onChange={(e) => setNewCategoryNameEn(e.target.value)}
              placeholder={t("admin.menu.nameEn")}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => newCategoryNameEn} from="en" to="ar" onResult={setNewCategoryNameAr} />
          </div>
          <div className="flex items-center gap-2">
            <input
              name="nameAr"
              dir="rtl"
              value={newCategoryNameAr}
              onChange={(e) => setNewCategoryNameAr(e.target.value)}
              placeholder={t("admin.menu.nameAr")}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => newCategoryNameAr} from="ar" to="en" onResult={setNewCategoryNameEn} />
          </div>
          <PhotoField label={t("admin.menu.categoryPhoto")} currentUrl={null} />
          <input type="hidden" name="sortOrder" value={categories.length + 1} />
          <div className="flex gap-2">
            <button className="flex-1 rounded-full bg-gold-gradient py-2 min-h-11 text-xs font-semibold uppercase text-navy">
              {t("admin.menu.save")}
            </button>
            <button type="button" onClick={() => setAddingCategory(false)} className="flex-1 rounded-full border border-gold py-2 min-h-11 text-xs font-semibold uppercase text-bronze">
              {t("admin.menu.cancel")}
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAddingCategory(true)} className="-my-2 flex min-h-11 items-center py-2 text-sm text-gold underline">
          {t("admin.menu.addCategory")}
        </button>
      )}

      {editingItem && (
        <ItemFormModal
          item={editingItem === "new" ? null : editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
        />
      )}

      {editingCategory && <CategoryFormModal category={editingCategory} onClose={() => setEditingCategory(null)} />}
    </div>
  );
}

/** Thumbnail of the current photo (if any) with a remove (×) toggle, plus the file picker for a replacement. */
const PHOTO_MAX_EDGE = 1200;

/**
 * Downscales an oversized photo in the browser before it ever leaves the
 * admin's device — a phone-camera photo can easily be 4000-7000px on a
 * side, which decodes to 100+MB in memory once rendered as a small card
 * thumbnail on a customer's phone. This is what was silently crashing real
 * customers' iPhone Safari sessions after scrolling through several such
 * photos (root-caused and the 26 already-live oversized photos fixed
 * directly in storage; this stops new ones from recurring at the source,
 * since neither the upload action nor the customer-facing `<img>` do any
 * resizing of their own). Non-image files or anything already reasonably
 * sized pass through untouched.
 */
async function downscaleIfOversized(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const longEdge = Math.max(bitmap.width, bitmap.height);
  if (longEdge <= PHOTO_MAX_EDGE) {
    bitmap.close();
    return file;
  }

  const scale = PHOTO_MAX_EDGE / longEdge;
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85));
  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

function PhotoField({ label, currentUrl }: { label: string; currentUrl: string | null }) {
  const { t } = useLocale();
  const [removed, setRemoved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await downscaleIfOversized(file);
    if (resized === file) return; // already within bounds, native selection stands as-is
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(resized);
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  }

  return (
    <div>
      <label className="block text-xs font-medium text-navy/70">{label}</label>
      {currentUrl && !removed && (
        <div className="mt-1 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => setRemoved(true)}
            className="flex min-h-11 items-center rounded-full border border-red-200 px-3 text-xs text-red-600"
          >
            × {t("admin.menu.removePhoto")}
          </button>
        </div>
      )}
      <input type="hidden" name="removePhoto" value={removed ? "1" : "0"} />
      <input ref={inputRef} type="file" name="photo" accept="image/*" onChange={handleFileChange} className="mt-1 w-full text-sm" />
    </div>
  );
}

/**
 * Sits between a language pair's two fields — pulls whichever one currently
 * has text, translates it into the other, and fills that field in. The
 * admin can still freely edit the result (or overwrite it by typing) before
 * saving, so a slightly-off machine translation is never the final word.
 */
function TranslateButton({
  getSource,
  from,
  to,
  onResult,
}: {
  getSource: () => string;
  from: "en" | "ar";
  to: "en" | "ar";
  onResult: (text: string) => void;
}) {
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    const source = getSource().trim();
    if (!source || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      const result = await translateText(source, from, to);
      onResult(result);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={to === "ar" ? t("admin.menu.translateToAr") : t("admin.menu.translateToEn")}
      title={failed ? t("admin.menu.translateFailed") : undefined}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm transition disabled:opacity-50 ${
        failed ? "border-red-300 text-red-500" : "border-gold/40 text-bronze hover:bg-gold/10"
      }`}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-bronze/30 border-t-bronze" />
      ) : (
        "⇄"
      )}
    </button>
  );
}

function ItemFormModal({
  item,
  categories,
  onClose,
}: {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
}) {
  const { t, pick } = useLocale();
  // A plain type="number" input renders its digits using the OS/browser's
  // default numbering system (e.g. Arabic-Indic digits on an Arabic-locale
  // machine) regardless of the page's own language — a controlled text
  // input sidesteps that entirely and guarantees plain ASCII digits.
  const [price, setPrice] = useState(item?.price != null ? String(item.price) : "");
  const [nameEn, setNameEn] = useState(item?.name_en ?? "");
  const [nameAr, setNameAr] = useState(item?.name_ar ?? "");
  const [descriptionEn, setDescriptionEn] = useState(item?.description_en ?? "");
  const [descriptionAr, setDescriptionAr] = useState(item?.description_ar ?? "");

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-navy-deep/60 sm:items-center sm:justify-center" onClick={onClose}>
      <form
        action={async (formData) => {
          await saveMenuItem(formData);
          onClose();
        }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 sm:max-w-sm sm:rounded-3xl"
      >
        <h3 className="mb-4 font-serif text-lg italic text-navy">
          {item ? t("admin.menu.editItemTitle") : t("admin.menu.addItemTitle")}
        </h3>
        {item && <input type="hidden" name="id" value={item.id} />}
        <p className="mb-2 text-xs text-navy/50">{t("admin.menu.arabicOptionalHint")}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              name="nameEn"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder={t("admin.menu.nameEn")}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => nameEn} from="en" to="ar" onResult={setNameAr} />
          </div>
          <div className="flex items-center gap-2">
            <input
              name="nameAr"
              dir="rtl"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder={t("admin.menu.nameAr")}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => nameAr} from="ar" to="en" onResult={setNameEn} />
          </div>
          <div className="flex items-center gap-2">
            <textarea
              name="descriptionEn"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder={t("admin.menu.descriptionEn")}
              rows={2}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => descriptionEn} from="en" to="ar" onResult={setDescriptionAr} />
          </div>
          <div className="flex items-center gap-2">
            <textarea
              name="descriptionAr"
              dir="rtl"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder={t("admin.menu.descriptionAr")}
              rows={2}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => descriptionAr} from="ar" to="en" onResult={setDescriptionEn} />
          </div>
          <input
            name="price"
            type="text"
            inputMode="decimal"
            dir="ltr"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder={t("admin.menu.price")}
            className="w-full rounded-lg border border-gold/30 p-2 text-sm"
          />
          <select name="categoryId" required defaultValue={item?.category_id ?? categories[0]?.id} className="w-full rounded-lg border border-gold/30 p-2 text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {pick(c.name_en, c.name_ar)}
              </option>
            ))}
          </select>
          <PhotoField label={t("admin.menu.photo")} currentUrl={item?.photo_url ?? null} />
          <input type="hidden" name="sortOrder" value={item?.sort_order ?? 0} />
          <label className="flex items-center gap-2 text-sm text-navy">
            <input type="checkbox" name="available" defaultChecked={item?.available ?? true} />
            {t("admin.menu.available")}
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-full bg-gold-gradient py-2 min-h-11 text-xs font-semibold uppercase text-navy">
            {t("admin.menu.save")}
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-gold py-2 min-h-11 text-xs font-semibold uppercase text-bronze">
            {t("admin.menu.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}

function CategoryFormModal({ category, onClose }: { category: Category; onClose: () => void }) {
  const { t } = useLocale();
  const [nameEn, setNameEn] = useState(category.name_en);
  const [nameAr, setNameAr] = useState(category.name_ar ?? "");

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-navy-deep/60 sm:items-center sm:justify-center" onClick={onClose}>
      <form
        action={async (formData) => {
          await updateCategory(formData);
          onClose();
        }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 sm:max-w-sm sm:rounded-3xl"
      >
        <h3 className="mb-4 font-serif text-lg italic text-navy">{t("admin.menu.editCategoryTitle")}</h3>
        <input type="hidden" name="id" value={category.id} />
        <p className="mb-2 text-xs text-navy/50">{t("admin.menu.arabicOptionalHint")}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              name="nameEn"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder={t("admin.menu.nameEn")}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => nameEn} from="en" to="ar" onResult={setNameAr} />
          </div>
          <div className="flex items-center gap-2">
            <input
              name="nameAr"
              dir="rtl"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder={t("admin.menu.nameAr")}
              className="w-full flex-1 rounded-lg border border-gold/30 p-2 text-sm"
            />
            <TranslateButton getSource={() => nameAr} from="ar" to="en" onResult={setNameEn} />
          </div>
          <PhotoField label={t("admin.menu.categoryPhoto")} currentUrl={category.photo_url} />
        </div>

        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-full bg-gold-gradient py-2 min-h-11 text-xs font-semibold uppercase text-navy">
            {t("admin.menu.save")}
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-gold py-2 min-h-11 text-xs font-semibold uppercase text-bronze">
            {t("admin.menu.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
