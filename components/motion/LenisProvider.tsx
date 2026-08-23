"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/**
 * The single site-wide Lenis instance (or `null` on touch devices, where
 * this provider intentionally never creates one — see below). Any
 * programmatic scroll must go through this, never a hand-rolled
 * `window.scrollTo`/`scrollIntoView` loop, so there is only ever one system
 * driving the page's scroll position at a time.
 */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Smooth scrolling site-wide (spec §8), customer app + admin alike — but
 * only for fine-pointer (mouse/trackpad) input. Lenis's touch smoothing
 * (`syncTouch`) is off by default, so on phones/tablets it was already doing
 * nothing but running a permanent RAF loop every frame — pure main-thread
 * overhead on exactly the devices that were freezing while scrolling, for a
 * smooth-wheel effect those devices never used in the first place.
 *
 * Mounted exactly once, at the root layout — never re-create this per
 * component, per route, or on state changes; a second RAF loop or a second
 * instance fighting this one for control of the scroll position is exactly
 * the class of bug this component exists to prevent.
 */
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const instance = new Lenis({ duration: 1.1, smoothWheel: true });
    setLenis(instance);

    let frameId: number;
    function raf(time: number) {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
