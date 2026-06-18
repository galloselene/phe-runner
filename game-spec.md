# PHE Runner — Game Specification (v0.1)

A side-scrolling platform/runner, Game Boy / Super Mario style, that lets players *feel* what living with PKU (phenylketonuria) is like: every bite is a calculation, the diet is a constant balancing act, and the special formula is what keeps you safe.

> This spec turns the "first idea" note into concrete, buildable rules, grounded in the real PKU diet facts in this folder (Phe sources, the good/count/avoid food tiers, the amino-acid formula, and the symptoms of high Phe).

---

## 1. Concept & Goal

- **Genre:** 2D auto-runner / side-scroller, retro 8-bit pixel art, chiptune sound.
- **Player fantasy:** You are a kid with PKU running through a level. You must reach the finish before the timer runs out, while keeping your body in balance by choosing the right foods.
- **The twist vs. a normal runner:** In most runners "eat everything that glows." Here, eating the wrong thing hurts you. The player has to *read and choose* food, exactly like a real PKU family does.
- **Win a level:** Reach the goal flag before the timer ends, with your Phe meter inside the safe zone.
- **Lose a level:** Timer hits zero before the goal, OR the Phe meter stays in the red danger zone too long (overload), OR the Energy meter empties (collapse).

---

## 2. The Core Metaphor (what PKU actually is)

PKU bodies cannot break down **phenylalanine (Phe)**, an amino acid found in protein. Too much Phe is toxic to the brain (headache, fog, irritability, slowed thinking). But the body still needs **energy (calories)** and safe nutrition to keep going. The **amino-acid formula** gives protein and nutrients *without* Phe and is the cornerstone of treatment.

This maps to **two meters**, which is the heart of the design:

| Meter | Real-life meaning | Player must... |
|-------|-------------------|----------------|
| **Phe meter** (top bar) | Phenylalanine in the blood | Keep it inside the green **safe zone** — not too low is fine, but never let it climb into red. |
| **Energy meter** (second bar) | Calories / fuel | Keep it from emptying. Low-protein foods and treats refill it safely. |

> Design choice: the original note used one bar for "level/energy." Splitting it into **Phe** (the danger to manage) and **Energy** (the fuel to maintain) is both more accurate to PKU and better gameplay: the tension is that the *most filling* energy foods are often the *most dangerous* for Phe, just like real life.

---

## 3. Food System (the gameplay engine)

Food items float/sit in the level. The player chooses to grab or dodge them. Each food has a **Phe value** and an **Energy value**, derived from the real tiers in `pku-friendly-products.md` and `nutritional values/`.

### Tier 1 — "Free" foods (eat freely, good)
*Low Phe, modest energy. Safe to collect.*
- Fruits: apple, pear, banana, peach, watermelon, strawberries, orange
- Low-Phe vegetables: carrot, zucchini, pumpkin, tomato, cucumber, sweet potato
- **Effect:** +small Energy, +tiny Phe (almost none). The reliable, safe pick-up.

### Tier 2 — Special low-protein foods (the PKU staples)
*Engineered low-protein versions of normal food. Safe and filling.*
- Aproteic / low-protein pasta, low-protein bread, gluten-free starch-based bread, rice milk, coconut yogurt, fruit jelly cups
- **Effect:** +big Energy, +small Phe. The best way to refuel safely. These are the "good carbs" of the game.

### Tier 3 — "Count carefully" foods (yellow / risky)
*Real but borderline Phe. Tempting because they refill energy fast.*
- Potato, peas, broccoli, cauliflower
- **Effect:** +medium Energy, +medium Phe. Usable in small amounts, dangerous if the Phe meter is already high. Teaches portion counting.

### Tier 4 — High-Phe foods (red / hazards)
*The "enemies." High protein = high Phe = toxic.*
- Meat, fish, eggs, cheese/dairy, nuts, legumes (beans/lentils), regular bread and pasta, milk chocolate
- **Effect:** large Phe spike, small energy. Grabbing one shoots the Phe meter up fast. These should be visually framed as obstacles, not rewards.

### Tier 5 — The Formula (power-up / superpower)
*The amino-acid medical drink (Anamix Junior, Explore 5, GMPro, etc.).*
- **Effect:** This is the hero item. Drinking formula:
  - **Lowers the Phe meter** back toward safe (clears toxicity), AND
  - Grants a **temporary super state**: run faster, jump higher, brief invincibility to one high-Phe hit.
