import Image from "next/image";
import PlaceholderArt from "./PlaceholderArt";

/**
 * A real photo when `src` is set, otherwise the shared editorial placeholder.
 * Swapping a placeholder for a real photo later is purely a data change
 * (setting `photo_url` via the admin dashboard) — this component's layout
 * never has to change.
 *
 * Routed through `next/image` rather than a raw `<img>`: admin uploads are
 * stored exactly as supplied (no server-side resizing — see the admin's own
 * client-side downscale for the size limit actually enforced at upload
 * time), and this is the customer-facing menu grid, where a dozen-plus of
 * these can be decoding in memory at once as someone scrolls. `next/image`
 * requests only the pixel size this `sizes` hint says will actually be
 * rendered, instead of the browser decoding whatever the stored file
 * happens to be — the gap between those two was large enough to reliably
 * crash real iPhone Safari sessions after enough scrolling.
 */
export default function PhotoTile({
  src,
  alt,
  seed,
  categoryHint,
  className = "",
  sizes = "(min-width: 1024px) 280px, (min-width: 640px) 220px, 45vw",
}: {
  src: string | null;
  alt: string;
  /** Varies the placeholder photo per item; falls back to `alt` so callers rarely need to pass it. */
  seed?: string;
  /** Loosely matched category name (e.g. "Hot Drinks") to pick a relevant placeholder photo. */
  categoryHint?: string;
  className?: string;
  /** Matches the `sizes` attribute to how large this tile actually renders — defaults to the menu grid card, the highest-volume context. Override for smaller contexts (admin thumbnails, cart line items) so those don't request more than they need either. */
  sizes?: string;
}) {
  if (!src) {
    return <PlaceholderArt seed={seed ?? alt} categoryHint={categoryHint} className={className} />;
  }
  return (
    <div className={`relative ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
