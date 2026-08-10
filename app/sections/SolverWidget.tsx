"use client";

/* The trading console's expectancy solver, running here. lib/expectancy.ts is
   ported unmodified from the platform's web/src/lib/expectancy and verified
   bit-identical against its test suite. Deterministic per seed. */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CANVAS_DEFAULTS,
  SIM_DEFAULTS,
  computeEV,
  kellyCurve,
  logGrowth,
  monteCarloPaths,
  percentileBands,
  quantileSorted,
  FAN_QS,
  type SolverParams,
} from "../../lib/expectancy";

const SIM = { ...SIM_DEFAULTS, numTrades: 120, numPaths: 300 };

type Css = { ink: string; ink2: string; ink3: string; line: string; accent: string; ok: string; danger: string; surface: string };

function readCss(): Css {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, fb: string) => s.getPropertyValue(n).trim() || fb;
  return {
    ink: v("--ink", "#e8eaed"),
    ink2: v("--ink-2", "#9ba3af"),
    ink3: v("--ink-3", "#5c6470"),
    line: v("--line", "#262b33"),
    accent: v("--accent", "#3d6bff"),
    ok: v("--ok", "#34c77b"),
    danger: v("--danger", "#e5534b"),
    surface: v("--surface", "#171a20"),
  };
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, css: Css) => void, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const css = readCss();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const render = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, r.width, r.height, css);
    };
    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

