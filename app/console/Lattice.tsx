"use client";

import { useEffect, useRef } from "react";

/* The supersolid: a crystal that flows. Dots hold lattice formation and
   breathe in place; one continuous line drifts through, frictionless.
   Reduced motion (or JS off) gets the static render. */

const COLS = 22;
const ROWS = 5;

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  css: { ink3: string; amber: string },
) {
  ctx.clearRect(0, 0, w, h);
  const gx = w / (COLS + 1);
  const gy = h / (ROWS + 1);

  // lattice — position is fixed; only presence breathes
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const phase = (r * 7 + c * 13) * 0.35;
      const alpha = 0.32 + 0.22 * Math.sin(t * 0.0009 + phase);
      ctx.beginPath();
      ctx.arc(gx * (c + 1), gy * (r + 1), 1.6, 0, Math.PI * 2);
      ctx.fillStyle = css.ink3;
      ctx.globalAlpha = alpha;
      ctx.fill();
    }
  }

  // the flow — one line, zero friction
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = css.amber;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const u = x / w;
    const y =
      h / 2 +
      Math.sin(u * Math.PI * 2.2 + t * 0.00045) * h * 0.26 +
      Math.sin(u * Math.PI * 5.1 - t * 0.0003) * h * 0.07;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export default function LatticeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const css = {
      ink3: styles.getPropertyValue("--ink-3").trim() || "#5c6470",
      amber: styles.getPropertyValue("--amber").trim() || "#ffb000",
    };

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = () => canvas.getBoundingClientRect();

    if (reduced) {
      draw(ctx, rect().width, rect().height, 0, css);
    } else {
      const loop = (t: number) => {
        draw(ctx, rect().width, rect().height, t, css);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      size();
      if (reduced) draw(ctx, rect().width, rect().height, 0, css);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none h-32 w-full"
      aria-hidden
      role="presentation"
    />
  );
}
