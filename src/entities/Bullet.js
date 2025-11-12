import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Bullet projectile
 */
export default class Bullet extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, direction) {
    super(scene, x, y, 8, 4, 0xFFFF00);

    this.scene = scene;
    this.direction = direction; // 1 = right, -1 = left

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set velocity
    this.body.setVelocityX(CONFIG.BULLET_SPEED * direction);
    this.body.setAllowGravity(false);

    // Auto-destroy after 2 seconds
    scene.time.delayedCall(2000, () => {
      if (this.active) {
        this.destroy();
      }
    });
  }

  update() {
    // Destroy if out of bounds
    if (this.x < 0 || this.x > this.scene.physics.world.bounds.width) {
      this.destroy();
    }
  }
}
