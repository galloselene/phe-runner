// Central tuning knobs for PHE Runner.
// Everything that affects game feel or balance lives here so it is easy to tweak.

export const CONFIG = {
  // Canvas / world
  width: 800,
  height: 450,
  gravity: 1200,
  groundY: 400, // top of the ground strip

  // Player movement
  playerSpeed: 205, // base auto-run speed (px/s)
  jumpVelocity: -540,

  // Meters (both run 0..100)
  meterMax: 100,

  phe: {
    start: 22,
    decayPerSec: 1.6, // body slowly clears Phe over time
    safeMax: 60, // <= this = green safe zone
    warnMax: 80, // safeMax..warnMax = yellow caution
    // > warnMax = red danger
    redFailSeconds: 6, // total time allowed in the red before overload fail
  },

  energy: {
    start: 72,
    decayPerSec: 4.5, // running burns fuel
    lowThreshold: 25, // below this the character slows / struggles
  },

  formula: {
    pheDrop: 30, // how much a dose clears the Phe meter
    energyGain: 40, // a dose also refuels energy substantially
    boostMs: 5000, // super state duration
    boostMultiplier: 1.7, // speed/jump multiplier while boosted
  },

  // Level / round
  timerSeconds: 75,
} as const;

// Tier colors (used for code-generated sprites and the legend).
export const TIER_COLORS: Record<number, number> = {
  1: 0x6ab04c, // free foods - green
  2: 0x4a90d9, // low-protein staples - blue
  3: 0xf0c419, // count carefully - yellow
  4: 0xe74c3c, // high-Phe hazards - red
  5: 0xf6c945, // formula - gold (rendered with a glow)
};
