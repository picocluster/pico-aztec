import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Treasure chest that contains items
 */
export default class TreasureChest extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 24, 20, 0x8B4513);

    this.scene = scene;
    this.isOpened = false;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Determine loot
    this.loot = this.generateLoot();

    // Visual indicator (closed chest)
    this.lid = scene.add.rectangle(x, y - 4, 24, 8, 0xD2691E);
  }

  generateLoot() {
    const rand = Math.random();

    if (rand < CONFIG.CHEST_LOOT.GUN) {
      return 'gun';
    } else if (rand < CONFIG.CHEST_LOOT.GUN + CONFIG.CHEST_LOOT.BULLETS) {
      return 'bullets';
    } else {
      return 'machete';
    }
  }

  open() {
    if (this.isOpened) return null;

    this.isOpened = true;

    // Open animation - lift lid
    this.scene.tweens.add({
      targets: this.lid,
      y: this.y - 12,
      angle: -45,
      duration: 200
    });

    // Change color to indicate opened
    this.setFillStyle(0x654321);

    return this.loot;
  }

  destroy() {
    if (this.lid) {
      this.lid.destroy();
    }
    super.destroy();
  }
}
