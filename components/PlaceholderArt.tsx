"use client";

import { useState } from "react";

// PLACEHOLDER IMAGE - replace with real product photography once photo_url
// is set on the category/item (via the admin dashboard). Until then this
// shows a category-matched stock photo (verified, stable Unsplash CDN
// links) so the menu reads as real food photography rather than abstract
// color blocks. If the external photo ever fails to load, `onError` swaps
// it for an on-brand gradient tile below — nothing ever renders as a
// broken-image icon. Swapping to a real photo later only ever touches
// `photo_url`; this component's layout never has to change.

const PHOTO_POOLS: Record<"hot" | "cold" | "dessert" | "sandwich", string[]> = {
  hot: ["1495474472287-4d71bcdd2085", "1509042239860-f550ce710b93", "1497515114629-f71d768fd07c"],
  cold: ["1461023058943-07fcbe16d735", "1517701604599-bb29b565090c", "1517959105821-eaf2591984ca"],
  dessert: ["1488477181946-6428a0291777", "1587314168485-3236d6710814", "1519676867240-f03562e64548", "1533134242443-d4fd215305ad"],
  sandwich: ["1509722747041-616f39b57569"],
};
const ALL_PHOTO_IDS = Object.values(PHOTO_POOLS).flat();

function poolForHint(hint: string): string[] {
  const h = hint.toLowerCase();
  if (/cold|iced|ice|chill|fresh|juice/.test(h)) return PHOTO_POOLS.cold;
  if (/hot|coffee|tea|warm|espresso|latte/.test(h)) return PHOTO_POOLS.hot;
  if (/dessert|sweet|cake|pastry|treat/.test(h)) return PHOTO_POOLS.dessert;
  if (/sandwich|wrap|toast|sub/.test(h)) return PHOTO_POOLS.sandwich;
  return ALL_PHOTO_IDS;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

export function placeholderPhotoUrl(seed: string, categoryHint: string, width = 480): string {
  const pool = poolForHint(categoryHint);
  const id = pool[hashSeed(seed) % pool.length];
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=70&fm=jpg&fit=crop&auto=format`;
}

// Fallback gradients — only ever shown if the stock photo fails to load.
const GRADIENTS = [
  "linear-gradient(155deg, #F3E7CF 0%, #E5D7C3 45%, #C8A66A 100%)",
  "linear-gradient(155deg, #EFDFC4 0%, #C8A66A 55%, #B97858 100%)",
  "linear-gradient(155deg, #F7F1E8 0%, #E5D7C3 40%, #B97858 100%)",
  "linear-gradient(155deg, #E5D7C3 0%, #C8A66A 50%, #9C7A46 100%)",
];

function gradientForSeed(seed: string): string {
  return GRADIENTS[hashSeed(seed) % GRADIENTS.length];
}

export default function PlaceholderArt({
  seed = "sultana",
  categoryHint = "",
  className = "",
}: {
  seed?: string;
  /** Loosely matched category name (e.g. "Hot Drinks") to pick a relevant photo pool. */
  categoryHint?: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: gradientForSeed(seed) }} aria-hidden="true">
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.5), transparent 55%)" }}
        />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={placeholderPhotoUrl(seed, categoryHint)}
      alt=""
      aria-hidden="true"
      onError={() => setErrored(true)}
      className={`bg-sand object-cover ${className}`}
    />
  );
}
