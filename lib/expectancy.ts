/**
 * expectancy.ts — self-contained port of the trading-platform expectancy
 * solver math. Zero imports, pure functions, no React/DOM.
 *
 * Ported from:
 *   trading-platform/web/src/lib/expectancy/types.ts      (params + defaults)
 *   trading-platform/web/src/lib/expectancy/ev.ts         (closed-form EV)
 *   trading-platform/web/src/lib/expectancy/kelly.ts      (log-growth + Kelly curve)
 *   trading-platform/web/src/lib/expectancy/rng.ts        (mulberry32 PRNG)
 *   trading-platform/web/src/lib/expectancy/montecarlo.ts (paths + quantile bands)
 *
 * Deliberately NOT ported (noted deviations from the source module):
 *   - seed.ts / seedFromAnalysis — needs live analysis-endpoint data.
 *   - frontier.ts frontierGrid, and montecarlo.ts mcStats / perceivedWinRate /
 *     meanDrift — dashboard-specific helpers outside the essential math.
 * Everything that IS here keeps the source formulas and edge cases identical.
 */

/* ------------------------------------------------------------------------ */
/* Source: trading-platform/web/src/lib/expectancy/types.ts                 */
/* ------------------------------------------------------------------------ */

/* The five glossary parameters + simulation setup. All rates are FRACTIONS
   internally (0..1, losses negative: avgLoss = -1 means the whole wager);
   the UI converts to % at the edge, never in here. */

export interface SolverParams {
  /** W — resolved bets won ÷ total resolved bets */
  winRatio: number;
  /** P — average profit on a winning bet, as a fraction of the wager */
  avgWin: number;
  /** L — average loss as a fraction of the wager (negative; resolution bet = -1) */
  avgLoss: number;
  /** S — fraction of positions sold early (take-profit / cut-loss) before resolution */
  sellRatio: number;
  /** X — average profit realized from an early sell, as a fraction of the wager */
  avgSell: number;
}

export interface SimParams {
  startingCapital: number;
  /** f — fraction of current capital wagered per trade (0..1) */
  wagerFraction: number;
  numTrades: number;
  numPaths: number;
  seed: number;
}

export const CANVAS_DEFAULTS: SolverParams = {
  winRatio: 0.75,
  avgWin: 0.15,
  avgLoss: -1,
  sellRatio: 0.8,
  avgSell: 0.15,
};

export const SIM_DEFAULTS: SimParams = {
  startingCapital: 10_000,
  wagerFraction: 0.1,
  numTrades: 100,
  numPaths: 100,
  seed: 1337,
};

/* ------------------------------------------------------------------------ */
/* Source: trading-platform/web/src/lib/expectancy/ev.ts                    */
/* ------------------------------------------------------------------------ */

/** EV = W·(1−S)·P + (1−W)·(1−S)·L + S·X — expected return per wager. */
export function computeEV(p: SolverParams): number {
  const hold = 1 - p.sellRatio;
  return (
    p.winRatio * hold * p.avgWin +
    (1 - p.winRatio) * hold * p.avgLoss +
    p.sellRatio * p.avgSell
  );
}

/** Probability a position reaches resolution and wins / loses. */
export function terminalProbs(p: SolverParams): { terminalWin: number; terminalLoss: number } {
  const hold = 1 - p.sellRatio;
  return { terminalWin: p.winRatio * hold, terminalLoss: (1 - p.winRatio) * hold };
}

/* ------------------------------------------------------------------------ */
/* Source: trading-platform/web/src/lib/expectancy/kelly.ts                 */
/* ------------------------------------------------------------------------ */

/* The three possible per-trade returns and their probabilities. */
function outcomes(p: SolverParams): Array<{ r: number; w: number }> {
  const hold = 1 - p.sellRatio;
  return [
    { r: p.avgWin, w: p.winRatio * hold },
    { r: p.avgLoss, w: (1 - p.winRatio) * hold },
    { r: p.avgSell, w: p.sellRatio },
  ];
}

/** Expected log growth per trade at wager fraction f:
 *  g(f) = Σ wᵢ·ln(1 + f·rᵢ); −Infinity once any reachable outcome wipes the
 *  stake (1 + f·r ≤ 0) — with L = −100% that happens at f = 1. */
export function logGrowth(p: SolverParams, f: number): number {
  let g = 0;
  for (const { r, w } of outcomes(p)) {
    if (w <= 0) continue;
    const m = 1 + f * r;
    if (m <= 0) return -Infinity;
    g += w * Math.log(m);
  }
  return g;
}

