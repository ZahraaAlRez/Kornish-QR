"use client";

import { useState } from "react";
import type { Category, MenuItem } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import PhotoTile from "@/components/PhotoTile";
import {
  saveMenuItem,
  deleteMenuItem,
  toggleAvailability,
  saveCategory,
  updateCategory,
  deleteCategory,
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

      {categories.map((category) => {
        const items = menuItems.filter((item) => item.category_id === category.id);
        return (
          <section key={category.id}>
            <div className="mb-2 flex items-center gap-3">
              <PhotoTile src={category.photo_url} alt="" className="h-10 w-10 shrink-0 rounded-lg" />
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
                  <PhotoTile src={item.photo_url} alt="" className="h-14 w-14 shrink-0 rounded-xl" />
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
          }}
          className="space-y-2 rounded-2xl bg-white p-3 shadow-card"
        >
          <p className="text-xs text-navy/50">{t("admin.menu.arabicOptionalHint")}</p>
          <input name="nameEn" required placeholder={t("admin.menu.nameEn")} className="w-full rounded-lg border border-gold/30 p-2 text-sm" />
          <input name="nameAr" dir="rtl" placeholder={t("admin.menu.nameAr")} className="w-full rounded-lg border border-gold/30 p-2 text-sm" />
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
function PhotoField({ label, currentUrl }: { label: string; currentUrl: string | null }) {
  const { t } = useLocale();
  const [removed, setRemoved] = useState(false);

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
      <input type="file" name="photo" accept="image/*" className="mt-1 w-full text-sm" />
    </div>
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
          <input name="nameEn" required defaultValue={item?.name_en} placeholder={t("admin.menu.nameEn")} className="w-full rounded-lg border border-gold/30 p-2 text-sm" />
          <input name="nameAr" dir="rtl" defaultValue={item?.name_ar ?? ""} placeholder={t("admin.menu.nameAr")} className="w-full rounded-lg border border-gold/30 p-2 text-sm" />
          <textarea name="descriptionEn" defaultValue={item?.description_en ?? ""} placeholder={t("admin.menu.descriptionEn")} rows={2} className="w-full rounded-lg border border-gold/30 p-2 text-sm" />
          <textarea name="descriptionAr" dir="rtl" defaultValue={item?.description_ar ?? ""} placeholder={t("admin.menu.descriptionAr")} rows={2} className="w-full rounded-lg border border-gold/30 p-2 text-sm" />
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
          <input
            name="nameEn"
            required
            defaultValue={category.name_en}
            placeholder={t("admin.menu.nameEn")}
            className="w-full rounded-lg border border-gold/30 p-2 text-sm"
          />
          <input
            name="nameAr"
            dir="rtl"
            defaultValue={category.name_ar ?? ""}
            placeholder={t("admin.menu.nameAr")}
            className="w-full rounded-lg border border-gold/30 p-2 text-sm"
          />
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
