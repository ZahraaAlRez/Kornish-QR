"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import PhotoTile from "@/components/PhotoTile";

interface Props {
  item: MenuItem;
  /** The item's category name, loosely matched to pick a relevant placeholder photo. */
  categoryHint?: string;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, sourceRect: DOMRect | null) => void;
}

export default function MenuItemCard({ item, categoryHint, onSelect, onQuickAdd }: Props) {
  const { pick } = useLocale();
  const name = pick(item.name_en, item.name_ar);
  const description = pick(item.description_en ?? "", item.description_ar);
  const photoRef = useRef<HTMLDivElement>(null);
  const [justAdded, setJustAdded] = useState(false);

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    onQuickAdd(item, photoRef.current?.getBoundingClientRect() ?? null);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <motion.button
      onClick={() => onSelect(item)}
      whileTap={{ scale: 0.98 }}
      className="flex w-full flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white text-start shadow-card transition hover:-translate-y-0.5"
    >
      <div ref={photoRef} className="relative aspect-square w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="h-full w-full"
        >
          <PhotoTile src={item.photo_url} alt={name} seed={item.id} categoryHint={categoryHint} className="h-full w-full" />
        </motion.div>
        <motion.span
          onClick={handleQuickAdd}
          animate={{ rotate: justAdded ? 180 : 0 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-2 end-2 flex h-11 w-11 items-center justify-center rounded-full bg-navy text-cream shadow-card"
          aria-label="Add to cart"
        >
          {justAdded ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          )}
        </motion.span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="font-ui text-[15px] font-semibold text-navy">{name}</span>
        {description && <span className="line-clamp-2 font-sans text-xs text-navy/60">{description}</span>}
        <span className="mt-1 font-ui text-base font-bold text-terracotta">${item.price.toFixed(2)}</span>
      </div>
    </motion.button>
  );
}
