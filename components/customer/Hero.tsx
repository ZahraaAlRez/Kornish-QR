"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import HeroMedia from "./HeroMedia";

interface Props {
  cafeName: string;
  onViewMenu: () => void;
  /** 0 at the top of the hero, 1 once scrolled fully into the menu. */
  scrollProgress: MotionValue<number>;
}

const INTRO_SEEN_KEY = "sultana-intro-seen";
const EASE = [0.22, 1, 0.36, 1] as const;
const LOGO_ASPECT = "6030 / 5839";

/** True at `lg` (1024px) and up — used only to pick the hero-media entrance direction. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return desktop;
}

/**
 * "The Sultana Reveal" — full ~2.2s choreography on first visit this
 * session, a fast 0.5s fade straight into the menu on repeat visits. The
 * icon and wordmark are the real supplied artwork (not recreated as CSS
 * shapes): both PNGs have genuine alpha transparency, so `.logo-mask`
 * recolors the actual silhouette navy via CSS mask instead of an
 * approximated color filter. Only the full lockup remains on screen at
 * rest — the icon is a momentary hand-off beat, not a second permanent mark.
 */
const Hero = forwardRef<HTMLDivElement, Props>(function Hero({ cafeName, onViewMenu, scrollProgress }, ref) {
  const { t } = useLocale();
  const [returning, setReturning] = useState<boolean | null>(null);
  const isDesktop = useIsDesktop();
  // Guards against React 18 StrictMode's dev-only double-invoked effect: without
  // it, the second invocation reads back the sessionStorage write the first
  // invocation just made and misreads a genuine first visit as "returning".
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const seen = window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    setReturning(seen);
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    if (seen) {
      const timer = setTimeout(() => onViewMenu(), 900);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll-out choreography as the customer scrolls from hero into the menu.
  const contentOpacity = useTransform(scrollProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollProgress, [0, 0.4], [0, -32]);
  const logoHandoffOpacity = useTransform(scrollProgress, [0, 0.35], [1, 0]);
  const logoHandoffScale = useTransform(scrollProgress, [0, 0.5], [1, 0.85]);
  // Product photography moves at a slightly different rate than the text
  // column for a subtle parallax as the hero scrolls away.
  const mediaParallaxY = useTransform(scrollProgress, [0, 1], [0, -70]);

  if (returning === null) {
    // Avoid flashing the full sequence for a frame before sessionStorage resolves.
    return <div ref={ref} className="relative min-h-dvh w-full bg-ivory" />;
  }

  const fast = returning;

  return (
    <div ref={ref} className="relative min-h-dvh w-full overflow-hidden bg-ivory">
      {/* Clean warm ivory base + one restrained sand radial glow — no visible grain dots. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 70% 35%, rgba(229,215,195,0.55), transparent 45%)" }}
      />
      {/* Fades in to the CSS class's own 0.008 resting opacity — animating to 1
          here would set an inline style that overrides (and defeats) the
          class's opacity, rendering the grain at full strength instead. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.008 }}
        transition={{ duration: fast ? 0.3 : 0.4 }}
        className="paper-grain absolute inset-0"
      />

      <Ribbons fast={fast} />

      {/* z-20: the centered content column below is also z-10 and, being
          later in DOM order, would otherwise paint over (and intercept
          clicks in) this toggle's empty min-h-dvh region above the content. */}
      <div className="absolute inset-x-0 top-0 z-20 flex justify-end p-4">
        <LanguageToggle variant="light" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-[min(1180px,calc(100%-48px))] items-center py-20">
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          {/* Left: logo, tagline, CTA */}
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-start">
            <motion.div
              style={{ opacity: logoHandoffOpacity, scale: logoHandoffScale }}
              className="relative w-[clamp(230px,65vw,320px)] lg:w-[clamp(360px,35vw,520px)]"
            >
              <div className="relative w-full" style={{ aspectRatio: LOGO_ASPECT }}>
                {/* Icon — a brief hand-off beat with a slight overshoot bounce,
                    fades out once the full lockup has revealed. */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={fast ? { opacity: 0 } : { opacity: [0, 1, 1, 0], scale: [0.85, 1.08, 1, 1] }}
                  transition={fast ? { duration: 0.2 } : { duration: 0.85, delay: 0.25, times: [0, 0.4, 0.6, 1], ease: "easeOut" }}
                  className="logo-mask absolute inset-0 m-auto h-[24%] w-[24%] bg-navy"
                  style={{ maskImage: "url(/brand/sultana-logo-icon.png)", WebkitMaskImage: "url(/brand/sultana-logo-icon.png)" }}
                  aria-hidden="true"
                />
                {/* Full lockup — the one mark that remains on screen at rest. */}
                <motion.div
                  initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
                  transition={fast ? { duration: 0.35, ease: "easeOut" } : { duration: 0.55, delay: 0.7, ease: EASE }}
                  className="logo-mask absolute inset-0 bg-navy"
                  style={{
                    maskImage: "url(/brand/sultana-logo-full-light.png)",
                    WebkitMaskImage: "url(/brand/sultana-logo-full-light.png)",
                  }}
                  role="img"
                  aria-label={cafeName}
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.14em" }}
              transition={fast ? { duration: 0.25, delay: 0.15 } : { duration: 0.4, delay: 1.3, ease: "easeOut" }}
              className="font-ui text-xs font-bold uppercase text-navy/80"
            >
              {cafeName}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fast ? { duration: 0.2, delay: 0.12 } : { duration: 0.35, delay: 1.75, ease: "easeOut" }}
              className="font-ui text-xs uppercase tracking-[0.3em] text-terracotta"
            >
              {t("hero.tagline")}
            </motion.p>

            <ViewMenuButton fast={fast} onClick={onViewMenu} label={t("hero.cta")} />

            {!fast && <SwipeUpCue />}
          </div>

          {/* Right (desktop) / below (mobile): hero media */}
          <motion.div
            initial={isDesktop ? { opacity: 0, x: 40 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={fast ? { duration: 0.25, delay: 0.1 } : { duration: 0.65, delay: 1.5, ease: EASE }}
            className="w-full max-w-md justify-self-center lg:max-w-none lg:justify-self-end"
          >
            <HeroMedia style={{ y: mediaParallaxY }} />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <Footer variant="light" />
      </div>
    </div>
  );
});

export default Hero;

/** Layered champagne-gold ribbons that curve around the logo, drawn in on first visit. */
function Ribbons({ fast }: { fast: boolean }) {
  const paths = [
    { d: "M-10,65 C120,0 260,0 410,90", delay: 0.1, opacity: 0.65, width: 2.4 },
    { d: "M-10,135 C140,195 270,85 410,150", delay: 0.24, opacity: 0.45, width: 1.8 },
    { d: "M-10,225 C160,275 250,190 410,240", delay: 0.38, opacity: 0.55, width: 2 },
    { d: "M-10,270 C130,320 280,255 410,290", delay: 0.5, opacity: 0.35, width: 1.5 },
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          stroke="#C8A66A"
          strokeWidth={p.width}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: p.opacity }}
          transition={fast ? { duration: 0 } : { duration: 0.9, delay: p.delay, ease: EASE }}
        />
      ))}
    </svg>
  );
}

