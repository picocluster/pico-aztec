import Phaser from 'phaser';

/**
 * Stairs for climbing between levels
 */
export default class Stairs extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height, direction = 'right') {
    super(scene, x, y, 'stairs');

    this.scene = scene;
    this.direction = direction; // 'right' (up-right) or 'left' (up-left)

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Scale sprite to fit desired dimensions
    this.setDisplaySize(width, height);

    // Flip horizontally for left-going stairs
    if (direction === 'left') {
      this.setFlipX(true);
    }
  }
}
