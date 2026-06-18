// Food definitions grounded in the real PKU diet tiers from the spec
// (see ../../game-spec.md and the folder's pku-friendly-products.md).
//
// phe / energy are gameplay deltas applied to the meters on contact, NOT
// real milligram values. They are scaled so the *relationships* match reality:
// high-protein foods spike Phe hard, low-protein staples refuel safely, etc.

import { TIER_COLORS } from "../config";

export type Tier = 1 | 2 | 3 | 4 | 5;

export interface Food {
  id: string;
  label: string;
  tier: Tier;
  color: number;
  phe: number; // delta applied to the Phe meter
  energy: number; // delta applied to the Energy meter
  radius: number;
}

export const FOODS: Record<string, Food> = {
  // Tier 1 - free foods (eat freely): low Phe, modest energy
  apple: { id: "apple", label: "Apple", tier: 1, color: TIER_COLORS[1], phe: 2, energy: 9, radius: 13 },
  carrot: { id: "carrot", label: "Carrot", tier: 1, color: TIER_COLORS[1], phe: 2, energy: 8, radius: 13 },
  banana: { id: "banana", label: "Banana", tier: 1, color: TIER_COLORS[1], phe: 3, energy: 11, radius: 13 },

  // Tier 2 - low-protein staples (the PKU heroes): small Phe, BIG energy
  lpPasta: { id: "lpPasta", label: "Low-protein pasta", tier: 2, color: TIER_COLORS[2], phe: 4, energy: 22, radius: 15 },
  lpBread: { id: "lpBread", label: "Low-protein bread", tier: 2, color: TIER_COLORS[2], phe: 3, energy: 18, radius: 15 },

  // Tier 3 - count carefully: medium Phe, medium energy (tempting!)
  potato: { id: "potato", label: "Potato", tier: 3, color: TIER_COLORS[3], phe: 13, energy: 15, radius: 14 },
  broccoli: { id: "broccoli", label: "Broccoli", tier: 3, color: TIER_COLORS[3], phe: 12, energy: 11, radius: 14 },

  // Tier 4 - high-Phe hazards (the "enemies"): big Phe spike, little energy
  cheese: { id: "cheese", label: "Cheese", tier: 4, color: TIER_COLORS[4], phe: 32, energy: 4, radius: 15 },
  meat: { id: "meat", label: "Meat", tier: 4, color: TIER_COLORS[4], phe: 36, energy: 6, radius: 15 },
  egg: { id: "egg", label: "Egg", tier: 4, color: TIER_COLORS[4], phe: 28, energy: 4, radius: 14 },

  // Tier 5 - formula (power-up): clears Phe + grants the super state
  formula: { id: "formula", label: "Formula", tier: 5, color: TIER_COLORS[5], phe: 0, energy: 0, radius: 16 },
};
