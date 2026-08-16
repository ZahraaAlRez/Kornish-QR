"use client";

import type { MenuItem } from "@/lib/supabase/types";

interface Props {
  item: MenuItem;
  photoUrl: string;
  onSelect: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, photoUrl, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(item)}
      className="flex gap-3 rounded-2xl bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoUrl} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="flex flex-1 flex-col justify-center gap-1">
        <span className="font-medium text-espresso">{item.name}</span>
        {item.description && (
          <span className="line-clamp-2 text-xs text-espresso-light">{item.description}</span>
        )}
        <span className="text-sm font-semibold text-gold">${item.price.toFixed(2)}</span>
      </div>
    </button>
  );
}
