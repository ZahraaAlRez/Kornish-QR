"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/supabase/types";

interface Props {
  item: MenuItem;
  photoUrl: string;
  onClose: () => void;
  onAdd: (quantity: number, notes: string) => void;
}

export default function ItemDetailSheet({ item, photoUrl, onClose, onAdd }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-espresso/60" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={item.name} className="mb-4 h-40 w-full rounded-2xl object-cover" />
        <h2 className="font-serif text-xl italic text-espresso">{item.name}</h2>
        {item.description && <p className="mt-1 text-sm text-espresso-light">{item.description}</p>}
        <p className="mt-2 text-lg font-semibold text-gold">${item.price.toFixed(2)}</p>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm font-medium">Quantity</span>
          <div className="flex items-center gap-3 rounded-full bg-cream px-3 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-7 w-7 rounded-full bg-white text-lg leading-none shadow"
            >
              −
            </button>
            <span className="w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="h-7 w-7 rounded-full bg-white text-lg leading-none shadow"
            >
              +
            </button>
          </div>
        </div>

        <label className="mt-4 block text-sm font-medium">
          Notes <span className="font-normal text-espresso-light">(e.g. no tomato)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-gold-light/40 p-2 text-sm outline-none focus:border-gold"
          />
        </label>

        <button
          onClick={() => onAdd(quantity, notes)}
          className="mt-5 w-full rounded-full bg-espresso py-3 text-sm font-semibold uppercase tracking-wide text-cream"
        >
          Add {quantity > 1 ? `${quantity} ` : ""}to cart · ${(item.price * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
}
