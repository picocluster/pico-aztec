import Phaser from 'phaser';
import CONFIG from '../config.js';

/**
 * Base Enemy class
 * Handles patrol behavior and aggression when player is nearby
 */
export default class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config) {
    super(scene, x, y);

    this.scene = scene;
    this.config = config;

    // Create main body sprite
    this.body = scene.add.rectangle(0, 0, config.width, config.height, config.color);
    this.add(this.body);

    // Add accent details for visual interest
    if (config.accentColor) {
      this.accent = scene.add.rectangle(0, 2, config.width * 0.6, config.height * 0.3, config.accentColor);
      this.add(this.accent);
    }

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

    // Physics
    this.body.setSize(config.width, config.height);
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

    if (distanceFromSpawn > this.patrolRange) {
      // Reverse direction when reaching patrol limit
      this.patrolDirection *= -1;
    }

    // Random chance to change direction
    if (Math.random() < 0.01) {
      this.patrolDirection *= -1;
    }

    this.body.setVelocityX(this.patrolDirection * this.speed * 0.5);
  }

  chasePlayer(player) {
    // Move toward player
    const direction = player.x > this.x ? 1 : -1;
    this.body.setVelocityX(direction * this.speed);
  }

  takeDamage(amount) {
    this.currentHealth -= amount;

    // Flash white when hit
    this.body.setFillStyle(0xFFFFFF);
    this.scene.time.delayedCall(100, () => {
      this.body.setFillStyle(this.config.color);
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
