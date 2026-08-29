import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first. The work screenshots are large flat-ish UI captures, which
    // is exactly what AVIF wins on — roughly half of WebP for the same slot.
    formats: ["image/avif", "image/webp"],
    // The widths a card slot actually resolves to: ~335px on a phone at DPR 1,
    // up to 480px on a wide screen, times the device pixel ratio. Trimming the
    // default ladder stops Next generating variants nothing ever requests.
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    imageSizes: [144, 256, 384, 512],
  },
};

export default nextConfig;
