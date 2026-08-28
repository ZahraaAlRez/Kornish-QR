"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { Ribbons } from "./Hero";

interface Props {
  onDone: () => void;
}

const DISPLAY_MS = 2300;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * First-visit-only intro splash — a brief animated text reveal shown before
 * the hero, reusing its ivory/gold-ribbon background and entrance-motion
 * style so the handoff feels like one continuous piece. Replaces an earlier
 * video-based splash: autoplaying video decode on iOS Safari was the prime
 * suspect for repeated native "a problem occurred" crash reports there, and
 * this component now does no video decode, no media events, nothing beyond
 * a single Framer Motion text animation and a fixed timer — eliminating
 * that whole class of risk by construction rather than trying to tune it.
 */
export default function WelcomeSplash({ onDone }: Props) {
  const { t } = useLocale();
  const done = useRef(false);
  const [visible, setVisible] = useState(true);

  function finish() {
    if (done.current) return;
    done.current = true;
    setVisible(false);
    // Let the exit fade play before unmounting for real.
    setTimeout(onDone, 350);
  }

  useEffect(() => {
    const timer = setTimeout(finish, DISPLAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      // Turned off the instant `visible` flips to false (not after the fade
      // finishes) so this overlay can never intercept a tap/click while it's
      // invisibly fading out — it's fully unmounted 350ms later regardless
      // (see `finish()`), but this closes the gap for that whole window.
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ivory"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 70% 35%, rgba(229,215,195,0.55), transparent 45%)" }}
      />
      <Ribbons fast={false} />

      <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
        {/* The same hand-off icon mark Hero itself opens with, so this splash
            reads as the first beat of one continuous mark reveal rather than
            a separate screen — one of the few surfaces sparse enough to
            afford it a moment fully on its own. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="logo-mask h-10 w-10 bg-navy sm:h-12 sm:w-12"
          style={{ maskImage: "url(/brand/sultana-logo-icon.png)", WebkitMaskImage: "url(/brand/sultana-logo-icon.png)" }}
          role="img"
          aria-label=""
        />

        {/* Both lines are fixed bilingual copy, not `t("splash.welcome")` —
            this splash always shows English-then-Arabic together regardless
            of the site's currently chosen language, so it can't route
            through the locale-swapped translation (which would render the
            Arabic string here too, duplicating the line below). */}
        <motion.p
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="font-serif text-4xl italic text-navy sm:text-5xl"
          dir="ltr"
        >
          Sultana welcomes you
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.6, scaleX: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
          className="h-px w-16 bg-gold"
          aria-hidden="true"
        />

        <motion.p
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
          className="text-2xl text-navy/90 sm:text-3xl"
          style={{ fontFamily: '"Noto Kufi Arabic", serif' }}
          dir="rtl"
        >
          سلطانة ترحب بكم
        </motion.p>
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 end-6 z-10 flex min-h-11 items-center rounded-full border border-navy/15 bg-white/60 px-4 font-ui text-xs font-medium uppercase tracking-wide text-navy/70"
      >
        {t("splash.skip")}
      </button>
    </motion.div>
  );
}
