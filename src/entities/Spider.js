import Enemy from './Enemy.js';
import CONFIG from '../config.js';

/**
 * Spider enemy - Fast, weak (1 HP)
 */
export default class Spider extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CONFIG.ENEMIES.SPIDER, 'spider');

    // Spiders can move erratically
    this.erraticMovement = true;
  }

  patrol() {
    super.patrol();

    // Add erratic movement
    if (this.erraticMovement && Math.random() < 0.05) {
      this.body.setVelocityY(-150);
    }
  }
}
