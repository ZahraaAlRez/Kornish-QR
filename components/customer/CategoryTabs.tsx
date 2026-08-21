"use client";

import { motion } from "framer-motion";
import type { Category } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Props {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const pillVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/** Horizontally scrollable, but with no padding of its own — the shared
 * menu container supplies the left edge every other row aligns to. */
export default function CategoryTabs({ categories, activeId, onSelect }: Props) {
  const { pick } = useLocale();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="flex gap-2 overflow-x-auto"
    >
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <motion.button
            key={category.id}
            variants={pillVariants}
            onClick={() => onSelect(category.id)}
            className={`relative flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 font-ui text-sm font-medium transition ${
              active ? "text-cream" : "border border-navy/25 bg-cream/40 text-navy/70 hover:bg-cream/70"
            }`}
          >
            {active && (
              <motion.span
                layoutId="category-pill-active"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-navy"
              />
            )}
            <span className="relative">{pick(category.name_en, category.name_ar)}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
