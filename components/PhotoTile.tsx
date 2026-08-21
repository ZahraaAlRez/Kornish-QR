import PlaceholderArt from "./PlaceholderArt";

/**
 * A real photo when `src` is set, otherwise the shared editorial placeholder.
 * Swapping a placeholder for a real photo later is purely a data change
 * (setting `photo_url` via the admin dashboard) — this component's layout
 * never has to change.
 */
export default function PhotoTile({
  src,
  alt,
  seed,
  categoryHint,
  className = "",
}: {
  src: string | null;
  alt: string;
  /** Varies the placeholder photo per item; falls back to `alt` so callers rarely need to pass it. */
  seed?: string;
  /** Loosely matched category name (e.g. "Hot Drinks") to pick a relevant placeholder photo. */
  categoryHint?: string;
  className?: string;
}) {
  if (!src) {
    return <PlaceholderArt seed={seed ?? alt} categoryHint={categoryHint} className={className} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
}
