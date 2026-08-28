"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

/**
 * Live cart/order total count-up when the value changes (spec §8). `value`
 * is always the USD source-of-truth amount — `format` (e.g. the customer's
 * chosen-currency formatter) only controls how the animated number renders,
 * so switching currency re-labels the same underlying total rather than
 * duplicating/hardcoding a second price.
 */
export default function AnimatedNumber({
  value,
  format = (v) => `$${v.toFixed(2)}`,
}: {
  value: number;
  format?: (value: number) => string;
}) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (v) => format(v));
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (v) => motionValue.set(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}
