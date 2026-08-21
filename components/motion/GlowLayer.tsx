"use client";

/** Slow-breathing blurred champagne-gold/terracotta glow behind warm content. */
export default function GlowLayer({ intensity = 1 }: { intensity?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="animate-glow-breathe absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold blur-[120px]"
        style={{ opacity: 0.18 * intensity }}
      />
      <div
        className="animate-glow-breathe absolute bottom-0 right-0 h-[45vmax] w-[45vmax] translate-x-1/4 translate-y-1/4 rounded-full bg-terracotta blur-[100px]"
        style={{ opacity: 0.14 * intensity, animationDelay: "-4s" }}
      />
    </div>
  );
}
