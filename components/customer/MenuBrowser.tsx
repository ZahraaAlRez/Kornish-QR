"use client";

import { forwardRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category, MenuItem } from "@/lib/supabase/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Footer from "@/components/Footer";
import { accentForIndex, kineticPhraseForIndex } from "@/lib/categoryAccents";
import CategoryTabs from "./CategoryTabs";
import MenuItemCard from "./MenuItemCard";
import KineticBackdrop from "./KineticBackdrop";

interface Props {
  categories: Category[];
  menuItems: MenuItem[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, sourceRect: DOMRect | null) => void;
  searchQuery: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;
// Every section (heading, tabs, active-category label, grid) lives inside
// this exact container so they all share one left edge.
const CONTAINER = "mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8";

const MenuBrowser = forwardRef<HTMLDivElement, Props>(function MenuBrowser(
  { categories, menuItems, activeCategoryId, onSelectCategory, onSelectItem, onQuickAdd, searchQuery },
  ref
) {
  const { t, pick } = useLocale();
  const activeIndex = Math.max(0, categories.findIndex((c) => c.id === activeCategoryId));
  const activeCategory = categories[activeIndex] ?? categories[0] ?? null;

  const query = searchQuery.trim().toLowerCase();
  const searching = query.length > 0;

  const searchResults = useMemo(() => {
    if (!searching) return [];
    return menuItems.filter((item) => {
      const haystack = [item.name_en, item.name_ar, item.description_en, item.description_ar].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [menuItems, query, searching]);

  const items = searching ? searchResults : activeCategory ? menuItems.filter((item) => item.category_id === activeCategory.id) : [];
  const accent = accentForIndex(activeIndex);

  function categoryHintForItem(item: MenuItem): string {
    if (!searching) return activeCategory?.name_en ?? "";
    return categories.find((c) => c.id === item.category_id)?.name_en ?? "";
  }

  return (
    <motion.div
      ref={ref}
      initial={{ y: 32 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative z-10 -mt-8 flex min-h-dvh flex-col rounded-t-[2.5rem] bg-cream pt-16 shadow-[0_-24px_48px_rgba(31,43,69,0.10)]"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 h-72 transition-colors duration-700"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${accent.tint}, transparent)` }}
      />

      <div className={`${CONTAINER} pb-10`}>
        <motion.h2
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative pt-6 font-serif text-[38px] leading-[1.05] text-navy sm:text-[44px] lg:text-[52px] xl:text-[60px]"
        >
          {t("menu.title")}
        </motion.h2>
        <div className="mb-6 mt-3 h-[3px] w-12 rounded-full bg-gold" aria-hidden="true" />

        {!searching && (
          <div className="mb-2">
            <CategoryTabs categories={categories} activeId={activeCategory?.id ?? null} onSelect={onSelectCategory} />
          </div>
        )}

        <div className="relative mt-4">
          {!searching && activeCategory && <KineticBackdrop phrase={kineticPhraseForIndex(activeIndex)} />}

          <AnimatePresence mode="wait">
            <motion.div
              key={searching ? "search" : activeCategory?.id ?? "none"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative"
            >
              {!searching && activeCategory && (
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="font-serif text-xl italic text-navy">{pick(activeCategory.name_en, activeCategory.name_ar)}</h3>
                  <span className="h-px flex-1 bg-gold/50" />
                </div>
              )}

              <div className="grid grid-cols-2 justify-start gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                {items.length === 0 && (
                  <p className="col-span-full py-10 text-center font-sans text-sm text-navy/50">
                    {searching ? t("menu.noResults") : t("menu.noItems")}
                  </p>
                )}
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.055, ease: EASE }}
                  >
                    <MenuItemCard
                      item={item}
                      categoryHint={categoryHintForItem(item)}
                      onSelect={onSelectItem}
                      onQuickAdd={onQuickAdd}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto">
        <Footer variant="light" />
      </div>
    </motion.div>
  );
});

export default MenuBrowser;
