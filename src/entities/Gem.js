import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Collectible gem
 */
export default class Gem extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 8, 8, 0x00FFFF);

    this.scene = scene;
    this.collected = false;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Pulsing animation
    scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  collect() {
    if (this.collected) return 0;

    this.collected = true;

    // Fade out animation
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });

    return CONFIG.POINTS.GEM;
  }
}
