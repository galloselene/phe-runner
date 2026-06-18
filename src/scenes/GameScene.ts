import Phaser from "phaser";
import { CONFIG, TIER_COLORS } from "../config";
import { FOODS, type Food } from "../data/foods";
import { LEVEL1, type Level } from "../levels/level1";

// Emoji faces give instant readability without art assets.
const EMOJI: Record<string, string> = {
  apple: "🍎", carrot: "🥕", banana: "🍌",
  lpPasta: "🍝", lpBread: "🍞",
  potato: "🥔", broccoli: "🥦",
  cheese: "🧀", meat: "🍖", egg: "🥚",
  formula: "🥤",
};

export default class GameScene extends Phaser.Scene {
  private level!: Level;

  private player!: Phaser.Physics.Arcade.Sprite;
  private foodsGroup!: Phaser.Physics.Arcade.Group;
  private solids!: Phaser.Physics.Arcade.StaticGroup;

  // Meters & round state
  private phe: number = CONFIG.phe.start;
  private energy: number = CONFIG.energy.start;
  private timeLeft: number = CONFIG.timerSeconds;
  private redTime = 0; // seconds spent in the red Phe zone
  private elapsed = 0;
  private safeTime = 0; // seconds spent in the green Phe zone
  private formulaCharges = 0;
  private boostUntil = 0;
  private gameOver = false;

  // HUD
  private hud!: Phaser.GameObjects.Graphics;
  private hudText!: Phaser.GameObjects.Text;
  private redOverlay!: Phaser.GameObjects.Rectangle;
  private blurFx?: Phaser.FX.Blur;