- **Constraint (true to life):** Formula appears on a schedule / limited supply, not infinite. The player must plan around its timing, like real dosing 3x a day. Missing the formula window is risky.

---

## 4. Meter Dynamics & Symptoms (game feel that teaches)

The genius of the design is that **the character's controllability reflects the metabolic state**, so the player *feels* the disease.

### Phe meter too HIGH (red zone) — "Phe overload"
Maps to real high-Phe symptoms (headache, brain fog, irritability, poor coordination):
- **Blurred / dimmed screen** (headache, vision fog)
- **Sluggish, laggy controls** — inputs delayed or character drifts (poor concentration/coordination)
- **Screen wobble / color desaturation**
- If it stays red too long → **overload fail state** (level lost).

### Energy meter too LOW — "running on empty"
- Character slows down, runs more heavily, eventually stumbles.
- If it empties → **collapse fail state**.

### Both meters in good zones — "in balance"
- Character runs cleanly, responsive, bright screen, upbeat music. This is the rewarded "well-managed day."

> Teaching outcome: players internalize that you can't just avoid food (energy crashes) and you can't just eat freely (Phe overload). You manage **both**, with formula as your tool. That is daily life with PKU.

---

## 5. Level Structure

- **Theme:** each level is a "day" or a real-life scenario (school lunch, birthday party, supermarket aisle, restaurant, holiday camp).
- **Layout:** auto-scroll or run-right platforming with food laid out as choices and high-Phe items as moving hazards.
- **Timer:** finish before time runs out (the note's core constraint). Reaching checkpoints adds a little time.
- **Difficulty ramp:**
  - Early levels: lots of free foods, formula readily available, forgiving Phe ceiling.
  - Later levels: tempting high-Phe foods placed in the easy path, scarcer formula, tighter safe zone, party/restaurant temptation everywhere.
- **Boss / special moments (optional):** "the birthday cake" — a giant high-Phe temptation you must navigate around or neutralize with a low-protein alternative.

---

## 6. Controls (LOCKED: Super Mario style)

- **Move / jump** (D-pad + one button), runner-simple.
- **Eating is automatic on contact**, exactly like Mario touching a mushroom. If you run through a food, you eat it.
- **Avoidance is the skill.** The player chooses NOT to eat by: jumping over the item, ducking, or changing route/lane. This is the whole tension: the safe path requires reading the level and steering around high-Phe foods, the same way a PKU family steers around the wrong foods in real life.
- **Use formula** button to drink a held formula charge on demand.

> Design note: contact-eat makes high-Phe foods feel like genuine hazards you must dodge, and rewards good positioning. The lesson lands through level design (where the bad food sits, how tempting the easy path is), not through a menu choice.

## 7. Scoring & Progression

- **Score** rewards *balance*, not gorging: bonus for time spent in the safe Phe zone, penalty for time in red.
- **Stars per level** (1–3) based on: finished in time, Phe stayed safe, energy never collapsed.
- **Collectibles:** recipe cards / real PKU-friendly products unlock as you find their in-game versions (ties to the real product list).
- **Unlockables:** new characters, low-protein "recipes," cosmetic outfits.

---

## 8. Look & Feel

- **Art:** 8-bit / Game Boy palette, chunky pixel sprites, friendly kid character.
- **Food sprites:** instantly readable, color-coded by tier (green = free, blue = low-protein staple, yellow = count, red = high-Phe, golden/glowing = formula).
- **Audio:** chiptune; music distorts/slows when Phe goes red, brightens when balanced.
- **Tone:** empowering, not scary. The message is "you can do this, the formula is your friend, smart choices win."

---

## 9. Educational & Real-World Tie-ins (optional, high value)

- Each food sprite can show its real approximate Phe/protein value on pickup (sourced from this folder's data).
- Levels modeled on real scenarios already documented here (school menu, camp menu, supermarket).
- A "free play / sandbox" mode with no timer for younger kids to just learn foods.
- Could be paired with the existing PHE apps (food finder, barcode scanner) as a family-of-tools ecosystem.

---

## 10. Decisions (LOCKED)

1. **Audience:** broader public. This is an **awareness / empathy tool** so anyone can feel what daily PKU choices are like. Tone stays accessible, no medical jargon required to play; the learning is in the experience, with optional info layers for the curious.
2. **Meters:** two bars (Phe + Energy), as in Section 2.
3. **Eating:** Super Mario style. Contact = eat. Player avoids by jumping over, rerouting, or changing lane (see Section 6).
4. **Formula:** both. It appears on a **schedule** in the level (your dosing windows) AND is **used on demand** as a power-up. Plan around when it shows up; spend it when you most need to clear Phe or get the speed boost.
5. **Platform & engine:** web. Build on the existing React/Vite stack used elsewhere in this folder, with a 2D game layer (recommend **Phaser** mounted inside React, or an HTML5 canvas game loop). Runs in any browser, easy to share for an awareness tool.
6. **Scope of v1 (MVP):** 1 character, **2 levels**, both meters, all 5 food tiers, formula power-up (scheduled + on-demand), win/lose states. Everything else is post-MVP.

---

## 11. MVP Definition (smallest playable, true-to-message build)

- **2 runnable levels** with auto-scroll + jump (e.g. Level 1 "School Day" gentle, Level 2 "Birthday Party" with more high-Phe temptation).
- Web build: React/Vite shell + Phaser (or canvas) game layer.
- 1 playable character.
- Two meters (Phe + Energy) with safe/danger zones.
- Contact-eat; avoidance via jump/reroute.
- All 5 food tiers, at least 2 sprites each.
- Formula power-up: appears on a schedule AND usable on demand; lowers Phe, refuels Energy, and grants the speed boost.
- High-Phe symptom effect (screen blur + control lag) when Phe goes red.
- Timer, goal flag, win/lose screens.
- 3-star scoring based on Phe-in-safe-zone time.

If a player finishes those two levels and *understands why they shouldn't have grabbed the cheese*, the game works.

---

## 12. Implementation Notes (v0.1 build, as built)

What actually exists in `phevideogame/` and where it differs from the plan above.

### Stack (one deviation from the LOCKED engine choice)
- **Vite + TypeScript + Phaser 3**, pure (no React shell yet). The game canvas is the whole app for the MVP, so wrapping it in React added no value for now. Mounting the canvas inside a React component later is trivial when menus/UI are needed.
- All graphics are **code-generated** (tinted discs + emoji faces, no art assets), so the build runs with zero binary dependencies.
- Dev server: `bun install` then `bun run dev` → http://localhost:5180/

### File map
- `src/config.ts` - all tuning knobs (meters, speed, formula, zones).
- `src/data/foods.ts` - the 5 food tiers with Phe/Energy deltas.
- `src/levels/level1.ts` - "School Day" layout (platforms, food placements, goal).
- `src/scenes/GameScene.ts` - the full game loop.
- `src/main.ts` - Phaser config (arcade physics).

### Formula = triple effect (updated)
Drinking a formula charge now does three things at once, making it the clear hero item and a real timing decision (drink on grab vs. hold for max value):
1. **Lowers Phe** (clears toxicity).
2. **Refuels Energy substantially** (the formula carries real nutrition, true to PKU life).
3. **Grants the super state** (speed boost + immunity to high-Phe hits while glowing).

### Current balance values (tuned via playtesting, all in `src/config.ts`)
| Knob | Value | Notes |
|------|-------|-------|
| Phe start / safe / warn | 22 / ≤60 / ≤80 | >80 = red danger zone |
| Phe natural decay | 1.6 / sec | body slowly clears Phe |
| Red-zone fail time | 6 sec | total time in red before overload loss |
| Energy start | 72 | |
| Energy decay | 4.5 / sec | tuned middle ground (felt too easy at 3.2, too harsh at 6.5) |
| Energy low threshold | 25 | below this the character slows |
| Formula Phe drop | 30 | |
| Formula energy gain | 40 | a dose is a major refuel |
| Formula boost | 1.7x for 5 sec | speed/jump + high-Phe immunity |
| Player run speed | 205 px/s | |
| Round timer | 75 sec | |

> These are the live dials. Energy decay and formula energy gain are the two most sensitive to game feel; adjust those first when tuning difficulty.

### Status
- **Level 1 ("School Day"): built and running.**
- Level 2 ("Birthday Party"): not yet built; `level1.ts` is the template to copy.
