import Enemy from './Enemy.js';
import CONFIG from '../config.js';

/**
 * Tiger enemy - Medium strength (2 HP), faster chase
 */
export default class Tiger extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CONFIG.ENEMIES.TIGER, 'tiger');
  }

  chasePlayer(player) {
    // Tigers chase faster than they patrol
    const direction = player.x > this.x ? 1 : -1;
    this.body.setVelocityX(direction * this.speed * 1.3);

    // Flip sprite based on direction
    this.setFlipX(direction < 0);
  }
}
