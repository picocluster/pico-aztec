import Phaser from 'phaser';

/**
 * Stairs for climbing between levels
 */
export default class Stairs extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, width, height, direction = 'up') {
    super(scene, x, y, 'stairs');

    this.scene = scene;
    this.direction = direction; // 'up' or 'down'

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Scale sprite to fit desired dimensions
    this.setDisplaySize(width, height);

    // Rotate 45 degrees clockwise
    this.setAngle(45);
  }
}
