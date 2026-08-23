"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Props {
  onDone: () => void;
}

// Safety net in case the video never fires `onEnded`/`onError` (e.g. a
// stalled network request that never resolves either way) — the splash must
// never be able to block the site from becoming usable. This starting value
// is intentionally generous (well beyond the video's actual ~8s length) so
// it only ever acts as a true stall guard; once the video's real duration is
// known (`onLoadedMetadata`), the timer below is replaced with one sized to
// that duration instead, so a successful, slow-to-end playback is never cut
// short by a fixed timeout tuned for a different video length.
const INITIAL_FAILSAFE_MS = 15000;
const END_BUFFER_MS = 1500;

/**
 * First-visit-only intro splash — plays once before the hero reveal, then
 * hands off. Mounting this component at all already implies "first visit,
 * motion allowed" (CustomerApp decides that before rendering it), so this
 * component's only job is: play, and always eventually call `onDone`. The
 * video file has no audio track, so playback is simply muted — no unmute
 * affordance needed.
 */
export default function WelcomeSplash({ onDone }: Props) {
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
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
    const video = videoRef.current;
    if (!video) return;

    let failsafe = setTimeout(finish, INITIAL_FAILSAFE_MS);

    // Once the real duration is known, retarget the failsafe to that length
    // (plus a small buffer) instead of the generous initial guess — keeps it
    // a true stall guard rather than a fixed cutoff that could clip a longer
    // video's ending before `onEnded` naturally fires.
    function onLoadedMetadata() {
      if (!video || !Number.isFinite(video.duration)) return;
      clearTimeout(failsafe);
      failsafe = setTimeout(finish, video.duration * 1000 + END_BUFFER_MS);
    }
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    // Autoplay can still fail even when muted on some locked-down mobile
    // browsers/webviews — if the play() promise rejects, don't leave the
    // customer staring at a frozen poster frame with no video.
    video.play().catch(finish);

    return () => {
      clearTimeout(failsafe);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep"
    >
      <video
        ref={videoRef}
        className="pointer-events-none h-full w-full select-none object-cover"
        src="/brand/sultana-welcome.mp4"
        poster="/brand/sultana-welcome-poster.jpg"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={finish}
        onError={finish}
      />

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 end-6 flex min-h-11 items-center rounded-full border border-cream/30 bg-navy-deep/60 px-4 font-ui text-xs font-medium uppercase tracking-wide text-cream"
      >
        {t("splash.skip")}
      </button>
    </motion.div>
  );
}
