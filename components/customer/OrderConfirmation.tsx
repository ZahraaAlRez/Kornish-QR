"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Props {
  total: number;
  whatsappLink: string | null;
  onNewOrder: () => void;
}

export default function OrderConfirmation({ total, whatsappLink, onNewOrder }: Props) {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-deep/50 backdrop-blur-sm p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm rounded-3xl bg-cream p-6 text-center"
      >
        <div className="relative mx-auto mb-2 flex h-20 w-20 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.4, scale: 1.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-gold blur-lg"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <Image src="/brand/sultana-logo-icon.png" alt="" width={56} height={56} className="relative h-14 w-14 object-contain" />
          </motion.div>
        </div>

        <h2 className="font-serif text-2xl italic text-navy">{t("confirmation.title")}</h2>
        <p className="mt-2 font-sans text-sm text-navy/70">
          {t("cart.total")}: ${total.toFixed(2)}
        </p>

        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-full bg-whatsapp py-3 font-ui text-sm font-semibold uppercase tracking-wide text-white"
          >
            {t("confirmation.sendWhatsapp")}
          </a>
        ) : (
          <p className="mt-5 rounded-xl bg-navy/5 p-3 font-sans text-xs text-navy/60">{t("confirmation.notConfigured")}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewOrder}
          className="mt-4 w-full rounded-full border border-gold py-3 font-ui text-sm font-semibold uppercase tracking-wide text-terracotta"
        >
          {t("confirmation.newOrder")}
        </motion.button>
      </motion.div>
    </div>
  );
}
