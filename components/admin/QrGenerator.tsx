"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function QrGenerator() {
  const { t } = useLocale();
  const [tableNumber, setTableNumber] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState(
    typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SITE_URL || window.location.origin : ""
  );

  async function generate() {
    const target = new URL(siteUrl || window.location.origin);
    if (tableNumber.trim()) target.searchParams.set("table", tableNumber.trim());
    const url = await QRCode.toDataURL(target.toString(), {
      width: 480,
      margin: 2,
      color: { dark: "#1F2B45", light: "#E5D7C3" },
    });
    setDataUrl(url);
  }

  return (
    <div className="space-y-3 rounded-2xl bg-white p-4 shadow-card">
      <h3 className="font-serif text-lg italic text-navy">{t("qr.title")}</h3>
      <p className="text-xs text-navy/60">{t("qr.description")}</p>

      <label className="block text-sm font-medium text-navy">
        {t("qr.siteUrl")}
        <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm" />
      </label>

      <label className="block text-sm font-medium text-navy">
        {t("qr.tableNumber")} <span className="font-normal text-navy/50">{t("checkout.optional")}</span>
        <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. 4" className="mt-1 w-full rounded-lg border border-gold/30 p-2 text-sm" />
      </label>

      <motion.button
        whileHover={{ scale: 1.01, filter: "brightness(1.06)" }}
        whileTap={{ scale: 0.98 }}
        onClick={generate}
        className="w-full rounded-full bg-gold-gradient py-2 text-xs font-semibold uppercase tracking-wide text-navy"
      >
        {t("qr.generate")}
      </motion.button>

      {dataUrl && (
        <div className="flex flex-col items-center gap-2 pt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="QR code" className="h-40 w-40 rounded-lg" />
          <a
            href={dataUrl}
            download={`qr${tableNumber ? `-table-${tableNumber}` : ""}.png`}
            className="-my-2 flex min-h-11 items-center px-1 text-xs font-medium text-gold underline"
          >
            {t("qr.download")}
          </a>
        </div>
      )}
    </div>
  );
}
