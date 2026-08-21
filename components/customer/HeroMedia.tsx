"use client";

import { useState } from "react";
import { motion, type MotionStyle } from "framer-motion";

interface Props {
  /** Scroll-linked parallax transform from Hero; applied to the whole collage. */
  style?: MotionStyle;
}

/**
 * Hero product composition — coffee, a cold drink, and a dessert, arranged
 * as an editorial collage that cascades up toward the logo. No real
 * photography exists yet, so each tile below shows a stock placeholder
 * photo; swap only the `src` once real photos are supplied — the collage
 * layout itself never needs to change.
 */
export default function HeroMedia({ style }: Props) {
  return (
    <motion.div style={style} className="relative aspect-[4/5] w-full">
      {/* Dessert — the base of the collage. */}
      <ProductImage
        photoId="1488477181946-6428a0291777"
        fallbackGradient="linear-gradient(160deg, #F3E7CF 0%, #E5D7C3 45%, #C8A66A 100%)"
        className="absolute bottom-0 right-0 h-[62%] w-[68%] rounded-[2rem]"
      />
      {/* Cold drink — mid layer, overlapping toward the logo side. */}
      <ProductImage
        photoId="1461023058943-07fcbe16d735"
        fallbackGradient="linear-gradient(160deg, #F7F1E8 0%, #E5D7C3 55%, #B97858 100%)"
        className="absolute end-0 top-[6%] h-[40%] w-[42%] rotate-3 rounded-[1.5rem]"
      />
      {/* Coffee — closest to the logo, top of the ascent. */}
      <ProductImage
        photoId="1509042239860-f550ce710b93"
        fallbackGradient="linear-gradient(160deg, #EFDFC4 0%, #C8A66A 55%, #9C7A46 100%)"
        className="absolute start-0 top-0 h-[44%] w-[48%] -rotate-3 rounded-[1.75rem]"
      />
    </motion.div>
  );
}

// PLACEHOLDER IMAGE - replace with real product photography by swapping the
// `photoId` prop for a real `src`/<Image>; the rounded, shadowed tile layout
// stays exactly as-is. `fallbackGradient` only ever shows if the stock photo
// fails to load, so this tile is never a broken image.
function ProductImage({ photoId, fallbackGradient, className }: { photoId: string; fallbackGradient: string; className: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`overflow-hidden shadow-card ${className}`} style={{ background: fallbackGradient }} role="img" aria-label="" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://images.unsplash.com/photo-${photoId}?w=600&q=75&fm=jpg&fit=crop&auto=format`}
      alt=""
      aria-hidden="true"
      onError={() => setErrored(true)}
      className={`bg-sand object-cover shadow-card ${className}`}
    />
  );
}
