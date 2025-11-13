import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Treasure chest that contains items
 */
export default class TreasureChest extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'chest');

    this.scene = scene;
    this.isOpened = false;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Determine loot
    this.loot = this.generateLoot();
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

    // Open animation - bounce and tint
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.8,
      angle: 10,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.setTint(0x666666); // Darken to show it's opened
      }
    });

    return this.loot;
  }
}
