"use client";

import type { Category } from "@/lib/supabase/types";

interface Props {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ categories, activeId, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3">
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-espresso text-cream shadow-card"
                : "bg-white text-espresso-light hover:bg-gold-light/30"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