export interface KellyCurve {
  fs: Float64Array;
  gs: Float64Array;
  /** argmax of g — the optimal wager fraction */
  fStar: number;
  gStar: number;
  /** largest representable f on the curve (capped below stake-wipe) */
  fMax: number;
}

const CAP = 0.999;

/** Sweep g(f) over [0, fMax] and refine the argmax by golden section.
 *  g'(0) = EV, so a non-positive EV pins f* at 0.
 *
 *  Signature deviation from the source: the source takes
 *  `opts: { steps?: number }`; here `points` is that steps count directly
 *  (curve has points+1 samples, exactly as in the source). fMax caps below the
 *  stake-wipe fraction, so with L = −1 the sweep covers [0, 0.999] ⊂ [0, 1];
 *  beyond fMax, g is −Infinity (ruin) by logGrowth's own edge case. */
export function kellyCurve(p: SolverParams, points: number = 400): KellyCurve {
  const steps = points;
  const worst = Math.min(p.avgWin, p.avgLoss, p.avgSell);
  const fMax = worst < 0 ? Math.min(CAP / -worst, CAP) : CAP;

  const fs = new Float64Array(steps + 1);
  const gs = new Float64Array(steps + 1);
  let bestI = 0;
  for (let i = 0; i <= steps; i++) {
    const f = (fMax * i) / steps;
    fs[i] = f;
    const g = logGrowth(p, f);
    gs[i] = g;
    if (g > (gs[bestI] as number)) bestI = i;
  }

  if (computeEV(p) <= 0) return { fs, gs, fStar: 0, gStar: 0, fMax };

  // golden-section refine inside the bracket around the grid argmax
  let lo = fs[Math.max(0, bestI - 1)] as number;
  let hi = fs[Math.min(steps, bestI + 1)] as number;
  const phi = (Math.sqrt(5) - 1) / 2;
  let a = hi - phi * (hi - lo);
  let b = lo + phi * (hi - lo);
  let ga = logGrowth(p, a);
  let gb = logGrowth(p, b);
  for (let it = 0; it < 60 && hi - lo > 1e-10; it++) {
    if (ga < gb) {
      lo = a;
      a = b;
      ga = gb;
      b = lo + phi * (hi - lo);
      gb = logGrowth(p, b);
    } else {
      hi = b;
      b = a;
      gb = ga;
      a = hi - phi * (hi - lo);
      ga = logGrowth(p, a);
    }
  }
  const fStar = (lo + hi) / 2;
  return { fs, gs, fStar, gStar: logGrowth(p, fStar), fMax };
}

/* ------------------------------------------------------------------------ */
/* Source: trading-platform/web/src/lib/expectancy/rng.ts (copied exactly)  */
/* ------------------------------------------------------------------------ */

/** mulberry32 — tiny deterministic PRNG. Same seed ⇒ byte-identical Monte
 *  Carlo runs, which is what makes the fan chart stable while sliders drag. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------------ */
/* Source: trading-platform/web/src/lib/expectancy/montecarlo.ts            */
/* ------------------------------------------------------------------------ */

export interface MonteCarloResult {
  /** equity[step * numPaths + path], step 0 = starting capital; flat layout
   *  so the fan chart can stream it straight into canvas polylines */
  equity: Float64Array;
  finals: Float64Array;
  /** per-path max peak-to-trough drawdown, as a positive fraction */
  maxDrawdowns: Float64Array;
  /** per-path lowest equity seen (ruin detection) */
  minEquity: Float64Array;
  /** outcomes[trade * numPaths + path]: 0 = terminal loss, 1 = terminal win, 2 = sold early */
  outcomes: Uint8Array;
  numPaths: number;
  numTrades: number;
}

/** Walk each path trade by trade: with prob S the position is sold early at X;
 *  otherwise it resolves — win P with prob W, else lose L. Capital compounds
 *  by 1 + f·R per trade.
 *
 *  Kept the source's SimParams naming: `numPaths`/`numTrades`/`seed`/
 *  `startingCapital` (a.k.a. paths/steps/seed/startEquity) plus
 *  `wagerFraction` (f), which the sizing math cannot do without. */
