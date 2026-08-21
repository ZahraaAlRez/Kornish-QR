"use client";

import { useMemo } from "react";

interface Diamond {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  driftX: number;
  driftY: number;
  delay: number;
}

// Deterministic pseudo-random so server/client markup matches (no hydration
// mismatch) — a simple mulberry32 seeded generator, not real randomness.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Scattered rounded-diamond shapes (the icon mark's squircle geometry) at
 * low opacity, each drifting/rotating independently — spec §4's base layer.
 * `intensity` lets admin screens pass a toned-down version for legibility.
 */
export default function DiamondLattice({
  count = 16,
  intensity = 1,
  seed = 7,
}: {
  count?: number;
  intensity?: number;
  seed?: number;
}) {
  const diamonds = useMemo<Diamond[]>(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, id) => ({
      id,
      x: rand() * 100,
      y: rand() * 100,
      size: 18 + rand() * 64,
      opacity: (0.05 + rand() * 0.05) * intensity,
      duration: 10 + rand() * 10,
      driftX: (rand() - 0.5) * 24,
      driftY: (rand() - 0.5) * 24,
      delay: rand() * -20,
    }));
  }, [count, intensity, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {diamonds.map((d) => (
        <div
          key={d.id}
          className="animate-diamond-drift absolute rounded-[22%] bg-gold"
          style={
            {
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              transform: "rotate(45deg)",
              "--drift-x": `${d.driftX}px`,
              "--drift-y": `${d.driftY}px`,
              "--drift-duration": `${d.duration}s`,
              animationDelay: `${d.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
