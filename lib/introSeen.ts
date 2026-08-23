/**
 * Two distinct flags, deliberately not shared: `INTRO_SEEN_KEY` is Hero's own
 * "have I already played my entrance choreography this session" check —
 * owned and written exclusively by Hero. `SPLASH_SEEN_KEY` is CustomerApp's
 * separate "have I already shown the welcome-video splash this session"
 * check. Hero only ever mounts after the splash phase has resolved (see
 * CustomerApp), so on a genuine first visit Hero's own flag is still unset
 * when it mounts and its full entrance animation plays normally; on a
 * same-session reload both flags are already set and both the splash and
 * Hero's animation are skipped. Collapsing these into one key previously
 * caused Hero to always see the flag pre-set by the splash and skip straight
 * to its fast/returning-visitor path, even for first-time visitors.
 */
export const INTRO_SEEN_KEY = "sultana-intro-seen";
export const SPLASH_SEEN_KEY = "sultana-splash-seen";