function SwipeUpCue() {
  const { t } = useLocale();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 2.6 }}
      className="mt-1 flex flex-col items-center gap-1 text-navy/40 lg:items-start"
    >
      <span className="font-ui text-[10px] uppercase tracking-[0.2em]">{t("hero.swipeUp")}</span>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 animate-swipe-up-cue" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function ViewMenuButton({ fast, onClick, label }: { fast: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={fast ? { duration: 0.2, delay: 0.22 } : { duration: 0.35, delay: 2.15, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative h-[52px] w-44 shrink-0 overflow-hidden rounded-full bg-navy font-ui text-sm font-bold uppercase tracking-wide text-cream transition-transform hover:scale-[1.02] lg:w-52"
    >
      <span className="relative z-10">{label}</span>
      {/* One automatic sweep right as the CTA lands (first visit only), plus
          the same sweep replayed on hover for ongoing feedback. */}
      {!fast && (
        <motion.span
          aria-hidden="true"
          initial={{ x: "-150%" }}
          animate={{ x: "350%" }}
          transition={{ duration: 0.6, delay: 2.55, ease: "easeInOut" }}
          className="absolute inset-y-0 left-0 z-0 w-1/3 skew-x-[-20deg] bg-white/25"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-0 w-1/3 -translate-x-[150%] skew-x-[-20deg] bg-white/15 transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
      />
    </motion.button>
  );
}
