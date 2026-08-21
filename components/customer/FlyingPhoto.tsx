"use client";

import { motion } from "framer-motion";
import PhotoTile from "@/components/PhotoTile";

interface Props {
  src: string | null;
  from: DOMRect;
  to: DOMRect;
  onComplete: () => void;
}

/** Add-to-cart micro-interaction: the item visually moves toward the cart icon (spec §8). */
export default function FlyingPhoto({ src, from, to, onComplete }: Props) {
  const toX = to.left + to.width / 2 - (from.left + from.width / 2);
  const toY = to.top + to.height / 2 - (from.top + from.height / 2);

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: toX, y: toY, scale: 0.15, opacity: 0.4 }}
      transition={{ duration: 0.55, ease: "easeIn" }}
      onAnimationComplete={onComplete}
      className="pointer-events-none fixed z-50 overflow-hidden rounded-xl"
      style={{ left: from.left, top: from.top, width: from.width, height: from.height }}
    >
      <PhotoTile src={src} alt="" className="h-full w-full" />
    </motion.div>
  );
}
