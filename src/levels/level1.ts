// Level 1 - "School Day": a gentle introduction.
// Plenty of safe food, formula available, high-Phe hazards placed in the
// running path so the player learns to JUMP OVER the wrong food.

import { CONFIG } from "../config";

export interface FoodPlacement {
  x: number;
  y: number;
  foodId: string;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
}

export interface Level {
  name: string;
  length: number; // world width in px; goal flag sits near the end
  goalX: number;
  platforms: Platform[];
  foods: FoodPlacement[];
}

const G = CONFIG.groundY;

export const LEVEL1: Level = {
  name: "School Day",
  length: 6600,
  goalX: 6400,

  // Floating platforms (good food often sits up here, rewarding clean jumps).
  platforms: [
    { x: 1150, y: 300, width: 130 },
    { x: 2050, y: 280, width: 130 },
    { x: 3250, y: 300, width: 150 },
    { x: 4350, y: 270, width: 130 },
    { x: 5250, y: 300, width: 150 },
  ],

  foods: [
    // --- Intro: free foods on the ground, easy confidence builders ---
    { x: 500, y: G - 16, foodId: "apple" },
    { x: 720, y: G - 16, foodId: "carrot" },
    { x: 940, y: G - 16, foodId: "banana" },

    // --- Reward jumping: low-protein staple up on a platform ---
    { x: 1150, y: 270, foodId: "lpPasta" },

    // --- First hazard on the ground: must jump over the cheese ---
    { x: 1500, y: G - 16, foodId: "cheese" },
    { x: 1750, y: G - 16, foodId: "apple" },

    // --- Tempting "count carefully" potato right in the path ---
    { x: 2050, y: 250, foodId: "lpBread" },
    { x: 2300, y: G - 16, foodId: "potato" },

    // --- Formula dose #1 (scheduled): a safety net before the harder stretch ---
    { x: 2650, y: G - 16, foodId: "formula" },

    // --- Hazard cluster: two high-Phe items to weave through ---
    { x: 3000, y: G - 16, foodId: "meat" },
    { x: 3250, y: 270, foodId: "lpPasta" },
    { x: 3500, y: G - 16, foodId: "egg" },
    { x: 3750, y: G - 16, foodId: "carrot" },

    // --- Mid refuel ---
    { x: 4050, y: G - 16, foodId: "banana" },
    { x: 4350, y: 240, foodId: "lpBread" },

    // --- Second hazard run ---
    { x: 4650, y: G - 16, foodId: "cheese" },
    { x: 4900, y: G - 16, foodId: "broccoli" },

    // --- Formula dose #2 ---
    { x: 5050, y: G - 16, foodId: "formula" },

    // --- Final stretch: temptation alley before the goal ---
    { x: 5250, y: 270, foodId: "lpPasta" },
    { x: 5500, y: G - 16, foodId: "meat" },
    { x: 5700, y: G - 16, foodId: "apple" },
    { x: 5950, y: G - 16, foodId: "cheese" },
    { x: 6150, y: G - 16, foodId: "banana" },
  ],
};