  // Input
  private keyJump!: Phaser.Input.Keyboard.Key;
  private keyJump2!: Phaser.Input.Keyboard.Key;
  private keyFormula!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("GameScene");
  }

  create() {
    this.level = LEVEL1;
    this.resetState();
    this.makeTextures();

    const { width, height } = CONFIG;
    this.physics.world.setBounds(0, 0, this.level.length, height);
    this.cameras.main.setBounds(0, 0, this.level.length, height);
    this.cameras.main.setBackgroundColor("#9bd6ef");

    this.buildWorld();
    this.buildPlayer();
    this.buildFoods();
    this.buildHud();
    this.bindInput();

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setFollowOffset(-120, 60);

    // Red-zone symptom: a screen-wide blur applied to the camera.
    if (this.cameras.main.postFX) {
      this.blurFx = this.cameras.main.postFX.addBlur(0, 1, 1, 0);
    }
    void width;
  }

  private resetState() {
    this.phe = CONFIG.phe.start;
    this.energy = CONFIG.energy.start;
    this.timeLeft = CONFIG.timerSeconds;
    this.redTime = 0;
    this.elapsed = 0;
    this.safeTime = 0;
    this.formulaCharges = 0;
    this.boostUntil = 0;
    this.gameOver = false;
  }

  // ---- Code-generated textures (no asset files needed for the MVP) ----
  private makeTextures() {
    // Soft white disc, tinted per food tier.
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(40, 40, 38);
    g.generateTexture("disc", 80, 80);
    g.clear();

    // Player body.
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(0, 0, 30, 40, 8);
    g.generateTexture("player", 30, 40);
    g.clear();

    // Ground + platform tiles.
    g.fillStyle(0x7a5230, 1);
    g.fillRect(0, 0, 64, 64);
    g.fillStyle(0x5a8d3a, 1);
    g.fillRect(0, 0, 64, 12);
    g.generateTexture("ground", 64, 64);
    g.clear();

    g.fillStyle(0x8a6240, 1);
    g.fillRoundedRect(0, 0, 64, 18, 6);
    g.fillStyle(0x6aa34a, 1);
    g.fillRoundedRect(0, 0, 64, 7, 6);
    g.generateTexture("platform", 64, 18);
    g.destroy();
  }

  private buildWorld() {
    const { groundY, height } = CONFIG;

    // Visual ground (tiled) + static collision body.
    this.add
      .tileSprite(0, groundY, this.level.length, height - groundY, "ground")
      .setOrigin(0, 0);

    this.solids = this.physics.add.staticGroup();
    const groundBody = this.add.rectangle(
      this.level.length / 2,
      groundY + (height - groundY) / 2,
      this.level.length,
      height - groundY,
    );
    this.physics.add.existing(groundBody, true);
    this.solids.add(groundBody);
    groundBody.setVisible(false);

    // Platforms.
    for (const p of this.level.platforms) {
      const tile = this.add
        .tileSprite(p.x, p.y, p.width, 18, "platform")
        .setOrigin(0, 0);
      const body = this.add.rectangle(p.x + p.width / 2, p.y + 9, p.width, 18);
      this.physics.add.existing(body, true);
      this.solids.add(body);
      body.setVisible(false);
      void tile;
    }

    // Goal flag.
    this.add
      .text(this.level.goalX, groundY - 70, "🏁", { fontSize: "56px" })
      .setOrigin(0.5, 1);
  }

  private buildPlayer() {
    const { groundY } = CONFIG;
    this.player = this.physics.add.sprite(80, groundY - 80, "player");
    this.player.setTint(0x2d3561);
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(30, 40);
    this.physics.add.collider(this.player, this.solids);
  }

  private buildFoods() {
    this.foodsGroup = this.physics.add.group({ allowGravity: false, immovable: true });

    for (const placement of this.level.foods) {
      const def = FOODS[placement.foodId];
      if (!def) continue;

      const sprite = this.foodsGroup.create(placement.x, placement.y, "disc") as Phaser.Physics.Arcade.Sprite;
      sprite.setDisplaySize(def.radius * 2, def.radius * 2);
      sprite.setTint(def.color);
      sprite.setData("food", def);
      (sprite.body as Phaser.Physics.Arcade.Body).setCircle(40, 0, 0); // texture-space radius

      // Emoji face overlay, follows the world.
      const face = this.add
        .text(placement.x, placement.y, EMOJI[def.id] ?? "?", {
          fontSize: `${Math.round(def.radius * 1.4)}px`,
        })
        .setOrigin(0.5);
      sprite.setData("face", face);

      // Formula gets a gentle pulse so it reads as the special item.
      if (def.tier === 5) {
        this.tweens.add({
          targets: [sprite, face],
          scale: { from: 1, to: 1.18 },
          duration: 500,
          yoyo: true,
          repeat: -1,
        });
      }
    }

    this.physics.add.overlap(this.player, this.foodsGroup, (_p, f) => {
      this.eat(f as Phaser.Physics.Arcade.Sprite);
    });
  }

  private eat(sprite: Phaser.Physics.Arcade.Sprite) {
    const def = sprite.getData("food") as Food;
    const face = sprite.getData("face") as Phaser.GameObjects.Text | undefined;

    if (def.tier === 5) {
      // Formula = collect a charge (used on demand with F).
      this.formulaCharges += 1;
      this.flash(sprite.x, sprite.y, "+formula", "#ffd34d");
    } else {
      const boosted = this.time.now < this.boostUntil;
      const isHazard = def.tier === 4;
      // While boosted you are protected from high-Phe spikes (the super state).
      const pheGain = boosted && isHazard ? 0 : def.phe;
      this.phe = Phaser.Math.Clamp(this.phe + pheGain, 0, CONFIG.meterMax);
      this.energy = Phaser.Math.Clamp(this.energy + def.energy, 0, CONFIG.meterMax);

      const color = isHazard ? "#ff5a4d" : def.tier === 3 ? "#f0c419" : "#7CFC9B";
      const sign = pheGain > 0 ? `+${pheGain} Phe` : isHazard ? "blocked!" : `+${def.energy} energy`;
      this.flash(sprite.x, sprite.y, sign, color);
    }

    face?.destroy();
    sprite.destroy();
  }

  private flash(x: number, y: number, text: string, color: string) {
    const t = this.add
      .text(x, y - 18, text, { fontSize: "14px", color, fontStyle: "bold" })
      .setOrigin(0.5);
    this.tweens.add({
      targets: t,
      y: y - 50,
      alpha: 0,
      duration: 700,
      onComplete: () => t.destroy(),
    });
  }

  private buildHud() {
    this.hud = this.add.graphics().setScrollFactor(0).setDepth(100);
    this.hudText = this.add
      .text(16, 64, "", { fontSize: "13px", color: "#ffffff", fontFamily: "monospace" })
      .setScrollFactor(0)
      .setDepth(101);
    this.add
      .text(CONFIG.width / 2, CONFIG.height - 18, "→ auto-run   SPACE/↑ jump   F drink formula", {
        fontSize: "12px",
        color: "#10324a",
        fontFamily: "monospace",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101);

    this.redOverlay = this.add
      .rectangle(0, 0, CONFIG.width, CONFIG.height, 0xc0392b)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setAlpha(0)
      .setDepth(99);
  }

  private bindInput() {
    const kb = this.input.keyboard!;
    this.keyJump = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyJump2 = kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyFormula = kb.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.input.on("pointerdown", () => this.tryJump());
  }

  private tryJump() {
    if (this.gameOver) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (!body.blocked.down && !body.touching.down) return;

    // Symptom: when Phe is in the red, jumps sometimes fail to register
    // (poor coordination / sluggish response).
    const redness = this.redness();
    if (redness > 0 && Math.random() < redness * 0.45) {
      return;
    }
    const boosted = this.time.now < this.boostUntil;
    this.player.setVelocityY(CONFIG.jumpVelocity * (boosted ? 1.12 : 1));
  }

  private redness(): number {
    return Phaser.Math.Clamp(
      (this.phe - CONFIG.phe.warnMax) / (CONFIG.meterMax - CONFIG.phe.warnMax),
      0,
      1,
    );
  }

  update(_time: number, delta: number) {
    if (this.gameOver) return;
    const dt = delta / 1000;
    this.elapsed += dt;

    // --- Passive meter dynamics ---
    this.phe = Phaser.Math.Clamp(this.phe - CONFIG.phe.decayPerSec * dt, 0, CONFIG.meterMax);
    this.energy = Phaser.Math.Clamp(this.energy - CONFIG.energy.decayPerSec * dt, 0, CONFIG.meterMax);
    this.timeLeft -= dt;

    // Track time in zones (for scoring + fail).
    if (this.phe <= CONFIG.phe.safeMax) this.safeTime += dt;
    const redness = this.redness();
    if (redness > 0) this.redTime += dt;
    else this.redTime = Math.max(0, this.redTime - dt * 0.5); // recover slowly out of red

    // --- Movement: auto-run right, modulated by state ---
    const boosted = this.time.now < this.boostUntil;
    const lowEnergy = this.energy <= CONFIG.energy.lowThreshold;
    let speed = CONFIG.playerSpeed;
    if (boosted) speed *= CONFIG.formula.boostMultiplier;
    if (lowEnergy) speed *= 0.55; // running on empty
    speed *= 1 - redness * 0.25; // brain fog slows you a little
    this.player.setVelocityX(speed);

    // Jump input (keyboard, edge-triggered).
    if (
      Phaser.Input.Keyboard.JustDown(this.keyJump) ||
      Phaser.Input.Keyboard.JustDown(this.keyJump2)
    ) {
      this.tryJump();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyFormula)) {
      this.useFormula();
    }

    // --- Symptom feedback ---
    this.redOverlay.setAlpha(redness * 0.32);
    if (this.blurFx) this.blurFx.strength = redness * 1.8;
    if (redness > 0.6 && Math.random() < 0.04) {
      this.cameras.main.shake(120, 0.004 * redness);
    }

    this.drawHud(boosted, lowEnergy);

    // --- Win / lose checks ---
    if (this.player.x >= this.level.goalX) return this.win();
    if (this.timeLeft <= 0) return this.lose("Time ran out before the finish!");
    if (this.energy <= 0) return this.lose("Energy collapsed - you ran out of fuel.");
    if (this.redTime >= CONFIG.phe.redFailSeconds) {
      return this.lose("Phe overload - too long in the danger zone.");
    }
  }

  private useFormula() {
    if (this.formulaCharges <= 0) {
      this.flash(this.player.x, this.player.y - 30, "no formula!", "#ffffff");
      return;
    }
    this.formulaCharges -= 1;
    this.phe = Phaser.Math.Clamp(this.phe - CONFIG.formula.pheDrop, 0, CONFIG.meterMax);
    this.energy = Phaser.Math.Clamp(this.energy + CONFIG.formula.energyGain, 0, CONFIG.meterMax);
    this.boostUntil = this.time.now + CONFIG.formula.boostMs;
    this.flash(this.player.x, this.player.y - 30, "SUPER!", "#ffd34d");
    this.cameras.main.flash(180, 255, 230, 120);
  }

  // ---- HUD drawing ----
  private drawHud(boosted: boolean, lowEnergy: boolean) {
    const g = this.hud;
    g.clear();

    // Panel backdrop
    g.fillStyle(0x000000, 0.35);
    g.fillRoundedRect(8, 8, 360, 80, 8);

    this.drawPheBar(g, 16, 16, 300, 18);
    this.drawBar(g, 16, 42, 300, 14, this.energy / CONFIG.meterMax,
      lowEnergy ? 0xe67e22 : 0x2ecc71, 0x143b2a);

    const progress = Math.floor((this.player.x / this.level.goalX) * 100);
    const boostTxt = boosted ? "  ⚡SUPER" : "";
    this.hudText.setText(
      `Phe ${Math.round(this.phe)}   Energy ${Math.round(this.energy)}   ` +
        `Formula x${this.formulaCharges}\n` +
        `Time ${Math.max(0, this.timeLeft).toFixed(1)}s   ${progress}%${boostTxt}`,
    );
  }

  private drawBar(
    g: Phaser.GameObjects.Graphics,
    x: number, y: number, w: number, h: number,
    frac: number, fill: number, bg: number,
  ) {
    g.fillStyle(bg, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.fillStyle(fill, 1);
    g.fillRoundedRect(x, y, Math.max(2, w * frac), h, 4);
    g.lineStyle(2, 0xffffff, 0.7);
    g.strokeRoundedRect(x, y, w, h, 4);
  }

  private drawPheBar(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    // Zone backdrop: green / yellow / red.
    const safeW = (CONFIG.phe.safeMax / CONFIG.meterMax) * w;
    const warnW = (CONFIG.phe.warnMax / CONFIG.meterMax) * w;
    g.fillStyle(TIER_COLORS[1], 0.35);
    g.fillRect(x, y, safeW, h);
    g.fillStyle(TIER_COLORS[3], 0.35);
    g.fillRect(x + safeW, y, warnW - safeW, h);
    g.fillStyle(TIER_COLORS[4], 0.35);
    g.fillRect(x + warnW, y, w - warnW, h);

    // Fill marker for current Phe.
    const frac = this.phe / CONFIG.meterMax;
    let color = TIER_COLORS[1];
    if (this.phe > CONFIG.phe.warnMax) color = TIER_COLORS[4];
    else if (this.phe > CONFIG.phe.safeMax) color = TIER_COLORS[3];
    g.fillStyle(color, 1);
    g.fillRoundedRect(x, y, Math.max(2, w * frac), h, 4);

    g.lineStyle(2, 0xffffff, 0.85);
    g.strokeRoundedRect(x, y, w, h, 4);
  }

  // ---- End states ----
  private win() {
    this.gameOver = true;
    this.player.setVelocity(0, 0);
    const ratio = this.safeTime / Math.max(1, this.elapsed);
    const safeAtFinish = this.phe <= CONFIG.phe.warnMax;
    let stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
    if (!safeAtFinish) stars = Math.min(stars, 1);
    this.showEnd(
      "LEVEL COMPLETE!",
      `${"⭐".repeat(stars)}${"·".repeat(3 - stars)}\n` +
        `In the safe zone ${Math.round(ratio * 100)}% of the run.`,
      0x1e824c,
    );
  }

  private lose(reason: string) {
    this.gameOver = true;
    this.player.setVelocity(0, 0);
    this.showEnd("GAME OVER", reason, 0x922b21);
  }

  private showEnd(title: string, subtitle: string, color: number) {
    // Clear any active Phe-overload symptoms so the end screen is crisp.
    if (this.blurFx) this.blurFx.strength = 0;
    this.redOverlay.setAlpha(0);
    this.cameras.main.resetFX();

    const { width, height } = CONFIG;
    const panel = this.add
      .rectangle(width / 2, height / 2, width, height, color, 0.82)
      .setScrollFactor(0)
      .setDepth(200);
    void panel;
    this.add
      .text(width / 2, height / 2 - 50, title, {
        fontSize: "40px", color: "#ffffff", fontStyle: "bold", fontFamily: "monospace",
      })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);
    this.add
      .text(width / 2, height / 2 + 12, subtitle, {
        fontSize: "16px", color: "#ffffff", align: "center", fontFamily: "monospace",
      })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);
    this.add
      .text(width / 2, height / 2 + 70, "Press SPACE to play again", {
        fontSize: "15px", color: "#ffe9a8", fontFamily: "monospace",
      })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);

    this.input.keyboard!.once("keydown-SPACE", () => this.scene.restart());
    this.input.once("pointerdown", () => this.scene.restart());
  }
}
