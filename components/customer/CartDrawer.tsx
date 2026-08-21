"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import PhotoTile from "@/components/PhotoTile";
import AnimatedNumber from "@/components/AnimatedNumber";
import type { CartLine } from "./cartTypes";
import { cartTotal } from "./cartTypes";

interface Props {
  lines: CartLine[];
  onClose: () => void;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onUpdateNotes: (key: string, notes: string) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ lines, onClose, onUpdateQuantity, onUpdateNotes, onRemove, onCheckout }: Props) {
  const { t, pick } = useLocale();
  const total = cartTotal(lines);

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-navy-deep/50 backdrop-blur-sm sm:items-center sm:justify-center" onClick={onClose}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-cream p-5 pb-8 sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl italic text-navy">{t("cart.title")}</h2>
          <button onClick={onClose} className="-m-2.5 flex h-11 w-11 items-center justify-center text-2xl leading-none text-navy/50">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-10 text-center font-sans text-sm text-navy/60">{t("cart.empty")}</p>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <motion.div
                  key={line.key}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3 rounded-2xl bg-white p-3 shadow-card"
                >
                  <PhotoTile src={line.photoUrl} alt={pick(line.nameEn, line.nameAr)} className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-ui text-sm font-semibold text-navy">{pick(line.nameEn, line.nameAr)}</p>
                        <p className="font-ui text-xs text-terracotta">${line.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => onRemove(line.key)}
                        className="-m-2.5 min-h-11 min-w-11 p-2.5 font-ui text-xs font-medium text-navy/40 underline"
                      >
                        {t("cart.delete")}
                      </button>
                    </div>

                    <input
                      value={line.notes}
                      onChange={(e) => onUpdateNotes(line.key, e.target.value)}
                      placeholder={t("cart.notesPlaceholder")}
                      className="mt-2 w-full rounded-lg border border-navy/10 bg-cream/60 px-2 py-1 font-sans text-xs text-navy outline-none placeholder:text-navy/40 focus:border-gold"
                    />

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-cream p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(line.key, Math.max(1, line.quantity - 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm text-navy shadow"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm text-navy">{line.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(line.key, line.quantity + 1)}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm text-navy shadow"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-ui text-sm font-semibold text-navy">${(line.price * line.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-4 border-t border-navy/10 pt-4">
          <div className="mb-3 flex items-center justify-between font-ui text-sm font-semibold text-navy">
            <span>{t("cart.total")}</span>
            <AnimatedNumber value={total} />
          </div>
          <motion.button
            whileHover={lines.length ? { scale: 1.02, filter: "brightness(1.06)" } : undefined}
            whileTap={lines.length ? { scale: 0.98 } : undefined}
            onClick={onCheckout}
            disabled={lines.length === 0}
            className="w-full rounded-full bg-gold-gradient py-3 font-ui text-sm font-semibold uppercase tracking-wide text-navy disabled:opacity-40"
          >
            {t("cart.checkout")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
