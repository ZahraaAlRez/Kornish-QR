"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

/** Live cart/order total count-up when the value changes (spec §8). */
export default function AnimatedNumber({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (v) => `${prefix}${v.toFixed(2)}`);
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
