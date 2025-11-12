import Phaser from 'phaser';

/**
 * Stairs for climbing between levels
 */
export default class Stairs extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, direction = 'up') {
    super(scene, x, y, width, height, 0x696969);

    this.scene = scene;
    this.direction = direction; // 'up' or 'down'

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Visual indicator - add diagonal lines to show stairs
    const graphics = scene.add.graphics();
    graphics.lineStyle(2, 0x808080, 1);

    const steps = 5;
    const stepWidth = width / steps;
    const stepHeight = height / steps;

    for (let i = 0; i < steps; i++) {
      const startX = x - width / 2 + (i * stepWidth);
      const startY = y - height / 2 + (i * stepHeight);
      graphics.strokeRect(startX, startY, stepWidth, stepHeight);
    }

    this.graphics = graphics;
  }

  destroy() {
    if (this.graphics) {
      this.graphics.destroy();
    }
    super.destroy();
  }
}