const fmtMoney = (v: number) =>
  v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(1)}k` : `$${v.toFixed(0)}`;

export default function SolverWidget() {
  const [p, setP] = useState<SolverParams>(CANVAS_DEFAULTS);
  const [f, setF] = useState(SIM.wagerFraction);
  const [hover, setHover] = useState<number | null>(null); // fan step under cursor

  const ev = useMemo(() => computeEV(p), [p]);
  const kelly = useMemo(() => kellyCurve(p, 240), [p]);
  const mc = useMemo(() => monteCarloPaths(p, { ...SIM, wagerFraction: f }), [p, f]);
  const bands = useMemo(() => percentileBands(mc), [mc]);
  const medianFinal = useMemo(() => {
    const s = Float64Array.from(mc.finals).sort();
    return quantileSorted(s, 0.5);
  }, [mc]);

  const steps = SIM.numTrades + 1;
  const nq = FAN_QS.length; // [p10, p25, p50, p75, p90]
  const q = (step: number, i: number) => bands[step * nq + i];

  /* ---- fan chart ---- */
  const fanRef = useCanvas(
    (ctx, w, h, css) => {
      const padL = 46, padR = 40, padT = 10, padB = 20;
      const iw = w - padL - padR, ih = h - padT - padB;
      let lo = Infinity, hi = -Infinity;
      for (let s = 0; s < steps; s++) {
        lo = Math.min(lo, q(s, 0));
        hi = Math.max(hi, q(s, nq - 1));
      }
      lo = Math.max(lo, 1); hi = Math.max(hi, lo * 1.5);
      const useLog = hi / lo > 40;
      const Y = (v: number) => {
        const t = useLog
          ? (Math.log(Math.max(v, lo)) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))
          : (v - lo) / (hi - lo);
        return padT + ih - t * ih;
      };
      const X = (s: number) => padL + (s / (steps - 1)) * iw;

      // grid: 3 recessive y ticks
      ctx.strokeStyle = css.line; ctx.lineWidth = 1;
      ctx.fillStyle = css.ink3; ctx.font = "10px var(--font-plex-mono), monospace";
      for (const t of [0, 0.5, 1]) {
        const v = useLog ? lo * Math.pow(hi / lo, t) : lo + t * (hi - lo);
        const y = Y(v);
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
        ctx.fillText(fmtMoney(v), 4, y + 3);
      }
      // start-capital baseline
      ctx.setLineDash([3, 4]); ctx.strokeStyle = css.ink3;
      ctx.beginPath(); ctx.moveTo(padL, Y(SIM.startingCapital)); ctx.lineTo(w - padR, Y(SIM.startingCapital)); ctx.stroke();
      ctx.setLineDash([]);

      const band = (a: number, b: number, alpha: number) => {
        ctx.beginPath();
        for (let s = 0; s < steps; s++) ctx.lineTo(X(s), Y(q(s, a)));
        for (let s = steps - 1; s >= 0; s--) ctx.lineTo(X(s), Y(q(s, b)));
        ctx.closePath();
        ctx.globalAlpha = alpha; ctx.fillStyle = css.accent; ctx.fill(); ctx.globalAlpha = 1;
      };
      band(0, 4, 0.10); // p10–p90
      band(1, 3, 0.16); // p25–p75

      ctx.strokeStyle = css.accent; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let s = 0; s < steps; s++) ctx.lineTo(X(s), Y(q(s, 2)));
      ctx.stroke();

      // right-edge direct labels
      ctx.fillStyle = css.ink2; ctx.font = "10px var(--font-plex-mono), monospace";
      ctx.fillText("p90", w - padR + 6, Y(q(steps - 1, 4)) + 3);
      ctx.fillText("p50", w - padR + 6, Y(q(steps - 1, 2)) + 3);
      ctx.fillText("p10", w - padR + 6, Y(q(steps - 1, 0)) + 3);
      // x labels
      ctx.fillStyle = css.ink3;
      ctx.fillText("0", padL, h - 6);
      ctx.fillText(`${SIM.numTrades} trades`, w - padR - 52, h - 6);

      // crosshair
      if (hover !== null) {
        const s = hover;
        ctx.strokeStyle = css.ink3; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(X(s), padT); ctx.lineTo(X(s), padT + ih); ctx.stroke();
        ctx.fillStyle = css.accent;
        ctx.beginPath(); ctx.arc(X(s), Y(q(s, 2)), 3, 0, Math.PI * 2); ctx.fill();
        const label = `t=${s}  p50 ${fmtMoney(q(s, 2))}  p10 ${fmtMoney(q(s, 0))}  p90 ${fmtMoney(q(s, 4))}`;
        ctx.font = "11px var(--font-plex-mono), monospace";
        const tw = ctx.measureText(label).width + 12;
        const bx = Math.min(Math.max(X(s) - tw / 2, padL), w - padR - tw);
        ctx.fillStyle = css.surface; ctx.strokeStyle = css.line;
        ctx.beginPath(); ctx.roundRect(bx, padT + 2, tw, 20, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = css.ink; ctx.fillText(label, bx + 6, padT + 16);
      }
    },
    [bands, hover, steps],
  );

  /* ---- kelly chart ---- */
  const kellyRef = useCanvas(
    (ctx, w, h, css) => {
      const padL = 8, padR = 8, padT = 14, padB = 18;
      const iw = w - padL - padR, ih = h - padT - padB;
      const gTop = Math.max(kelly.gStar, 0) * 1.25 || 0.01;
      const gBot = -gTop * 1.6;
      const X = (fv: number) => padL + (fv / kelly.fMax) * iw;
      const Y = (g: number) => padT + (gTop - Math.min(Math.max(g, gBot), gTop)) / (gTop - gBot) * ih;

      ctx.strokeStyle = css.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(w - padR, Y(0)); ctx.stroke();

      ctx.strokeStyle = css.accent; ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < kelly.fs.length; i++) {
        const g = kelly.gs[i];
        if (!Number.isFinite(g)) break;
        const x = X(kelly.fs[i]), y = Y(g);
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // f* marker + label
      ctx.fillStyle = css.accent;
      ctx.beginPath(); ctx.arc(X(kelly.fStar), Y(kelly.gStar), 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = "10px var(--font-plex-mono), monospace"; ctx.fillStyle = css.ink2;
      ctx.fillText(`f* ${(kelly.fStar * 100).toFixed(1)}%`, Math.min(X(kelly.fStar) + 8, w - 70), Y(kelly.gStar) - 6);

      // current f — hollow ring
      const gf = logGrowth(p, f);
      ctx.strokeStyle = css.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(X(Math.min(f, kelly.fMax)), Y(gf), 4.5, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = css.ink3;
      ctx.fillText("g(f) — expected log-growth vs bet size", padL, h - 5);
    },
    [kelly, f, p],
  );

  const slider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    set: (v: number) => void,
    fmt: (v: number) => string,
  ) => (
    <label className="flex items-center gap-3 font-mono text-[12px] text-ink-2">
      <span className="w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-[var(--accent)]"
      />
      <span className="w-14 shrink-0 text-right tabular-nums text-ink">{fmt(value)}</span>
    </label>
  );

  const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

  return (
    <div className="mt-6 rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink-3">
          solver · interactive
        </span>
        <span className="font-mono text-[11.5px] text-ink-3">
          seed {SIM.seed} · {SIM.numPaths} paths · deterministic
        </span>
      </div>

      {/* live formula — the console's signature element */}
      <p className="mt-3 overflow-x-auto whitespace-nowrap font-mono text-[12.5px] text-ink-2">
        EV = {p.winRatio.toFixed(2)}·(1−{p.sellRatio.toFixed(2)})·{p.avgWin.toFixed(2)} + {(1 - p.winRatio).toFixed(2)}·(1−{p.sellRatio.toFixed(2)})·({p.avgLoss.toFixed(0)}) + {p.sellRatio.toFixed(2)}·{p.avgSell.toFixed(2)} ={" "}
        <span style={{ color: ev >= 0 ? "var(--ok)" : "var(--danger)" }} className="font-semibold">
          {ev >= 0 ? "+" : ""}{ev.toFixed(4)}
        </span>{" "}
        per wager
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="flex flex-col gap-3">
          {slider("win ratio W", p.winRatio, 0.4, 0.95, 0.01, (v) => setP({ ...p, winRatio: v }), pct)}
          {slider("payoff P", p.avgWin, 0.02, 0.5, 0.01, (v) => setP({ ...p, avgWin: v }), (v) => v.toFixed(2))}
          {slider("sell ratio S", p.sellRatio, 0, 0.95, 0.01, (v) => setP({ ...p, sellRatio: v }), pct)}
          {slider("sell take X", p.avgSell, -0.1, 0.3, 0.01, (v) => setP({ ...p, avgSell: v }), (v) => v.toFixed(2))}
          {slider("bet size f", f, 0.01, 0.99, 0.01, setF, pct)}
          <div className="mt-1 flex items-center gap-3">
            <button
              onClick={() => setF(Math.max(0.01, Math.min(kelly.fStar, 0.99)))}
              className="rounded border border-line px-2.5 py-1 font-mono text-[11.5px] text-ink-2 transition-colors hover:border-accent hover:text-ink"
            >
              use f*
            </button>
            <button
              onClick={() => { setP(CANVAS_DEFAULTS); setF(SIM_DEFAULTS.wagerFraction); }}
              className="rounded border border-line px-2.5 py-1 font-mono text-[11.5px] text-ink-2 transition-colors hover:border-accent hover:text-ink"
            >
              reset
            </button>
            <span className="ml-auto font-mono text-[11.5px] text-ink-3">
              median final{" "}
              <span className="text-ink" style={{ color: medianFinal >= SIM.startingCapital ? "var(--ok)" : "var(--danger)" }}>
                {fmtMoney(medianFinal)}
              </span>
            </span>
          </div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-3">
            L is pinned at −1: a resolution loss on a binary market forfeits the
            wager. Loss aversion is why S and X exist.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <canvas
            ref={fanRef}
            className="h-52 w-full cursor-crosshair"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const frac = (e.clientX - r.left - 46) / (r.width - 86);
              setHover(Math.round(Math.min(Math.max(frac, 0), 1) * SIM.numTrades));
            }}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label="Monte Carlo equity fan chart: percentile bands of simulated equity paths over 120 trades"
          />
          <canvas
            ref={kellyRef}
            className="h-24 w-full"
            role="img"
            aria-label="Kelly criterion curve: expected log growth versus bet size, optimal fraction marked"
          />
        </div>
      </div>

      <p className="mt-4 border-t border-line pt-3 text-[11.5px] leading-relaxed text-ink-3">
        This is the console&apos;s actual solver module — closed-form EV, Kelly
        log-growth with ruin detection, mulberry32-seeded Monte Carlo — ported
        unmodified and verified bit-identical against the platform&apos;s test
        suite. Drag things.
      </p>
    </div>
  );
}
