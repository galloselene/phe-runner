import Phaser from "phaser";
import { CONFIG, TIER_COLORS } from "../config";

// Title / explanation screen. First-time players need the PKU premise and the
// two-meter rules before they are dropped into the run.
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const { width } = CONFIG;
    this.cameras.main.setBackgroundColor("#15172b");

    const cx = width / 2;

    // Title
    this.add
      .text(cx, 30, "PHE RUNNER", {
        fontSize: "40px", color: "#ffd34d", fontStyle: "bold", fontFamily: "monospace",
      })
      .setOrigin(0.5, 0);
    this.add
      .text(cx, 74, "Living with PKU, one level at a time", {
        fontSize: "13px", color: "#9fb3c8", fontFamily: "monospace",
      })
      .setOrigin(0.5, 0);

    // Premise
    this.add
      .text(
        cx,
        102,
        "You have PKU. Your body can't break down phenylalanine (Phe), the building\n" +
          "block in protein. Too much Phe is toxic. A special formula keeps you safe.",
        {
          fontSize: "12px", color: "#dfe6ee", align: "center",
          fontFamily: "monospace", lineSpacing: 4,
        },
      )
      .setOrigin(0.5, 0);

    // Two-meter illustration
    const g = this.add.graphics();
    const barX = 250;
    const barW = 300;

    // Phe bar (zones)
    this.label(70, 152, "PHE", "#ff8a7a");
    this.zoneBar(g, barX, 152, barW, 16);
    this.add
      .text(barX + barW + 12, 152, "keep OUT of the red", {
        fontSize: "11px", color: "#ff8a7a", fontFamily: "monospace",
      })
      .setOrigin(0, 0);

    // Energy bar
    this.label(70, 184, "ENERGY", "#7CFC9B");
    g.fillStyle(0x143b2a, 1);
    g.fillRoundedRect(barX, 184, barW, 14, 4);
    g.fillStyle(0x2ecc71, 1);
    g.fillRoundedRect(barX, 184, barW * 0.62, 14, 4);
    g.lineStyle(2, 0xffffff, 0.7);
    g.strokeRoundedRect(barX, 184, barW, 14, 4);
    this.add
      .text(barX + barW + 12, 183, "don't let it empty", {
        fontSize: "11px", color: "#7CFC9B", fontFamily: "monospace",
      })
      .setOrigin(0, 0);

    // Rules / food legend
    const rules = [
      "🍎🥕🍌  free foods - safe, light fuel",
      "🍝🍞  low-protein staples - safe, BIG fuel",
      "🥔🥦  count carefully - some Phe",
      "🧀🍖🥚  high-Phe - JUMP OVER these, they spike your Phe",
      "🥤  formula - drops Phe, refuels energy, speed boost (press F)",
    ];
    this.add
      .text(cx, 220, rules.join("\n"), {
        fontSize: "13px", color: "#e8eef4", align: "left",
        fontFamily: "monospace", lineSpacing: 6,
      })
      .setOrigin(0.5, 0);

    // Controls box
    this.add
      .rectangle(cx, 350, 560, 30, 0x0f3460, 0.9)
      .setOrigin(0.5);
    this.add
      .text(cx, 350, "→ auto-run     SPACE / ↑  jump     F  drink formula", {
        fontSize: "13px", color: "#ffffff", fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Goal line
    this.add
      .text(cx, 384, "Reach the 🏁 before time runs out, keeping Phe in the green.", {
        fontSize: "12px", color: "#9fb3c8", fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Start prompt (pulsing)
    const start = this.add
      .text(cx, 420, "Press SPACE to start", {
        fontSize: "17px", color: "#ffd34d", fontStyle: "bold", fontFamily: "monospace",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: start, alpha: { from: 1, to: 0.3 },
      duration: 600, yoyo: true, repeat: -1,
    });

    const go = () => this.scene.start("GameScene");
    this.input.keyboard!.once("keydown-SPACE", go);
    this.input.once("pointerdown", go);
  }

  private label(x: number, y: number, text: string, color: string) {
    this.add.text(x, y, text, {
      fontSize: "13px", color, fontStyle: "bold", fontFamily: "monospace",
    });
  }

  private zoneBar(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    const safeW = (CONFIG.phe.safeMax / CONFIG.meterMax) * w;
    const warnW = (CONFIG.phe.warnMax / CONFIG.meterMax) * w;
    g.fillStyle(TIER_COLORS[1], 0.9);
    g.fillRect(x, y, safeW, h);
    g.fillStyle(TIER_COLORS[3], 0.9);
    g.fillRect(x + safeW, y, warnW - safeW, h);
    g.fillStyle(TIER_COLORS[4], 0.9);
    g.fillRect(x + warnW, y, w - warnW, h);
    g.lineStyle(2, 0xffffff, 0.8);
    g.strokeRoundedRect(x, y, w, h, 4);
  }
}
