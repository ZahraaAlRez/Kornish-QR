"use client";

import { motion } from "framer-motion";

interface Props {
  phrase: string;
}

/**
 * A single quiet line of type drifting behind category content — a texture,
 * not a headline. Capped well below the grid's own type scale so it never
 * reads as a competing crop, and hidden outright under reduced-motion.
 */
export default function KineticBackdrop({ phrase }: Props) {
  return (
    <div
      className="kinetic-backdrop pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <motion.p
        key={phrase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.025 }}
        transition={{ duration: 0.8 }}
        className="animate-kinetic-drift whitespace-nowrap text-center font-serif leading-none text-navy"
        style={{ fontSize: "clamp(72px, 10vw, 150px)" }}
      >
        {phrase}
      </motion.p>
    </div>
  );
}
