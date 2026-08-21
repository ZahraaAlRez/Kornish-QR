"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import PhotoTile from "@/components/PhotoTile";

interface Props {
  item: MenuItem;
  onClose: () => void;
  onAdd: (quantity: number, notes: string, sourceRect: DOMRect | null) => void;
}

export default function ItemDetailSheet({ item, onClose, onAdd }: Props) {
  const { t, pick } = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const photoRef = useRef<HTMLDivElement>(null);

  const name = pick(item.name_en, item.name_ar);
  const description = pick(item.description_en ?? "", item.description_ar);

  function handleAdd() {
    const rect = photoRef.current?.getBoundingClientRect() ?? null;
    onAdd(quantity, notes, rect);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-navy-deep/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full rounded-t-3xl bg-cream p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={photoRef} className="mb-4 h-40 w-full overflow-hidden rounded-2xl">
          <PhotoTile src={item.photo_url} alt={name} className="h-full w-full" />
        </div>
        <h2 className="font-serif text-xl italic text-navy">{name}</h2>
        {description && <p className="mt-1 font-sans text-sm text-navy/70">{description}</p>}
        <p className="mt-2 font-ui text-lg font-bold text-terracotta">${item.price.toFixed(2)}</p>

        <div className="mt-4 flex items-center gap-4">
          <span className="font-ui text-sm font-medium text-navy">{t("item.quantity")}</span>
          <div className="flex items-center gap-2 rounded-full bg-navy/5 p-0.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg leading-none shadow"
            >
              −
            </button>
            <span className="w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg leading-none shadow"
            >
              +
            </button>
          </div>
        </div>

        <label className="mt-4 block text-sm font-medium text-navy">
          {t("item.notes")} <span className="font-normal text-navy/50">{t("item.notesHint")}</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full min-h-11 rounded-xl border border-gold/30 bg-white p-2 text-sm outline-none focus:border-gold"
          />
        </label>

        <motion.button
          whileHover={{ scale: 1.02, filter: "brightness(1.06)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="mt-5 w-full rounded-full bg-gold-gradient py-3 font-ui text-sm font-semibold uppercase tracking-wide text-navy"
        >
          {t("item.addToCart")} · ${(item.price * quantity).toFixed(2)}
        </motion.button>
      </motion.div>
    </div>
  );
}