export function monteCarloPaths(p: SolverParams, sim: SimParams): MonteCarloResult {
  const { numTrades, numPaths, startingCapital, wagerFraction: f } = sim;
  const rand = mulberry32(sim.seed);
  const equity = new Float64Array((numTrades + 1) * numPaths);
  const outcomes = new Uint8Array(numTrades * numPaths);
  const finals = new Float64Array(numPaths);
  const maxDrawdowns = new Float64Array(numPaths);
  const minEquity = new Float64Array(numPaths);

  for (let path = 0; path < numPaths; path++) {
    let capital = startingCapital;
    let peak = capital;
    let maxDd = 0;
    let low = capital;
    equity[path] = capital;
    for (let t = 0; t < numTrades; t++) {
      let r: number;
      if (rand() < p.sellRatio) {
        r = p.avgSell;
        outcomes[t * numPaths + path] = 2;
      } else if (rand() < p.winRatio) {
        r = p.avgWin;
        outcomes[t * numPaths + path] = 1;
      } else {
        r = p.avgLoss;
        outcomes[t * numPaths + path] = 0;
      }
      capital *= 1 + f * r;
      equity[(t + 1) * numPaths + path] = capital;
      if (capital > peak) peak = capital;
      const dd = (peak - capital) / peak;
      if (dd > maxDd) maxDd = dd;
      if (capital < low) low = capital;
    }
    finals[path] = capital;
    maxDrawdowns[path] = maxDd;
    minEquity[path] = low;
  }
  return { equity, finals, maxDrawdowns, minEquity, outcomes, numPaths, numTrades };
}

/** Linear-interpolated quantile of an ascending-sorted array (exported here;
 *  module-private in the source). q in [0, 1]. */
export function quantileSorted(sorted: Float64Array, q: number): number {
  if (sorted.length === 0) return NaN;
  const pos = q * (sorted.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  const frac = pos - lo;
  return (sorted[lo] as number) * (1 - frac) + (sorted[hi] as number) * frac;
}

/** The fan-band quantiles: p10/p25/p50/p75/p90. */
export const FAN_QS: readonly number[] = [0.1, 0.25, 0.5, 0.75, 0.9];

/** Per-step equity quantiles. Returns bands[step * qs.length + i].
 *  Deviation from the source: default qs is FAN_QS (p10/p25/p50/p75/p90)
 *  instead of the source's [0.1, 0.5, 0.9]; the computation is identical. */
export function percentileBands(
  r: MonteCarloResult,
  qs: readonly number[] = FAN_QS,
): Float64Array {
  const steps = r.numTrades + 1;
  const bands = new Float64Array(steps * qs.length);
  const scratch = new Float64Array(r.numPaths);
  for (let s = 0; s < steps; s++) {
    scratch.set(r.equity.subarray(s * r.numPaths, (s + 1) * r.numPaths));
    scratch.sort();
    for (let i = 0; i < qs.length; i++) {
      bands[s * qs.length + i] = quantileSorted(scratch, qs[i] as number);
    }
  }
  return bands;
}

/* ------------------------------------------------------------------------ */
/* Self-checks — expected values from the original test suite               */
/* (trading-platform/web/src/lib/expectancy/expectancy.test.ts), all        */
/* re-verified against this port:                                           */
/*                                                                          */
/* 1. computeEV(CANVAS_DEFAULTS) === 0.0925                                 */
/*    (W=0.75, P=+0.15, L=−1, S=0.8, X=+0.15 →                              */
/*     0.15·0.15 − 0.05·1 + 0.8·0.15)                                       */
/* 2. terminalProbs(CANVAS_DEFAULTS) → terminalWin = 0.15 (W·(1−S)),        */
/*    terminalLoss = 0.05 ((1−W)·(1−S))                                     */
/* 3. computeEV({...CANVAS_DEFAULTS, sellRatio: 1}) === 0.15 (S=1 ⇒ EV=X);  */
/*    computeEV({...CANVAS_DEFAULTS, sellRatio: 0, winRatio: 1}) === 0.15   */
/* 4. logGrowth(CANVAS_DEFAULTS, 0) === 0;                                  */
/*    logGrowth(CANVAS_DEFAULTS, 1) === -Infinity (stake wipe at L=−100%)   */
/* 5. kellyCurve(CANVAS_DEFAULTS).fStar ≈ 0.619 (test asserts 0.6..0.64);   */
/*    fStar === 0 when EV ≤ 0 (e.g. winRatio 0.2, sellRatio 0.1)            */
/* 6. monteCarloPaths(CANVAS_DEFAULTS, SIM_DEFAULTS) is bit-identical for   */
/*    the same seed (1337) and diverges for seed 42; with wagerFraction 0   */
/*    every equity value stays exactly 10 000                               */
/* ------------------------------------------------------------------------ */
