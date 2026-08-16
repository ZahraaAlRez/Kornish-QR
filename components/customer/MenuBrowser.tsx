"use client";

import type { Category, MenuItem } from "@/lib/supabase/types";
import { getItemPhoto } from "@/lib/categoryVisuals";
import CategoryTabs from "./CategoryTabs";
import CategoryAnimation from "./CategoryAnimation";
import MenuItemCard from "./MenuItemCard";

interface Props {
  categories: Category[];
  menuItems: MenuItem[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onSelectItem: (item: MenuItem) => void;
  cafeName: string;
  cartCount: number;
  onOpenCart: () => void;
}

export default function MenuBrowser({
  categories,
  menuItems,
  activeCategoryId,
  onSelectCategory,
  onSelectItem,
  cafeName,
  cartCount,
  onOpenCart,
}: Props) {
  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? categories[0] ?? null;
  const items = activeCategory ? menuItems.filter((item) => item.category_id === activeCategory.id) : [];

  return (
    <div className="min-h-dvh pb-24">
      <header className="flex items-center justify-between px-4 pt-5">
        <h1 className="font-serif text-lg italic">{cafeName}</h1>
      </header>

      <CategoryTabs categories={categories} activeId={activeCategory?.id ?? null} onSelect={onSelectCategory} />

      {activeCategory && (
        <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-espresso">
          <CategoryAnimation animationKey={activeCategory.animation_key} />
        </div>
      )}

      <div className="space-y-3 px-4">
        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-espresso-light">No items in this category yet.</p>
        )}
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            photoUrl={getItemPhoto(item.photo_url, activeCategory?.animation_key ?? "")}
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-cream shadow-card"
        >
          View cart · {cartCount}
        </button>
      )}
    </div>
  );
}
