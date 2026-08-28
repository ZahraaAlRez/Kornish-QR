"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useCurrency } from "@/lib/currency/CurrencyContext";

interface Props {
  count: number;
  /** USD amount — the storage/source-of-truth unit, same as everywhere else `formatPrice` is used. */
  total: number;
  onOpen: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "View cart" pill, styled like Hero's own View Menu CTA — sits in normal
 * document flow ~50px under the item grid (not pinned to the viewport), so
 * it scrolls away with the page instead of hovering in place over the
 * items while the customer scrolls past it.
 */
export default function FloatingCartBar({ count, total, onOpen }: Props) {
  const { t } = useLocale();
  const { formatPrice } = useCurrency();

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: EASE }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="mx-auto mt-[50px] flex h-14 w-full max-w-sm items-center justify-between gap-4 rounded-full bg-navy px-5 text-cream shadow-[0_12px_32px_rgba(31,43,69,0.35)]"
    >
      <span className="flex items-center gap-2 font-ui text-sm font-bold uppercase tracking-wide">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
          {count}
        </span>
        {t("menu.cartView")}
      </span>
      <span className="font-ui text-sm font-bold">{formatPrice(total)}</span>
    </motion.button>
  );
}
