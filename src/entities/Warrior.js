import Enemy from './Enemy.js';
import CONFIG from '../config.js';

/**
 * Warrior enemy - Strong (3 HP), tactical movement
 */
export default class Warrior extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CONFIG.ENEMIES.WARRIOR, 'warrior');
  }

  chasePlayer(player) {
    super.chasePlayer(player);

    // Warriors occasionally jump toward player
    if (this.body.touching.down && Math.random() < 0.03) {
      this.body.setVelocityY(-250);
    }
  }
}
