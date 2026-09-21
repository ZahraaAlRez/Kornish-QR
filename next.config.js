/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    // Nothing in this app ever renders a photo wider than 600px CSS width
    // (ItemDetailSheet's `sizes` prop is the largest) — Next's defaults go
    // up to 3840px across 16 combined breakpoints, which just means every
    // menu photo gets optimized into variants this phone-first QR menu will
    // never request. This caps it to 8 widths that actually cover what's
    // rendered, including headroom for ~2x-retina phones on the 600px
    // detail view.
    deviceSizes: [384, 640, 828, 1200],
    imageSizes: [64, 96, 128, 256],
    // Admin photo uploads always get a brand-new crypto.randomUUID() path
    // (see uploadPhoto in menu/actions.ts) and the old file is deleted on
    // replacement, so a given image URL's bytes never change under it —
    // safe to cache each optimized variant for a year instead of Next's
    // 60-second default, which was silently re-optimizing the same photo
    // over and over throughout a single day of service.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

module.exports = nextConfig;
