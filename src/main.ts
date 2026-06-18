import Phaser from "phaser";
import { CONFIG } from "./config";
import GameScene from "./scenes/GameScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: CONFIG.width,
  height: CONFIG.height,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: CONFIG.gravity },
      debug: false,
    },
  },
  scene: [GameScene],
});
