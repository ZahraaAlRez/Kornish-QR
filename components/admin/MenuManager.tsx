"use client";

import { useState } from "react";
import type { Category, MenuItem } from "@/lib/supabase/types";
import { getItemPhoto } from "@/lib/categoryVisuals";
import { saveMenuItem, deleteMenuItem, toggleAvailability, saveCategory, deleteCategory } from "@/app/admin/(dashboard)/menu/actions";

const ANIMATION_KEYS = ["hot-drinks", "cold-drinks", "sandwiches", "desserts"];

interface Props {
  categories: Category[];
  menuItems: MenuItem[];
}

export default function MenuManager({ categories, menuItems }: Props) {
  const [editingItem, setEditingItem] = useState<MenuItem | "new" | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl italic">Menu</h2>
        <button
          onClick={() => setEditingItem("new")}
          className="rounded-full bg-espresso px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream"
        >
          + Add item
        </button>
      </div>

      {categories.map((category) => {
        const items = menuItems.filter((item) => item.category_id === category.id);
        return (
          <section key={category.id}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-espresso-light">{category.name}</h3>
              <form action={deleteCategory.bind(null, category.id)}>
                <button className="text-xs text-espresso-light underline">Delete category</button>
              </form>
            </div>
            <div className="space-y-2">
              {items.length === 0 && <p className="text-xs text-espresso-light">No items yet.</p>}
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getItemPhoto(item.photo_url, category.animation_key)}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gold">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => toggleAvailability(item.id, !item.available)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.available ? "bg-olive/20 text-olive" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.available ? "Available" : "Sold out"}
                  </button>
                  <button onClick={() => setEditingItem(item)} className="text-xs text-espresso-light underline">
                    Edit
                  </button>
                  <form action={deleteMenuItem.bind(null, item.id)}>
                    <button className="text-xs text-red-600 underline">Delete</button>
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
          <input name="name" required placeholder="Category name" className="w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
          <select name="animationKey" className="w-full rounded-lg border border-gold-light/40 p-2 text-sm">
            {ANIMATION_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <input type="hidden" name="sortOrder" value={categories.length + 1} />
          <div className="flex gap-2">
            <button className="flex-1 rounded-full bg-espresso py-2 text-xs font-semibold uppercase text-cream">Save</button>
            <button type="button" onClick={() => setAddingCategory(false)} className="flex-1 rounded-full border border-gold py-2 text-xs font-semibold uppercase text-gold">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAddingCategory(true)} className="text-sm text-gold underline">
          + Add category
        </button>
      )}

      {editingItem && (
        <ItemFormModal
          item={editingItem === "new" ? null : editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
        />
      )}
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
  return (
    <div className="fixed inset-0 z-30 flex items-end bg-espresso/60 sm:items-center sm:justify-center" onClick={onClose}>
      <form
        action={async (formData) => {
          await saveMenuItem(formData);
          onClose();
        }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 sm:max-w-sm sm:rounded-3xl"
      >
        <h3 className="mb-4 font-serif text-lg italic">{item ? "Edit item" : "Add item"}</h3>
        {item && <input type="hidden" name="id" value={item.id} />}

        <div className="space-y-3">
          <input name="name" required defaultValue={item?.name} placeholder="Name" className="w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
          <textarea name="description" defaultValue={item?.description ?? ""} placeholder="Description" rows={2} className="w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
          <input name="price" type="number" step="0.01" required defaultValue={item?.price} placeholder="Price" className="w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
          <select name="categoryId" required defaultValue={item?.category_id ?? categories[0]?.id} className="w-full rounded-lg border border-gold-light/40 p-2 text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input type="file" name="photo" accept="image/*" className="w-full text-sm" />
          <input type="hidden" name="sortOrder" value={item?.sort_order ?? 0} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="available" defaultChecked={item?.available ?? true} />
            Available
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-full bg-espresso py-2 text-xs font-semibold uppercase text-cream">Save</button>
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-gold py-2 text-xs font-semibold uppercase text-gold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
