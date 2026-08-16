"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QrGenerator() {
  const [tableNumber, setTableNumber] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState(
    typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SITE_URL || window.location.origin : ""
  );

  async function generate() {
    const target = new URL(siteUrl || window.location.origin);
    if (tableNumber.trim()) target.searchParams.set("table", tableNumber.trim());
    const url = await QRCode.toDataURL(target.toString(), { width: 480, margin: 2 });
    setDataUrl(url);
  }

  return (
    <div className="space-y-3 rounded-2xl bg-white p-4 shadow-card">
      <h3 className="font-serif text-lg italic">QR code generator</h3>
      <p className="text-xs text-espresso-light">
        Leave table number blank for one generic QR (works for dine-in or delivery). Fill it in to generate a
        per-table code that pre-fills the table number at checkout.
      </p>

      <label className="block text-sm font-medium">
        Site URL
        <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
      </label>

      <label className="block text-sm font-medium">
        Table number <span className="font-normal text-espresso-light">(optional)</span>
        <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. 4" className="mt-1 w-full rounded-lg border border-gold-light/40 p-2 text-sm" />
      </label>

      <button onClick={generate} className="w-full rounded-full bg-espresso py-2 text-xs font-semibold uppercase tracking-wide text-cream">
        Generate QR code
      </button>

      {dataUrl && (
        <div className="flex flex-col items-center gap-2 pt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="QR code" className="h-40 w-40" />
          <a
            href={dataUrl}
            download={`qr${tableNumber ? `-table-${tableNumber}` : ""}.png`}
            className="text-xs font-medium text-gold underline"
          >
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
