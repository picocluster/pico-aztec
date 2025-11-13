import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Base Enemy class
 * Handles patrol behavior and aggression when player is nearby
 */
export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config, spriteKey) {
    super(scene, x, y, spriteKey);

    this.scene = scene;
    this.config = config;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Enemy stats
    this.maxHealth = config.health;
    this.currentHealth = config.health;
    this.damage = config.damage;
    this.speed = config.speed;
    this.patrolRange = config.patrolRange;
    this.aggroRange = config.aggroRange;
    this.type = config.type;
    this.pointValue = CONFIG.POINTS[config.type.toUpperCase()] || 100;

    // Patrol behavior
    this.spawnX = x;
    this.spawnY = y;
    this.patrolDirection = 1; // 1 = right, -1 = left
    this.isAggro = false;
    this.lastDirectionChange = 0; // Prevent rapid direction changes

    // Physics - use smaller body to match actual sprite content
    const bodyWidth = config.width * 0.7;  // 70% of sprite width
    const bodyHeight = config.height * 0.8; // 80% of sprite height
    this.body.setSize(bodyWidth, bodyHeight);

    // Center the body on the sprite
    const offsetX = (config.width - bodyWidth) / 2;
    const offsetY = (config.height - bodyHeight) / 2;
    this.body.setOffset(offsetX, offsetY);

    this.body.setCollideWorldBounds(true);
    this.body.setBounce(0);

    // Attack cooldown
    this.lastAttackTime = 0;
  }

  update(player) {
    if (!this.active) return;

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    // Check if player is in aggro range
    if (distanceToPlayer < this.aggroRange) {
      this.isAggro = true;
      this.chasePlayer(player);
    } else {
      this.isAggro = false;
      this.patrol();
    }
  }

  patrol() {
    // Simple patrol behavior - move back and forth within range
    const distanceFromSpawn = Math.abs(this.x - this.spawnX);
    const now = Date.now();

    // Only allow direction change if enough time has passed (300ms cooldown)
    const canChangeDirection = now - this.lastDirectionChange > 300;

    if (canChangeDirection) {
      // Check if hitting world bounds or platform edges
      if (this.body.blocked.left && this.patrolDirection < 0) {
        // Only reverse if moving toward the blocked direction
        this.patrolDirection = 1;
        this.lastDirectionChange = now;
      } else if (this.body.blocked.right && this.patrolDirection > 0) {
        // Only reverse if moving toward the blocked direction
        this.patrolDirection = -1;
        this.lastDirectionChange = now;
      } else if (distanceFromSpawn > this.patrolRange) {
        // Reverse direction when reaching patrol limit
        this.patrolDirection *= -1;
        this.lastDirectionChange = now;
      } else if (Math.random() < 0.005) {
        // Random chance to change direction (less frequent)
        this.patrolDirection *= -1;
        this.lastDirectionChange = now;
      }
    }

    this.body.setVelocityX(this.patrolDirection * this.speed * 0.5);

    // Flip sprite based on direction
    this.setFlipX(this.patrolDirection < 0);
  }

  chasePlayer(player) {
    // Move toward player
    const direction = player.x > this.x ? 1 : -1;
    this.body.setVelocityX(direction * this.speed);

    // Flip sprite based on direction
    this.setFlipX(direction < 0);
  }

  takeDamage(amount) {
    this.currentHealth -= amount;

    // Flash white when hit
    this.setTint(0xFFFFFF);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    if (this.currentHealth <= 0) {
      this.die();
    }

    return this.currentHealth <= 0;
  }

  die() {
    // Death animation - fade out
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  attackPlayer(player) {
    const now = Date.now();
    if (now - this.lastAttackTime > CONFIG.ATTACK_COOLDOWN) {
      this.lastAttackTime = now;
      return this.damage;
    }
    return 0;
  }
}
